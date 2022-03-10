
            const express = require("express");

//Esto es para las rutas genericas
class Routes {
    router = global.app.config.get('api:prefix');
    constructor(controller, model) {
        controller = new controller(model)
            // if (model.name !== 'show' /* && model.name === 'ejemplo'*/ ) {
        var ensureAuthenticated = global.app.security.ensureAuthenticated()
        var RolePermissionAuthentication = global.app.security.RolePermissionAuthentication();
        // } else {
        //     var ensureAuthenticated = (req, res, next) => { return next() };
        //     var RolePermissionAuthentication = (req, res, next) => { return next() };
        // }
        //Collection
        global.app.express
            .route(this.router + "/" + model.name + "/")
            .put(ensureAuthenticated, RolePermissionAuthentication, controller.findByParameters)
            .post(ensureAuthenticated, RolePermissionAuthentication, controller.create)
            .patch(ensureAuthenticated, RolePermissionAuthentication, controller.update_multiple)
            .delete(ensureAuthenticated, RolePermissionAuthentication, controller.delete_multiple);
        //Single
        global.app.express
            .route(this.router + "/" + model.name + "/:Id")
            .put(ensureAuthenticated, RolePermissionAuthentication, controller.findById)
            .patch(ensureAuthenticated, RolePermissionAuthentication, controller.update)
            .delete(ensureAuthenticated, RolePermissionAuthentication, controller.delete);
    }
}
module.exports = Routes;
            