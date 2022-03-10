/**
 * Created by zxc on 26/03/18.
 */
'use strict';
var jwt = require('jsonwebtoken');
var lodash = require('lodash');
module.exports = function(req, res) {
    var error = ""
    var jsonAPI = global.app.utils.jsonAPI;
    var models = global.app.orm.sequelize.models;
    var body = req.body
    if (body instanceof Array) {
        error = new Error("El body de la peticion debe ser un objeto");
        return res.status(400)
            .json(jsonAPI.processErrors(error, req, { file: __filename }));
    } else {
        var errorString = []
        for (let i in body) {
            if (i !== 'code' && i !== 'new_password' && i !== 'old_password' && i !== 'email') {
                errorString.push(i)
            }
        }
        if (errorString.length > 0) {
            var error = "Los atributos "
            for (let index = 0; index < errorString.length; index++) {
                if (index === 0) {
                    error = error + errorString[index]
                } else {
                    error = error + ", " + errorString[index]
                }
            }
            error = new Error(error + ' no son validos para efectuar la peticion');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }
        if (!body.hasOwnProperty('new_password')) {
            error = new Error('Debe especificar cual va a ser la nueva contrasena');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }
        if (!body.hasOwnProperty('email')) {
            error = new Error('Debe especificar el email');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }
        if (body.hasOwnProperty('code') && body.hasOwnProperty('old_password')) {
            error = new Error('El code es para cuando existe un olvido de contrasena y el old_password es para cambiar de contrasena concientemente');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }
        if (body.hasOwnProperty('code')) {
            return models.person.findAll({
                    where: {
                        email: body.email,
                        confirmCode: body.code
                    }
                })
                .then(persons => {
                    if (persons.length === 0) {
                        error = new Error('No existe ningún usuario con ese código e email');
                        return res.status(404)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    } else {
                        if (persons[0].status !== 'enabled') {
                            error = new Error('El usuario tiene que estar en estado enabled');
                            return res.status(404)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        }
                        return persons[0].update({
                                password: body.new_password
                            })
                            .then(() => {
                                return res.sendStatus(200)
                            })
                            .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                                global.app.utils.logger.error(error, {
                                    module: 'auth/sign-up',
                                    submodule: 'routes',
                                    stack: error.stack
                                });
                                return res.status(400)
                                    .json(jsonAPI.processErrors(error, req, {
                                        file: __filename
                                    }));
                            }).catch(function(error) {
                                global.app.utils.logger.error(error, {
                                    module: 'auth/sign-up',
                                    submodule: 'routes',
                                    stack: error.stack
                                });
                                return res.status(500)
                                    .json(jsonAPI.processErrors(error, req, {
                                        file: __filename
                                    }));
                            });
                    }
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: 'auth/sign-up',
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, {
                            file: __filename
                        }));
                }).catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: 'auth/sign-up',
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, {
                            file: __filename
                        }));
                });
        } else if (body.hasOwnProperty('old_password')) {
            return models.person.findAll({
                    where: {
                        email: body.email,
                    }
                })
                .then(persons => {
                    if (persons.length === 0) {
                        error = new Error('No existe ningún usuario con ese email');
                        return res.status(404)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    } else {
                        if (persons[0].status !== 'enabled') {
                            error = new Error('El usuario tiene que estar en estado enabled');
                            return res.status(404)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        }
                        if (!persons[0].isValidPassword(body.old_password)) {
                            error = new Error('Contrasena incorrecta');
                            return res.status(404)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        } else {
                            persons[0].update({
                                    password: body.new_password
                                })
                                .then(() => {
                                    return res.sendStatus(200)
                                })
                                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                                    global.app.utils.logger.error(error, {
                                        module: 'auth/sign-up',
                                        submodule: 'routes',
                                        stack: error.stack
                                    });
                                    return res.status(400)
                                        .json(jsonAPI.processErrors(error, req, {
                                            file: __filename
                                        }));
                                }).catch(function(error) {
                                    global.app.utils.logger.error(error, {
                                        module: 'auth/sign-up',
                                        submodule: 'routes',
                                        stack: error.stack
                                    });
                                    return res.status(500)
                                        .json(jsonAPI.processErrors(error, req, {
                                            file: __filename
                                        }));
                                });
                        }
                    }
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: 'auth/sign-up',
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, {
                            file: __filename
                        }));
                }).catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: 'auth/sign-up',
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, {
                            file: __filename
                        }));
                });
        } else {
            error = new Error('Debe especificar un code para cuando existe un olvido de contrasena o el old_password para cambiar de contrasena concientemente');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }
    }
};