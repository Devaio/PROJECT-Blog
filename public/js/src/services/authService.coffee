angular.module 'BlogApp'
	.service 'authService', ['$http', '$location', ($http, $location) ->
		
		this.authCheck = (cb) ->
			$http.get '/api/me'
				.then (returnData) ->
					console.log 'RETURN FROM ME', returnData.data
					if returnData.data.user
						cb(returnData.data.user)
					else
						$location.url '/'
						
	]