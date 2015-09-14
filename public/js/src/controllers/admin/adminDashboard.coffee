angular.module 'BlogApp'
	.controller 'adminDashboard', ['$scope','authService', ($scope, authService) ->
		authService (stuff) ->
			console.log '!', stuff
		
	]