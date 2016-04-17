angular.module 'BlogApp'
	.controller 'tagCont', [
		'$scope',
		'$sce', 
		'$stateParams',
		'postTagFactory', 
		'$location', 
		'socialFactory',
		($scope, $sce, $stateParams, postTagFactory, $location, socialFactory) ->
			$scope.navheight = 'small'
			
			$scope.tag = postTagFactory.tagModel.get({name : $stateParams.name})
			$scope.$sce = $sce
			
			$scope.posts = postTagFactory.postModel.query({tag : $stateParams.name, page : $stateParams.pageNum})
			$scope.nextPage = parseInt($stateParams.pageNum or 1) + 1 		
			$scope.showNextPage = true
			
			if parseInt($stateParams.pageNum) <= 1
				$location.url("/tags/#{$stateParams.name}")

			$scope.$watch 'posts.length', () ->
				
				if $scope.posts.length < 10
					$scope.showNextPage = null
				else
					$scope.nextPage = parseInt($stateParams.pageNum or 1) + 1 		
					$scope.showNextPage = true	

			
	]