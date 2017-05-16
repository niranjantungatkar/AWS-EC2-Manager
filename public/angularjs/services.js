// /**
//  * Created by Mak on 5/15/17.
//  */
//
// systemAdminApp.service('metricsService', function($http,$scope){
//
//     data=[];
// console.log("inside services");
//     this.getMetric= function(metric,id,unitType) {
//
//          $http({
//             method:'GET',
//             url:'/metric',
//             params: {
//                 metricName : metric,
//                 startTime: new Date('Sun May 14 2017 18:00:00 GMT-0800 (PST)'),
//                 endTime: new Date('Mon May 15 2017 18:00:00 GMT-0800 (PST)'),
//                 instanceId : id, //something like this - i-0b5049fdc1735efc8
//                 unit : unitType
//
//             }
//         }).then(function(res){
//
//             console.log("INSIDE SERVICE===>",res);
//             data.push(res.data);
//                 $scope.data=data;
//              console.log("INSIDE SERVICE DATA===>",data);
//          });
//         }
//
//      this.data = function(){
//
//         console.log("data callled==>",data);
//         return data;
//
//      }
//
// })
