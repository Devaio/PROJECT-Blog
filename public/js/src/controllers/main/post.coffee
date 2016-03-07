angular.module 'BlogApp'
	.controller 'postCont', [
		'$scope',
		'$sce', 
		'$stateParams',
		'postTagFactory', 
		'$location', 
		'$window',
		'$http', 
		($scope, $sce, $stateParams, postTagFactory, $location, $window, $http) ->
			$scope.navheight = 'small'
			# console.log $stateParams, $location.$$absUrl
			$scope.newComment = {}
			$scope.url = $location.$$absUrl
			
			$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

			$scope.$sce = $sce
			
			$scope.pinIt = () ->
				img = ($scope.post.pinImg)
				console.log(img)
				$window.myWindow = $window.open('https://www.pinterest.com/pin/create/button/?url=' + $scope.url + '&media=' + encodeURIComponent(img) + '&description=' +  encodeURIComponent($scope.post.title),'MyWindow','width=600,height=400')
				return true
				
			$scope.submitComment = () ->
				console.log $scope.newComment
				if not $scope.newComment.name or
					not $scope.newComment.content or
					not $scope.newComment.content.length
						$scope.errorMsg = 'Please fill out the form!'
						
				else
					$http.post '/api/comments/' + $stateParams.id, $scope.newComment
						.then (returnData) ->
							console.log 'COMMENTNRETURN', returnData
							$scope.newComment = {}
							$scope.errorMsg = ''
							$scope.successMsg = 'Thanks!  Your comment is awaiting moderation.'
							
			$http.get '/api/me'
				.then (returnData) ->
					if returnData.data.user
						$scope.user = returnData.data.user
		]
	
