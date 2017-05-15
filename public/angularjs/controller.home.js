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
})