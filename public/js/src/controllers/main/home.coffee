angular.module 'BlogApp'
	.controller 'homeCont', ['$scope','$sce', 'postTagFactory', '$stateParams','$location', ($scope, $sce, postTagFactory,$stateParams, $location) ->
		$scope.navheight = 'large'
		# console.log 'hello!', postTagFactory
		$scope.posts = postTagFactory.posts($stateParams.pageNum)
		$scope.nextPage = parseInt($stateParams.pageNum or 1) + 1 		

		if parseInt($stateParams.pageNum) is 1
			$location.url('/')
		
		if $scope.posts.length < 10
			console.log $scope.posts.length
			$scope.nextPage = null
			
		if $scope.posts.length is 0
			$location.url('/pages/' + parseInt($stateParams.pageNum) - 1)
			
		
		$scope.$sce = $sce

		$scope.something = () ->
			# alert 'DONT TOUCH ME!'
	]