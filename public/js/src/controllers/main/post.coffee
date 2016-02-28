angular.module 'BlogApp'
	.controller 'postCont', ['$scope','$sce', '$stateParams','postTagFactory', '$location', '$window', ($scope, $sce, $stateParams, postTagFactory, $location, $window) ->
		$scope.navheight = 'small'
		# console.log $stateParams, $location.$$absUrl
		
		$scope.url = $location.$$absUrl
		
		$scope.post = postTagFactory.postModel.get({id : $stateParams.id})

		$scope.$sce = $sce
		
		$scope.pinIt = () ->
			img = ($scope.post.pinImg)
			console.log(img)
			$window.myWindow = $window.open('https://www.pinterest.com/pin/create/button/?url=' + $scope.url + '&media=' + encodeURIComponent(img) + '&description=' +  encodeURIComponent($scope.post.title),'MyWindow','width=600,height=400')
			return true
	]
	
