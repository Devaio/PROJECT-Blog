angular.module 'BlogApp'
	.controller 'adminDashboard', ['$scope','$location', 'authService', ($scope, $location, authService) ->
		$scope.navheight = 'small'
		authService (stuff) ->
			console.log '!', stuff
			
			$scope.addPost = () ->
				$location.url '/admin/addpost'
	]