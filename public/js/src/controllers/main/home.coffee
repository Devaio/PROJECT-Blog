angular.module 'BlogApp'
	.controller 'homeCont', [
		'$scope',
		'$sce', 
		'postTagFactory', 
		'$stateParams',
		'$location', 
		'socialFactory', 
		($scope, $sce, postTagFactory,$stateParams, $location, socialFactory) ->
			$scope.navheight = 'large'
			# console.log 'hello!', postTagFactory
			console.log($scope, socialFactory)
			$scope.socialData = socialFactory.socialData
			$scope.posts = postTagFactory.posts($stateParams.pageNum)
			$scope.nextPage = parseInt($stateParams.pageNum or 1) + 1 		
			$scope.showNextPage = true
			
			postTagFactory.random (data) ->
				
				$scope.morePosts = data
			
			if parseInt($stateParams.pageNum or 1) <= 1
				$location.url('/')
			
			$scope.$watch 'posts.length', () ->
				
				if $scope.posts.length < 10
					$scope.showNextPage = null
				else
					$scope.nextPage = parseInt($stateParams.pageNum or 1) + 1
					$scope.showNextPage = true	
				
				# if $scope.posts.length is 0
				# 	$location.url('/pages/' + (parseInt($stateParams.pageNum or 1) - 1))
			$scope.$sce = $sce
			$scope.commentLengthChecker = (post) ->
				totalComments = post.comments.reduce (rt, cn) ->
					countCurrent = if cn.approved then 1 else 0
					# countSubs = if cn.approved then cn.subComments.length else 0
					return rt + countCurrent
				, 0
				return totalComments
	]
	