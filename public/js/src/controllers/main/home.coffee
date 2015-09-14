angular.module 'BlogApp'
	.controller 'homeCont', ['$scope', ($scope) ->
		$scope.test = 'hello'

		console.log 'hello!'

		$scope.something = () ->
			# alert 'DONT TOUCH ME!'
	]