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
    var query = req.query
    if (query.hasOwnProperty('code')) {
        var errorString = []
        for (let i in query) {
            if (i !== 'code') {
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
        return models.person.findAll({
                where: {
                    confirmCode: query.code,
                    status: "pendingSignUpVerification"
                }
            })
            .then(persons => {
                if (persons.length === 0) {
                    error = new Error('No existe ningún usuario con ese código y que se encuentre pendiente de confirmación');
                    return res.status(404)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                } else {
                    return persons[0].update({
                            status: "enabled"
                        })
                        .then(() => {
                            persons[0].status = "enabled"
                            return res.status(200).json({
                                data: persons[0]
                            });
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
    } else {
        error = new Error("Faltan parametros para ejecutar el servicio de confirm. Asegurese de enviar los atributos necesarios");
        return res.status(400)
            .json(jsonAPI.processErrors(error, req, { file: __filename }));
    }

};