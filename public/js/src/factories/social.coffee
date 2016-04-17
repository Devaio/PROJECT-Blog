angular.module('BlogApp')
	.factory('socialFactory', ['$resource', '$stateParams', '$http', ($resource,$stateParams, $http) ->
        socialData = {}
		
        $http.get('https://api.pinterest.com/v1/me/pins/?access_token=AaMv-yr8NsypzC7J-M4ljuoP0F4TFEY4A4PaXCxDBkAMyiAp6QAAAAA&fields=id%2Cnote%2Curl%2Cimage')
            .then (returnData) ->
               socialData.sidebarPins = returnData.data.data.slice(0, 12)
        return {
            socialData : socialData
        }
])
	
	