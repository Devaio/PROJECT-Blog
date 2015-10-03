angular.module 'BlogApp'
	.controller 'adminAddPost', ['$scope','$location', '$http','$timeout', 'authService', ($scope, $location, $http, $timeout, authService) ->
		$scope.navheight = 'small'
		$scope.loading = false

		$scope.newPost = {
			tags : []
		}

		
		authService (stuff) ->
			console.log '!', stuff
			
			$scope.submitPost = () ->	
				console.log $scope.newPost
				if $scope.newPost?.content?.length
					$scope.loading = true
					console.log $scope.newPost
					
					$http.post('/api/posts', $scope.newPost)
						.then (returnData) ->
							console.log returnData
							$scope.loading = false
							$timeout () ->
								$location.url('/posts/' + returnData.data._id)
							
					
	]