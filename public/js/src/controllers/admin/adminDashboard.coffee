angular.module 'BlogApp'
	.controller 'adminDashboard', ['$scope','$location', 'authService', ($scope, $location, authService) ->
		$scope.navheight = 'small'
		authService (stuff) ->
			
			$scope.addPost = () ->
				$location.url '/admin/addpost'
				
			$scope.updatePost = () ->
				$location.url '/admin/updatepost'
				
			$scope.moderateComments = () ->
				$location.url '/admin/moderatecomments'
	]