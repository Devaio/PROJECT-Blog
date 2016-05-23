angular.module('BlogApp')
	.factory('socialFactory', ['$resource', '$stateParams', '$http', ($resource,$stateParams, $http) ->
        socialData = {}

        $http.get('https://api.pinterest.com/v1/me/pins/?access_token=AaMv-yr8NsypzC7J-M4ljuoP0F4TFEY4A4PaXCxDBkAMyiAp6QAAAAA&fields=id%2Cnote%2Curl%2Cimage')
            .then (returnData) ->
               socialData.sidebarPins = returnData.data.data.slice(0, 12)
        return {
            socialData : socialData
            adInit : () ->
                medianet_width = '160'
                medianet_height = '600'
                medianet_crid = '803252635'
                medianet_versionId = '111299'
                do ->
                    isSSL = 'https:' == document.location.protocol
                    mnSrc = (if isSSL then 'https:' else 'http:') + '//contextual.media.net/nmedianet.js?cid=8CUKDU01E' + (if isSSL then '&https=1' else '')
                    document.write '<scr' + 'ipt type="text/javascript" id="mNSC" src="' + mnSrc + '"></scr' + 'ipt>'
                    return
        }
])
	
	