angular.module 'BlogApp'
	.controller 'postCont', ['$scope','$sce', '$stateParams','postTagFactory', '$location', '$window', ($scope, $sce, $stateParams, postTagFactory, $location, $window) ->
		$scope.navheight = 'small'
		# console.log $stateParams, $location.$$absUrl
		
		$scope.url = $location.$$absUrl
		
		$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

		$scope.$sce = $sce
		
		$scope.pinIt = () ->
			$window.myWindow = $window.open('https://www.pinterest.com/pin/create/button/?url=' + $scope.url + '&media=' + ($scope.post.pinImg || $scope.post.coverImg) + '&description=' + $scope.post.title,'MyWindow','width=600,height=400')
		
	]
	