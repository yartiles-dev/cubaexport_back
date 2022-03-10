/**
 * Created by zxc on 26/03/18.
 */
'use strict';
var jwt = require('jsonwebtoken');
var lodash = require('lodash');
var Validator = require('sequelize').Validator;
module.exports = function(req, res) {
    var error = ""
    var jsonAPI = global.app.utils.jsonAPI;
    var models = global.app.orm.sequelize.models;
    var query = req.query
    if (query.hasOwnProperty('email')) {

        var errorString = []
        for (let i in query) {
            if (i !== "email") {
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

        if (!Validator.isEmail(query.email)) {
            error = new Error('El email especificado no es válido');
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        return models.person.findAll({
                where: {
                    email: query.email
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
                    var date_to_generated_code = new Date()
                    var code = date_to_generated_code.getTime().toString(36) + (Math.floor(Math.random() * (9999 - 1000)) + 1000)
                    return persons[0].update({
                            confirmCode: code
                        })
                        .then(() => {
                            var mailerConfig = global.app.config.get('mailer');
                            const context = {
                                user_identifier: persons[0].email,
                                code: code,
                                url: `http://localhost:6541/v1/confirm?code=${code}`,
                            };
                            var Sequelize = global.app.orm.Sequelize;
                            Sequelize.Promise.all([
                                global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/html', context),
                                global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/text', context)
                            ])
                                .spread((html, text) => {
                                    var mail = {
                                        from: mailerConfig.from,
                                        bcc: [persons[0].email],
                                        subject: "Código de verificación",
                                        text: text,
                                        html: html
                                    };
                                    global.app.utils.mailer.sendMail(mail,
                                        function(err, info) {
                                            if (err) {
                                                global.app.utils.logger.error('Dev mailer', {messages: err.message});
                                            } else {
                                                global.app.utils.logger.info('Dev mailer', {messages: info.response});
                                                global.app.utils.mailer.close();
                                            }
                                        }
                                    );
                                })
                                .catch(console.error);

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
    } else {
        error = new Error("Faltan parametros para ejecutar el servicio de send_code. Asegurese de enviar los atributos necesarios");
        return res.status(400)
            .json(jsonAPI.processErrors(error, req, { file: __filename }));
    }
};