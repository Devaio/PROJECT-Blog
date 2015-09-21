angular.module 'BlogApp'
	.controller 'homeCont', ['$scope', ($scope) ->
		$scope.navheight = 'large'
		console.log 'hello!'

		$scope.something = () ->
			# alert 'DONT TOUCH ME!'
	]