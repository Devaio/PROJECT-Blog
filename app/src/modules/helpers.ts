import { NextFunction, Request, Response } from "express";

class Helpers {

    public queryBuilder (req: Request){
        let queryParams = req.query;

        let id = req.params.id ? req.params.id : null;
        let filter = req.params.filter ? req.params.filter : null;
        let value = req.params.value ? req.params.value : null;
        let sort = req.params.sort ? req.params.sort : null;
        let orderBy = req.params.orderBy ? req.params.orderBy : 'asc';
        let deleted = queryParams.deleted;

        let query = {}
        let sortQuery = {}
        
        if(id){
            query['_id'] = id;
        }

        if(filter){
            if(value){
                query[filter] = value;
            }
        }

        if(sort){
            sortQuery[sort] = 1;
            if(orderBy && (orderBy === 'desc')){
                sortQuery[sort] = -1
            }
        }
        if(deleted){
            query['deleted'] = deleted;
        }

        return {
            query : query,
            sortQuery : sortQuery
        }
        
    }

}

export = new Helpers()