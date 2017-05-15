systemAdminApp.controller('controllerHome', function($scope, $http){
	console.log("In home controller");
	
	
	$scope.createCluster = function() {
		$http({
			method:'POST',
			url:'/cluster',
			data:{
				tag : "Test Cluster"
			}
		}).success(function(data){
			console.log("Successfully created cluster");
			console.log("data ------------------>");
			console.log(data);
		})
	}
	
	
	$scope.getInstancesDetails = function() {
		$http({
			method:'GET',
			url:'/instances'
		}).success(function(data){
			console.log("Fetched instance details");
			console.log("data ------------------>");
			console.log(data);
			console.log("data ------------------>");
		})
	}
	
	
	/*
	 * instanceId - get from above method - this is a compulsory field
	 * startTime & endTime - send a Date object - startTime should be less than endTime and startTime should be greater today's date - 15 days
	 * 
	 * 
	 * Combinations for metrics should be strictly like this
	 * 1. Metric - CPUUtilization
	 * 		{
	 * 			metricName : 'CPUUtilization',
	 * 			startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	 * 			endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	 * 			instanceId : 'this should be the instance id. you will get this from above method', //something like this - i-0b5049fdc1735efc8
	 * 			unit : 'Percent'
	 * 		}
	 * 
	 * 2. Metric - Disk Reads
	 * 		{
	 * 			metricName : 'DiskReads',
	 * 			startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	 * 			endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	 * 			instanceId : 'this should be the instance id. you will get this from above method', //something like this - i-0b5049fdc1735efc8
	 * 			unit : 'Bytes'
	 * 		}
	 * 
	 * 3. Metric - Disk Writes
	 * 		{
	 * 			metricName : 'DiskWrites',
	 * 			startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	 * 			endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	 * 			instanceId : 'i-0b5049fdc1735efc8', //something like this - i-0b5049fdc1735efc8
	 * 			unit : 'Bytes'
	 * 		}
	 * 
	 * 4. Metric - Network Packets In
	 * 		params: {
	 * 			metricName : 'NetworkPacketsIn',
	 * 			startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	 * 			endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	 * 			instanceId : 'i-0b5049fdc1735efc8', //something like this - i-0b5049fdc1735efc8
	 * 			unit : 'Count'
	 * 		}
	 * 
	 * 5. Metric - Network Packets Out
	 * 		params: {
	 * 			metricName : 'NetworkPacketsOut',
	 * 			startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	 * 			endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	 * 			instanceId : 'i-0b5049fdc1735efc8', //something like this - i-0b5049fdc1735efc8
	 * 			unit : 'Count'
	 * 		}
	 * 
	 * 
	 */
	$scope.getMetric = function() {
		$http({
			method:'GET',
			url:'/metric',
			/*params: {
				metricName : 'CPUUtilization',
				startTime : new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'), //
				endTime : new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)') ,
				unit: 'Percent',
				instanceId : 'i-0b5049fdc1735efc8'
			}*/
			params: {
				 metricName : 'NetworkPacketsOut',
				 startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
				 endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
				 instanceId : 'i-0b5049fdc1735efc8', //something like this - i-0b5049fdc1735efc8
				 unit : 'Count'
				  		
			}
		}).success(function(data){
			console.log(data);
		})
	}
	
	
	$scope.stopCluster = function() {
		$http({
			method:'POST',
			url:'/stop/cluster',
			data:{
				instanceId:'i-00d4fcfc24acb56a1'
			}
		}).success(function(data){
			console.log(data);
		})
	}
	
	$scope.startCluster = function() {
		$http({
			method:'POST',
			url:'/start/cluster',
			data:{
				instanceId:'i-00d4fcfc24acb56a1'
			}
		}).success(function(data){
			console.log(data);
		})
	}
	
	
})