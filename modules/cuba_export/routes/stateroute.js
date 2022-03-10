
            const express = require('express')

const routerGenerico = require('./routes')

//Estas son las rutas especificas para productos
class Routes extends routerGenerico {
    constructor(controller,model) {
        super(controller,model)
    }
}
module.exports = Routes
            