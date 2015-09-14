angular.module 'BlogApp'
	.controller 'adminLogin', ['$scope', '$http', '$location', ($scope, $http, $location) ->
		console.log 'adminLogin!'
		$scope.loginProgress = false
		
		$scope.login = () ->
			$scope.loginProgress = true
			$scope.loginError = ''
			
			# Post Login data to server
			$http.post '/admin/login', $scope.adminUser
				.then (returnData) ->
					$scope.loginProgress = false
					
					if returnData.data.error
						$scope.loginError = returnData.data.error
					
					else
						$location.url('/admin/dashboard')
						
	]