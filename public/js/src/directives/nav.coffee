angular.module 'BlogApp'
	.directive 'nav', () ->
		return {
			restrict : 'E'
			templateUrl : '/public/templates/directives/nav.html'
			scope : {
				navheight : '='
			}
			controller : ($scope, $mdSidenav) ->
				$scope.toggleNav = () ->
					# console.log $mdSidenav
					$mdSidenav('right').toggle()
		}