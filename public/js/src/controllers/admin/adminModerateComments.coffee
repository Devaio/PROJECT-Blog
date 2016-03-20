moment = require 'moment'
angular.module 'BlogApp'
	.controller 'adminModerateComments', ['$scope','$location', '$http','$timeout', 'authService', '$sce', ($scope, $location, $http, $timeout, authService, $sce) ->
		
		$scope.navheight = 'small'
		$scope.$sce = $sce
		$scope.moment = moment
			
		authService (stuff) ->
			
			$http.get('/api/comments')
				.then (returnData) ->
					$scope.commentList = returnData.data
					
			$scope.urlCheck = (url) ->
				if !url.match('http://') or !url.match('https://')
					return 'http://' + url
				else
					return url
				
			$scope.approveComment = (comment) ->
				comment.approved = true
				$http.post('/api/comments/' + comment._id, comment)
					
			
			$scope.deleteComment = (comment, index, post) ->
				$http.delete('/api/comments/' + comment._id)
				$scope.commentList[post].splice(index, 1)
			
	]