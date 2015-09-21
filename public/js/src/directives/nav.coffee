angular.module 'BlogApp'
	.directive 'nav', () ->
		return {
			restrict : 'E'
			templateUrl : '/public/templates/directives/nav.html'
			scope : {
				navheight : '='
			}
			link : ($scope) ->
				# console.log '!!', $scope
		}