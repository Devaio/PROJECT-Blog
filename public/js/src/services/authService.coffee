angular.module 'BlogApp'
	.service 'authService', ['$http', '$location', ($http, $location) ->
		
		this.authCheck = (cb) ->
			$http.get '/api/me'
				.then (returnData) ->
					if returnData.data.user
						cb(returnData.data.user)
					else
						console.log 'no user'
						$location.url '/'
						
	]