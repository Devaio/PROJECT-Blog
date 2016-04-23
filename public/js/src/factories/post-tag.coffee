angular.module('BlogApp')
	.factory('postTagFactory', ['$resource', '$stateParams', '$http', ($resource,$stateParams, $http) ->
				
		postModel = $resource('/api/posts/:id', {id : '@_id'})
		
		tagModel = $resource('/api/tags/:id', {id : '@_id'})
			
		return {
			postModel : postModel
			tagModel : tagModel
			posts : (page) ->
				return postModel.query({page : page})
			random : (cb) ->
				$http.get('/api/posts/random?num=5')
					.then (returnData) ->
						cb returnData.data
					
					
				
		}
		
	])
	
	