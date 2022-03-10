const express = require('express')
    //var ensureAuthenticated = global.app.security.ensureAuthenticated();
    //const routerGenerico = require('../routes')

//Estas son las rutas especificas para productos
class Routes {
    router = global.app.config.get('api:prefix');
    constructor(controller) {
        controller = new controller()
            //Collection
        global.app.express
            .route(this.router + "/" + 'generate' + "/")
            .get(controller.generate)
        global.app.express
            .route(this.router + "/" + 'create_migration' + "/")
            .get(controller.create_migration)
        global.app.express
            .route(this.router + "/" + 'generated_json_postman' + "/")
            .get(controller.generated_json_postman)
        global.app.express
            .route(this.router + "/" + 'consume_data' + "/")
            .get(controller.consume_data)
    }
}
module.exports = Routes