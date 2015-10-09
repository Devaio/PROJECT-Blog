angular.module 'BlogApp'
	.controller 'tagCont', ['$scope','$sce', '$stateParams','postTagFactory', ($scope, $sce, $stateParams, postTagFactory) ->
		$scope.navheight = 'small'
		console.log $stateParams
		
		$scope.tag = postTagFactory.tagModel.get({name : $stateParams.name})
		$scope.$sce = $sce
		
		$scope.posts = postTagFactory.postModel.query({tag : $stateParams.name})

		console.log $scope
	]