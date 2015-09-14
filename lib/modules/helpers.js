module.exports = (function() {
  return {
    queryBuilder: function(req) {
      var deleted, filter, id, orderBy, query, queryParams, sort, sortQuery, value;
      queryParams = req.query;
      id = req.params.id != null ? req.params.id : false;
      filter = queryParams.filter != null ? queryParams.filter : false;
      value = queryParams.value != null ? queryParams.value : false;
      sort = queryParams.sort != null ? queryParams.sort : false;
      orderBy = queryParams.orderBy != null ? queryParams.orderBy : 'asc';
      deleted = queryParams.deleted;
      query = {};
      sortQuery = {};
      if (id) {
        query._id = id;
      } else {
        if (filter) {
          if (value) {
            query[filter] = value;
          }
        }
        if (sort) {
          sortQuery[sort] = 1;
          if (orderBy && orderBy === 'desc') {
            sortQuery[sort] = -1;
          }
        }
        if (deleted) {
          query['deleted'] = deleted;
        }
      }
      return {
        query: query,
        sortQuery: sortQuery
      };
    }
  };
})();
