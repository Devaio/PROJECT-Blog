angular.module 'BlogApp'
	.controller 'homeCont', ['$scope','$sce', 'postTagFactory', ($scope, $sce, postTagFactory) ->
		$scope.navheight = 'large'
		# console.log 'hello!', postTagFactory
		$scope.posts = postTagFactory.posts
		$scope.$sce = $sce

		$scope.something = () ->
			# alert 'DONT TOUCH ME!'
	]