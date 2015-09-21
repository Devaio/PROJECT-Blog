angular.module 'BlogApp'
	.controller 'adminAddPost', ['$scope','$location', 'authService', ($scope, $location, authService) ->
		$scope.navheight = 'small'
		$scope.loading = false
		authService (stuff) ->
			console.log '!', stuff
			
			# $scope.addPost = () ->
			# 	$location.url '/admin/addpost'
			
			$scope.submitPost = () ->				
				if $scope.newPost?.length
					$scope.loading = true
	]