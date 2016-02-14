angular.module 'BlogApp'
	.controller 'postCont', ['$scope','$sce', '$stateParams','postTagFactory', '$location', ($scope, $sce, $stateParams, postTagFactory, $location) ->
		$scope.navheight = 'small'
		# console.log $stateParams, $location.$$absUrl
		
		$scope.url = $location.$$absUrl
		
		$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

		$scope.$sce = $sce

		
	]