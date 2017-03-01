"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
        router.get('/*', Middleware.setLocals, RouteContainer.wildCard);
    };
    ViewRoutes.prototype.wildCard = function (req, res) {
        _super.prototype.render.call(this, req, res, 'index');
    };
    return ViewRoutes;
}(route_1.BaseRoute));
exports.ViewRoutes = ViewRoutes;
