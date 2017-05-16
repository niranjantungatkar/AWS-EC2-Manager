systemAdminApp.controller('controllerHome', function($scope, $http,toastr){
	console.log("In home controller");

    getInstancesDetails();
	
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


    function getInstancesDetails () {
		$http({
			method:'GET',
			url:'/instances'
		}).success(function(data){
			console.log("Fetched instance details");
			console.log("data ------------------>");
			console.log(data);
			console.log("data ------------------>");
			$scope.instance=data.data.Reservations;
			console.log($scope.instance);

		})
}


	$scope.instanceAction = function(status,id){


        if(status=='running')
        {
            newStatus="Stop";
            stopCluster(id);
        }else if(status=='stopped')
        {
            newStatus="Start";
            startCluster(id);
        }


	}

	$scope.changeStatus = function(status){
		var newStatus;
		if(status=='running')
		{
			newStatus="Stop";
		}else if(status=='stopped')
		{
            newStatus="Start";
		} else
		{
			newStatus=status;
		}
		return newStatus;
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
   // var dataValue;
	//  function getMetric (metric,id,unitType) {
   //
	// 	return $http({
	// 		method:'GET',
	// 		url:'/metric',
	// 		/*params: {
	// 			metricName : 'CPUUtilization',
	// 			startTime : new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'), //
	// 			endTime : new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)') ,
	// 			unit: 'Percent',
	// 			instanceId : 'i-0b5049fdc1735efc8'
	// 		}*/
	// 		params: {
	// 			 metricName : metric,
	// 			 startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
	// 			 endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
	// 			 instanceId : id, //something like this - i-0b5049fdc1735efc8
	// 			 unit : unitType
	//
	// 		}
	// 	});
   //
	// 	// console.log("dataValue==>insisde==>",dataValue);
	// 	// return dataValue;
	// }

	function setValue(value){

	 	console.log("value==>",value);
	 	dataValue=value;
	 	console.log("dataValue==>",dataValue);

	}
    function getValue(){

		console.log("getValuecalled");
        // console.log("value==>",value);
        // dataValue=value;
       // console.log("getValue===>dataValue==>",dataValue);

    }

	function stopCluster(id)  {
		$http({
			method:'POST',
			url:'/stop/cluster',
			data:{
				instanceId:id
			}
		}).success(function(data){
			toastr.success("Server Instance "+id+"  stopped successfully");
            getInstancesDetails();
			console.log(data);
		})
	}
	
	  function startCluster(id)  {
		$http({
			method:'POST',
			url:'/start/cluster',
			data:{
				instanceId:id
			}
		}).success(function(data){
			console.log(data);
            toastr.success("Server Instance "+id+"  started successfully");
            getInstancesDetails();
		})
	}

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

// Create the chart
    Highcharts.stockChart('container', {
        chart: {
            events: {
                load: function () {

                    // set up the updating of the chart each second
                    var series = this.series[0];
                    setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = Math.round(Math.random() * 100);
                        series.addPoint([x, y], true, true);
                    }, 1000);
                }
            }
        },

        rangeSelector: {
            buttons: [{
                count: 1,
                type: 'minute',
                text: '1M'
            }, {
                count: 5,
                type: 'minute',
                text: '5M'
            }, {
                type: 'all',
                text: 'All'
            }],
            inputEnabled: false,
            selected: 0
        },

        title: {
            text: 'Live random data'
        },

        exporting: {
            enabled: false
        },

        series: [{
            name: 'Random data',
            data: (function () {
                // generate an array of random data
                var data = [],
                    time = (new Date()).getTime(),
                    i;

                for (i = -999; i <= 0; i += 1) {
                    data.push([
                        time + i * 1000,
                        Math.round(Math.random() * 100)
                    ]);
                }
                return data;
            }())
        }]
    });



})