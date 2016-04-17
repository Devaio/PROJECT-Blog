angular.module 'BlogApp'
	.controller 'adminLogin', ['$scope', '$http', '$location', ($scope, $http, $location) ->
		$scope.navheight = 'small'

		$scope.loading = false
		
		$scope.loginFire = () ->
			$scope.loading = true
			$scope.loginError = ''
			
			# Post Login data to server
			$http.post '/admin/login', $scope.adminUser
				.then (returnData) ->
					$scope.loading = false
					
					if returnData.data.error
						$scope.loginError = returnData.data.error
					
					else
						$location.url('/admin/dashboard')
						
	]