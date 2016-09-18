angular.module('BlogApp')
	.factory('socialFactory', ['$resource', '$stateParams', '$http', '$timeout', ($resource,$stateParams, $http, $timeout) ->
        socialFactory = {}
        socialFactory.socialData = {}
        
        $http.get('https://api.pinterest.com/v1/me/pins/?access_token=AaMv-yr8NsypzC7J-M4ljuoP0F4TFEY4A4PaXCxDBkAMyiAp6QAAAAA&fields=id%2Cnote%2Curl%2Cimage')
            .then (returnData) ->
               socialFactory.socialData.sidebarPins = returnData.data.data.slice(0, 12)
        
        socialFactory.subscribe = (sub) ->
            sub.loading = true
            return $http({
                url : '/api/subscribe',
                method : "POST",
                data : {
                    email : sub.email
                }
                
            }).then (resp) ->
                sub.loading = false
                socialFactory.subscribeSuccess = 'Thanks for signing up!'
                sub.email = ''
                $timeout () ->
                    socialFactory.subscribeSuccess = ''
                , 3000

        return socialFactory
])
	
	