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
		($scope, $sce, $stateParams, postTagFactory, $location, $window, $http, $filter, $timeout, socialFactory, authService) ->
			$scope.navheight = 'small'
			$scope.moment = moment
			$scope.newComment = {}
			$scope.url = $location.$$absUrl
			$scope.linky = $filter('linky')
			$scope.socialData = socialFactory.socialData
			$scope.posts = postTagFactory.posts($stateParams.pageNum)
			$scope.socialFactory = socialFactory

			console.log('POST')
			
			postTagFactory.random (data) ->
				
				$scope.morePosts = data
			
			if $location.$$hash is 'comments'
				$scope.commentBox = angular.element('#comments')
				window.scrollTo(0, $scope.commentBox.offsetTop)
			
			$scope.post = postTagFactory.postModel.get({id : window.location.pathname.split('/')[2]})

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
				return 'https://pinterest.com/pin/create/bookmarklet/?url=' + $scope.url + '&media=' + encodeURIComponent(img) + '&description=theviewfromhere.is%20%7C%7C%20' +  encodeURIComponent($scope.post.title)
				
			$scope.submitComment = (form) ->
				# $scope.newComment = {}
				# console.log(form)
				
				
				if not $scope.newComment.name or
					not $scope.newComment.content or
					not $scope.newComment.content.length
						$scope.errorMsg = 'Please fill out the form!'
						
				else
					$http.post '/api/comments/create/' + $scope.post._id, $scope.newComment
						.then (returnData) ->
							$scope.newComment = {
								name : ''
							}
							$scope.errorMsg = ''
							$scope.successMsg = 'Thanks!  Your comment is awaiting moderation.'
							form.$setPristine()
							form.$setUntouched()
							
			$scope.subCommentForm = (comment) ->
				comment.showSubCommentForm = !comment.showSubCommentForm
				
			$scope.submitSubComment = (parentComment, subComment, form) ->
				parentCommentCopy = angular.copy parentComment
				if not subComment.name or
					not subComment.content or
					not subComment.content.length
						subComment.errorMsg = 'Please fill out the form!'
				else
					subComment.isSubComment = true
					subComment.parentComment = parentCommentCopy
					$http.post '/api/comments/create/' + $scope.post._id, subComment
							.then (returnData) ->
								subComment.errorMsg = ''
								subComment.successMsg = 'Thanks!  Your comment is awaiting moderation.'
								subComment.name = ''
								subComment.email = ''
								subComment.website = ''
								subComment.content = ''
								form.$setPristine()
								form.$setUntouched()
								
								$timeout () ->
									parentComment.showSubCommentForm = false
								, 2200
								
								parentCommentCopy.subComments = parentCommentCopy.subComments || []
								parentCommentCopy.subComments.push(returnData.data)
								$http.post('/api/comments/' + parentCommentCopy._id, parentCommentCopy)

			$http.get '/api/me'
				.then (returnData) ->
					if returnData.data.user
						$scope.loggedInUser = returnData.data.user
						$scope.loggedInUser.website = 'http://theviewfromhere.is'
						$scope.loggedInUser.name = 'Clarissa'
				
		]
	
