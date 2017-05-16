var systemAdminApp = angular.module('systemAdminApp',['ui.router','toastr']);
//handles client side routing
systemAdminApp.config(function($stateProvider, $urlRouterProvider){
	
	$urlRouterProvider.
		otherwise('/');
	
	$stateProvider
		.state('home',
				{
					url:'/',
					templateUrl : './templates/homepage.html',
					controller : 'controllerHome'
				}) 
				
}).controller('mainController',function(){});