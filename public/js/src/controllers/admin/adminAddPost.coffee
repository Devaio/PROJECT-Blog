angular.module 'BlogApp'
	.controller 'adminAddPost', ['$scope','$location', '$http', 'authService', ($scope, $location, $http, authService) ->
		$scope.navheight = 'small'
		$scope.loading = false

		$scope.newPost = {
			tags : []
		}

		
		authService (stuff) ->
			console.log '!', stuff
			
			$scope.submitPost = () ->	
				console.log $scope.message			
				# if $scope.newPost?.content?.length
				# 	$scope.loading = true
				# 	console.log $scope.newPost
					
				# 	$http.post('/api/posts', $scope.newPost)
				# 		.then (returnData) ->
				# 			console.log returnData
					
	]