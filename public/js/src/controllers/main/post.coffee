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
		'$timeout',
		'socialFactory',
		($scope, $sce, $stateParams, postTagFactory, $location, $window, $http, $filter, $timeout, socialFactory) ->
			$scope.navheight = 'small'
			$scope.moment = moment
			$scope.newComment = {}
			$scope.url = $location.$$absUrl
			$scope.linky = $filter('linky')
			$scope.socialData = socialFactory.socialData
			$scope.posts = postTagFactory.posts($stateParams.pageNum)
			$scope.socialFactory = socialFactory
			postTagFactory.random (data) ->
				
				$scope.morePosts = data
			
			if $location.$$hash is 'comments'
				$scope.commentBox = angular.element('#comments')
				window.scrollTo(0, $scope.commentBox.offsetTop)
			
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
				$window.myWindow = $window.open('https://www.pinterest.com/pin/create/button/?url=' + $scope.url + '&media=' + encodeURIComponent(img) + '&description=' +  encodeURIComponent($scope.post.title),'MyWindow','width=600,height=400')
				return true
				
			$scope.submitComment = () ->
				if not $scope.newComment.name or
					not $scope.newComment.content or
					not $scope.newComment.content.length
						$scope.errorMsg = 'Please fill out the form!'
						
				else
					$http.post '/api/comments/create/' + $stateParams.id, $scope.newComment
						.then (returnData) ->
							$scope.newComment = {}
							$scope.errorMsg = ''
							$scope.successMsg = 'Thanks!  Your comment is awaiting moderation.'
							
			$scope.subCommentForm = (comment) ->
				comment.showSubCommentForm = !comment.showSubCommentForm
				
			$scope.submitSubComment = (parentComment, subComment) ->
			
				if not subComment.name or
					not subComment.content or
					not subComment.content.length
						subComment.errorMsg = 'Please fill out the form!'
				else
					subComment.isSubComment = true
					
					$http.post '/api/comments/create/' + $stateParams.id, subComment
							.then (returnData) ->
								subComment.errorMsg = ''
								subComment.successMsg = 'Thanks!  Your comment is awaiting moderation.'
								subComment.name = ''
								subComment.email = ''
								subComment.website = ''
								subComment.content = ''
								
								$timeout () ->
									parentComment.showSubCommentForm = false
								, 2200
								
								parentCommentCopy = angular.copy parentComment
								parentCommentCopy.subComments = parentCommentCopy.subComments || []
								parentCommentCopy.subComments.push(returnData.data)
								$http.post('/api/comments/' + parentCommentCopy._id, parentCommentCopy)
				
		]
	
