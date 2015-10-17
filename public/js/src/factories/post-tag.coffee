angular.module('BlogApp')
	.factory('postTagFactory', ['$resource', '$stateParams', ($resource,$stateParams) ->
				
		postModel = $resource('/api/posts/:id', {id : '@_id'})
		
		tagModel = $resource('/api/tags/:id', {id : '@_id'})
			
		return {
			postModel : postModel
			tagModel : tagModel
			posts : (page) ->
				return postModel.query({page : page})
		}
		
	])
	
	