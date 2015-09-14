# Helpers
module.exports = (() ->

	return {

		queryBuilder : (req) ->
			queryParams = req.query
			id = if req.params.id? then req.params.id else false
			filter = if queryParams.filter? then queryParams.filter else false
			value = if queryParams.value? then queryParams.value else false
			sort = if queryParams.sort? then queryParams.sort else false
			orderBy = if queryParams.orderBy? then queryParams.orderBy else 'asc'
			deleted = queryParams.deleted

			query = {}
			sortQuery = {}

			if id 
				query._id = id
			else
				if filter
					if value
						query[filter] = value
				if sort
					sortQuery[sort] = 1
					if orderBy and orderBy is 'desc'
						sortQuery[sort] = -1
				if deleted
					query['deleted'] = deleted

			return {query : query, sortQuery : sortQuery}
	}

)()