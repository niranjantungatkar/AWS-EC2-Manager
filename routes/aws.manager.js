/**
 * http://usejsdoc.org/
 */
var AWS = require('aws-sdk');
// Load credentials and set region from JSON file
AWS.config.loadFromPath('./routes/config.json');

var SSH = require('simple-ssh');

//Create EC2 service object
var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});

//Create cloudWatch service object
var cloudwatch = new AWS.CloudWatch({apiVersion: '2010-08-01'});

exports.createCluster = function(req, res) {
	//Tag name sent by the user
	var tagname = req.param('tag');
	
	var params = {
	   ImageId: 'ami-2c57304c', // custom image
	   InstanceType: 't1.micro',
	   MinCount: 1,
	   MaxCount: 1,
	   SecurityGroupIds: ['test'],
	   KeyName: 'test'
	};

	var flag = false

	// Create the instance
	if(flag == false) {
		ec2.runInstances(params, function(err, data) {
			flag == true;
			
		   	if (err) {
		    	console.log("Could not create instance", err);
		    	res.send({error: {msg: "Error while creating ec2 instance", errorDet: err}})
		      	return;
		   	}
			
		   	console.log("--------> runInstances");
			console.log(data);
			console.log("--------> runInstances");
		   	var instanceId = data.Instances[0].InstanceId;
		   	console.log("Created instance", instanceId);

		   	var describeParams = {
		   		DryRun: false,
		  		Filters: [{
		      		Name: 'instance-id',
		      		Values: [instanceId],	
		      		
		    	}],
		  		InstanceIds: [instanceId]
		  		
		   	}
			
		   	var describeInstances = setInterval(function() {
				ec2.describeInstances(describeParams, function(err, data) {
		  			if (err) {
		  				console.log(err, err.stack); // an error occurred
		  				res.send({ error: { msg: "Error while creating ec2 instance", errorDet: err} })
		  			}
		  			else {
		  				var instanceData = data
		  				console.log("-------->describeInstances");
		  				console.log(describeParams.InstanceIds[0]+" "+data.Reservations[0].Instances[0].State.Name);           // successful response
		  				console.log("-------->describeInstances");
		  				if(data.Reservations[0].Instances[0].State.Name == 'running') {
							console.log("Instance Running");
							console.log(data.Reservations[0].Instances[0])
		  					console.log("<--------------------------------------- End of Describe Instances --------------------------------------------->")
		  					clearInterval(describeInstances);
		  					
		  					var instanceParams = {
		  						DryRun: false,
		  						InstanceIds: [instanceId]
		  					}

		  					var describeInstanceStatus = setInterval(function() {
		  							ec2.describeInstanceStatus(instanceParams, function(err,data) {
		  							if(data.InstanceStatuses.length > 0) {
		  								console.log("Instance --------------------------->");
		  								console.log(data.InstanceStatuses[0].InstanceStatus);
		  								console.log("Instance --------------------------->");
		  								console.log("System --------------------------->");
		  								console.log(data.InstanceStatuses[0].SystemStatus);
		  								console.log("System --------------------------->");
		  								if(data.InstanceStatuses[0].SystemStatus.Details[0].Status=="passed" &&
		  									data.InstanceStatuses[0].InstanceStatus.Details[0].Status=="passed") {

		  									console.log("Instance Running ----->");
									
			  								clearInterval(describeInstanceStatus);
		  									
		  									setTimeout(function() {
		  									  	console.log(instanceData.Reservations[0].Instances[0].PublicDnsName);									
		  										var ssh = new SSH({
		    										host: instanceData.Reservations[0].Instances[0].PublicDnsName,
		    										user: 'ec2-user',
		    										key: require('fs').readFileSync('/home/ec2-user/test.pem',"utf8")
												});
			
												ssh.exec('pwd', {
		    										out: function(stdout) {
		        										console.log("line 1 : "+ stdout);
		    										}
												}).exec('node server.js',{
													out: function(stdout) {
		        										console.log("line 3 : "+ stdout);
		    										}
												}).start();

												ssh.exec('exit',{})
												
												res.send({ success: { msg:"Successfully created", data: instanceData} } );
												
												ssh.on('error', function(err) {
													console.log(err);
												})

												//res.send(instanceData);
		  									}, 60000)
		  								}
		  							} else {
		  								console.log("Instance not running");
		  							}
		  						})},3000);

		  				}
		  			}     
				});		
			},3000)

			//setInterval(describeInstances, 1000);
		   	// Add tags to the instance
		   	params = {Resources: [instanceId], Tags: [
		      			{
		        			Key: 'Name',
		         			Value: tagname
		      			}
		   			]};
		   	ec2.createTags(params, function(err) {
		      	console.log("Tagging instance", err ? "failure" : "success");
		   	});
		});
	}
}


exports.getInstancesDetails = function(req, res) {
	
	var describeParams = {
	   		DryRun: false,
	  		Filters: [{
	      		Name: 'image-id',
	      		Values: ['ami-9c8aedfc']
	    	}]
	   	}
	ec2.describeInstances(describeParams, function(err, data) {
		if(err) {
			res.send({error: true, errMsg: err})
		} else {
			res.send( {success: true, data: data } )
		}
	});
}

exports.getMetricStatisticsForInstance = function(req, res) {
	
	var metricName = req.query.metricName;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var instanceId = req.query.instanceId;
	var unit = req.query.unit;
	
	console.log("------------------------------------------------->");
	console.log(metricName+" "+startTime+" "+endTime+" "+instanceId + " "+unit);
	console.log("------------------------------------------------->");
	
	var params = {
			  EndTime: endTime,
			  MetricName: metricName, 
			  Namespace: 'AWS/EC2', 
			  Period: 60, 
			  StartTime: startTime,
			  Dimensions: [
			    {
			      Name: 'InstanceId', 
			      Value: instanceId 
			    }
			  ],
			  Statistics: [
			     'Average'
			  ],
			  Unit:  unit
			};
	
	cloudwatch.getMetricStatistics(params, function(err, data) {
		  if (err) {
			  console.log(err, err.stack); // an error occurred
			  res.send({error:true, data:err})
		  }
		  else   {
			  
			  console.log(data);           // successful response
			  res.send({success:true, data:data})
		  }
		});
	
}


exports.startCluster = function(req, res) {
	var instanceId = req.param('instanceId');
	var params = {
			  InstanceIds: [ instanceId  ],
			  DryRun: false
			};
			ec2.startInstances(params, function(err, data) {
			  if (err) {
				  console.log(err, err.stack); // an error occurred
				  res.send({error: true, data: err})
			  }
			  else {
				  console.log(data);           // successful response
				  res.send({success: true, data: data})
			  }
			});
}

exports.stopCluster = function(req, res) {
	
	var instanceId = req.param('instanceId');
	var params = {
			  InstanceIds: [ instanceId ],
			  DryRun: false
			  
			};
	ec2.stopInstances(params, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
			res.send({error:true, data: err})
		}
		else {
			console.log(data);           // successful response
			res.send({success: true, data: data});
		}
	});
}




