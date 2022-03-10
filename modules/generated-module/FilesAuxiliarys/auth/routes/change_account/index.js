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
    var id = req.params.id
    if (id !== req.loggedUser.id.toString()) {
        return res.status(403).json({
            errors: [{
                field: "Permission",
                title: "Forbidden"
            }]
        })
    }
    if (body instanceof Array) {
        error = new Error("El body de la peticion debe ser un objeto");
        return res.status(400)
            .json(jsonAPI.processErrors(error, req, { file: __filename }));
    } else {
        // var errorString = []
        // for (let i in body) {
        //     if (i !== 'username' && i !== 'email' && i !== 'name' && i !== 'countryId' && i !== 'age') {
        //         errorString.push(i)
        //     }
        // }
        // if (errorString.length > 0) {
        //     var error = "Los atributos "
        //     for (let index = 0; index < errorString.length; index++) {
        //         if (index === 0) {
        //             error = error + errorString[index]
        //         } else {
        //             error = error + ", " + errorString[index]
        //         }
        //     }
        //     error = new Error(error + ' no son validos para efectuar la peticion');
        //     return res.status(400)
        //         .json(jsonAPI.processErrors(error, req, { file: __filename }));
        // }
        if (body.hasOwnProperty('email')) {
            var date_to_generated_code = new Date()
            var code = date_to_generated_code.getTime().toString(36) + (Math.floor(Math.random() * (9999 - 1000)) + 1000)
            body.status = 'pendingSignUpVerification'
            body.confirmCode = code
        }
        return models.person.update(body, {
                where: {
                    id: id
                }
            })
            .then(() => {
                if (body.hasOwnProperty('email')) {
                    var mailerConfig = global.app.config.get('mailer');
                    const context = {
                        user_identifier: body.email,
                        code: confirmCode,
                        url: `http://localhost:6541/v1/confirm?code=${confirmCode}`,
                    };
                    var Sequelize = global.app.orm.Sequelize;
                    Sequelize.Promise.all([
                        global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/html', context),
                        global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/text', context)
                    ])
                        .spread((html, text) => {
                            var mail = {
                                from: mailerConfig.from,
                                bcc: [body.email],
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
                }
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
};