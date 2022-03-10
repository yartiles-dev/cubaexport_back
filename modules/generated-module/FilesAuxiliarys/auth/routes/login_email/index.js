/**
 * Created by yartiles on 26/03/18.
 */
'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const lodash = require('lodash');
const moment = require('moment');
const {findUser, findUserWithOutRoleByEmail, DateTimeZoneWithOutDate, DateTimezone} = require("../../../../common/utils/helpers-method");
const expiresIn = '36000000'

module.exports = function(req, res) {
    var models = global.app.orm.sequelize.models;
    /**
     * si lo que viene en el authorization empieza con Basic
     * devolvemos el Bearer
     * */
    if (req.header('Authorization') && req.header('Authorization')
        .startsWith('Basic')) {
        /**
         * viene username y password en base 64 separados por :
         *
         * */
        var usernamePassword = new Buffer(req.header('Authorization')
                .split('Basic ')[1], 'base64').toString()
            .split(':');
        // console.log(usernamePassword);
        return findUserWithOutRoleByEmail(usernamePassword[0])
            .then(function(person) {
                if (!person) {
                    return res.status(401)
                        .json({
                            errors: [{
                                field: 'User',
                                title: 'User not found'
                            }]
                        }); //user not found
                }

                loginAdvanced(req, res, person, usernamePassword)

            })
    } else if (req.header('Authorization') && req.header('Authorization')
        .startsWith('Bearer')) {

        var bearer = "";
        try {
            bearer = req.header('Authorization')
                .split('Bearer ')[1];
        } catch (e) {
            return res.status(401).json({
                errors: [{
                    field: "BadAuthentication",
                    title: "Bad authentication"
                }]
            })
        }

        jwt.verify(bearer, global.app.config.get('jwt:secret'), {
                ignoreExpiration: false
            },
            function(err,
                decoded) {
                if (err) {
                    if (err?.name === 'TokenExpiredError') {
                        /**
                         * el token ha expirado, logueese de nuevo
                         * */
                        return res.status(401)
                            .json({
                                errors: [{
                                    field: 'AuthorizationExpired',
                                    title: 'Authorization has expired'
                                }]
                            });
                    }
                    return res.status(401)
                        .json({
                            errors: [{
                                field: 'AuthorizationInvBearer',
                                title: 'Invalid bearer authorization'
                            }]
                        });
                } else {
                    // ESTO ES CODIGO AGREGADO NA MAS PARA LA YURI
                    // if (!bcrypt.compareSync(req.ip, decoded.data.random)) {
                    //     return res.status(401)
                    //         .json({
                    //             errors: [{
                    //                 field: 'AuthorizationInvBearer',
                    //                 title: 'Invalid bearer authorization'
                    //             }]
                    //         });
                    // }

                    return findUserWithOutRoleByEmail(decoded.data.username)
                        .then(function (user) {
                        if (!user) {
                            return res.status(401).json({
                                errors: [{
                                    field: "User",
                                    title: "User not found"
                                }]
                            })
                        }
                        if (user.dataValues.status != undefined && user.dataValues.status !== 'enabled') {
                            return res.status(401).json({
                                errors: [{
                                    field: "status",
                                    title: "User not enabled"
                                }]
                            })
                        }

                        var tokenlastLogout = moment(decoded.data.lastLogout);
                        var personlastLogout = moment(user.dataValues.lastLogout);

                        if (decoded.data.lastLogout == undefined) {
                            return res.status(401).json({
                                errors: [{
                                    field: "AuthorizationOldToken",
                                    title: "old token provided v2."
                                }]
                            })
                        }

                        if (personlastLogout.diff(tokenlastLogout, 'seconds') > 0) {
                            return res.status(401).json({
                                errors: [{
                                    field: "AuthorizationOldToken",
                                    title: "old token provided"
                                }]
                            })
                        } else {
                            // req.loggedUser = user;
                            // return res.sendStatus(200);
                            // Esto es para saber que tiempo le queda autenticado al usuario
                            // const timeOut = ((new Date(decoded.data.date)).getTime() + parseInt(expiresIn)) - (new Date()).getTime()
                            const date_logged_user = (new Date(decoded.data.date)).getTime()
                            const tokenLifeTime = new Date(date_logged_user + parseInt(expiresIn))
                            return res.status(200).json({
                                data: {
                                    Authorization: 'Bearer ' + bearer,
                                    tokenLifeTime
                                }
                            })
                        }
                    }).catch(function (e) {
                        console.log(e);
                        return res.status(401).json({
                            errors: [{
                                field: "AuthorizationErrFindUser",
                                title: e.message
                            }]
                        });
                    })
                }
        })

    } else {
        /**
         * Forma de logueo desconocida
         * */
        return res.status(401)
            .json({
                errors: [{
                    field: 'authentication',
                    title: 'Not valid autentication'
                }]
            });

    }
};

function loginAdvanced(req, res, person, usernamePassword) {
    if (!person.isValidPassword(usernamePassword[1])) {
        return res.status(401)
            .json({
                errors: [{
                    field: 'password',
                    title: 'Wrong password'
                }]
            });
    }
    if (person.status != 'enabled') {
        return res.status(401)
            .json({
                errors: [{
                    field: 'status',
                    title: 'User not enabled'
                }]
            });
    }

    const lastLogin = new Date() //DateTimeZoneWithOutDate()

    const random = bcrypt.hashSync(req.ip, 8)

    var personData = {
        username: person.dataValues.username,
        lastLogout: person.dataValues.lastLogout,
        date: lastLogin, // new Date(),
        lastLogin: lastLogin,
        email: person.dataValues.email,
        random: random,// Math.random(),
        roleName: person.dataValues.role.dataValues.name
    };

    person.dataValues.lastLogin = lastLogin
    person.dataValues.date = lastLogin

    req.tokenLifeTime = expiresIn;
    req.loggedUser = person;

    // 36 millones para q en total sean 10h q es la expiración del token
    var jwtSignature = jwt.sign({
        data: personData,
    }, global.app.config.get('jwt:secret'), {
        expiresIn,
        ...global.app.config.get('jwt:options')
    });

    person
        .update({lastLogin: new Date()}).then(() => {
        return res.status(200).json({
            data: {
                Authorization: 'Bearer ' + jwtSignature,
            }
        })
    });
}