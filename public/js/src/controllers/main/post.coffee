moment = require 'moment'
angular.module 'BlogApp'
	.controller 'postCont', [
		'$scope',
		'$sce', 
		'$stateParams',
		'postTagFactory', 
		'$location', 
		'$window',
		'$http',
		'$filter',
		($scope, $sce, $stateParams, postTagFactory, $location, $window, $http, $filter) ->
			$scope.navheight = 'small'
			$scope.moment = moment
			# console.log $stateParams, $location.$$absUrl
			$scope.newComment = {}
			$scope.url = $location.$$absUrl
			$scope.linky = $filter('linky')

			
			$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

			$scope.$sce = $sce
			$scope.linker = (content) ->
				if content.match(/<[^>]+>/gm)
					return $sce.trustAsHtml(content)
				else
					return $scope.linky(content)
				
			$scope.urlCheck = (url) ->
				if !url.match('http://') or !url.match('https://')
					return 'http://' + url
				else
					return url
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
					$http.post '/api/comments/create/' + $stateParams.id, $scope.newComment
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
	
