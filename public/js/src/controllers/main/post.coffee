angular.module 'BlogApp'
	.controller 'postCont', ['$scope','$sce', '$stateParams','postTagFactory', ($scope, $sce, $stateParams, postTagFactory) ->
		$scope.navheight = 'small'
		console.log $stateParams
		
		$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

		$scope.$sce = $sce

		
	]