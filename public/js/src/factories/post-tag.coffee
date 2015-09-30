angular.module('BlogApp')
	.factory('postTagFactory', ['$resource', ($resource) ->
		
		postModel = $resource('/api/posts/:id', {id : '@_id'})
		
		tagModel = $resource('/api/tags/:id', {id : '@_id'})
		
		
		return {
			postModel : postModel
			tagModel : tagModel
			posts : postModel.query()
		}
		
	])
	
	