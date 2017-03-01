"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseRoute = (function () {
    function BaseRoute() {
        //initialize variables
        // this.title = "The View From Here";
    }
    BaseRoute.prototype.render = function (req, res, view, options) {
        //add title
        // res.locals.title = this.title;
        //render view
        res.render(view, options);
    };
    return BaseRoute;
}());
exports.BaseRoute = BaseRoute;
