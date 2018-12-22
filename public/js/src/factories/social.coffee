angular.module('BlogApp')
	.factory('socialFactory', ['$resource', '$stateParams', '$http', '$timeout', ($resource,$stateParams, $http, $timeout) ->
        socialFactory = {}
        socialFactory.socialData = {}
        
        $http.get('https://api.pinterest.com/v1/me/pins/?access_token=Ai5IOiQg8IAUUVqV3M_9kC9q5CP8FXK5CaTpzTxDBj_v88AsKAE-wDAAAAfQRXx0UFkgb_EAAAAA&fields=id%2Cnote%2Curl%2Cimage')
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
	
	