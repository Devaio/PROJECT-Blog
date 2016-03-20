moment = require 'moment'
angular.module 'BlogApp'
	.controller 'adminModerateComments', ['$scope','$location', '$http','$timeout', 'authService', ($scope, $location, $http, $timeout, authService) ->
		
		$scope.navheight = 'small'
		
		$scope.moment = moment
			
		authService (stuff) ->
			
			$http.get('/api/comments')
				.then (returnData) ->
					$scope.commentList = returnData.data
					
			
			$scope.approveComment = (comment) ->
				comment.approved = true
				$http.post('/api/comments/' + comment._id, comment)
					
			
			$scope.deleteComment = (comment, index, post) ->
				$http.delete('/api/comments/' + comment._id)
				$scope.commentList[post].splice(index, 1)
			
	]