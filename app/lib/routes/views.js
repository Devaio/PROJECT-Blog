"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var route_1 = require("./route");
var Posts = require("../controllers/posts");
var Middleware = require("../modules/middleware");
var ViewRoutes = (function (_super) {
    __extends(ViewRoutes, _super);
    function ViewRoutes() {
        return _super.call(this) || this;
    }
    ViewRoutes.create = function (router) {
        //log
        console.log("[ViewRoutes::create] Creating view routes.");
        var RouteContainer = new ViewRoutes();
        router.get('/posts/:id', Middleware.setLocals, Posts.getPage);
        router.get('/*', RouteContainer.wildCard);
    };
    ViewRoutes.prototype.wildCard = function (req, res) {
        this.render(req, res, 'index');
    };
    return ViewRoutes;
}(route_1.BaseRoute));
exports.ViewRoutes = ViewRoutes;
//# sourceMappingURL=views.js.map