/**
 * Created by yartiles on 30/03/18.
 */

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var moment = require('moment');
const expiresIn = '36000000'
const {servicesWithOutModel} = require('../../app')
const {findUserWithOutRoleByEmail, findUser, DateTimezone} = require("../utils/helpers-method");
exports.ensureAuthenticated = ensureAuthenticated;
exports.basicCheckUser = basicCheckUser;
exports.basicStrategyVerifyCallback = basicStrategyVerifyCallback;
exports.ensureHasPermission = ensureHasPermission;
exports.getPermissionsByUserId = getPermissionsByUserId;
exports.RolePermissionAuthentication = RolePermissionAuthentication;
exports.RolePermissionAuthenticationNested = RolePermissionAuthenticationNested;
exports.ensureAuthenticatedOrNotAutenticated = ensureAuthenticatedOrNotAutenticated

async function RolePermissionAuthenticationNested(nameModel, nameFolderModule, roleId) {
    // var arrayPermission = require('../../modules/' + nameFolderModule + '/models/serverfunction.js').permissions;
    var route = '/v1/' + nameModel
    var result = {
        error: "",
        canAll: ""
    }
    var models = global.app.orm.sequelize.models;
    try {
        var serverfunctions = await models.roleserverfunction.findAll({
            where: {
                "roleId": roleId
            },
            include: [{
                association: "serverfunction",
                where: {
                    "method": "PUT",
                    "route": route,
                    "associatedModel": nameModel
                }
            }]
        })
    } catch (err) {
        return res.status(500)
            .json(jsonAPI.processErrors(err, req, {file: __filename}));
    }
    var find = false
    var RolePermission = {}
    // for (let i = 0; i < arrayPermission.length && !find; i++) {
    //     if (nameModel === arrayPermission[i].associatedModel && arrayPermission[i].route === route && arrayPermission[i].method === 'PUT' && arrayPermission[i].rol === roleId) {
    //         find = true
    //         RolePermission = arrayPermission[i]
    //     }
    // }

    if (serverfunctions.length > 0) {
        find = true
        RolePermission = {
            associatedModel: serverfunctions[0].serverfunction.associatedModel,
            route: serverfunctions[0].serverfunction.route,
            method: serverfunctions[0].serverfunction.method,
            rol: roleId,
            canAll: serverfunctions[0].canAll
        }
    }

    if (!find) {
        result.error = "Forbidden"
    } else {
        if (RolePermission.canAll === "no") {
            result.canAll = "no"
        } else if (RolePermission.canAll === "yes") {
            result.canAll = "yes"
        }
    }
    return result;
}

function RolePermissionAuthentication() {
    var nameFolderModule = global.app.config.get('nameFolderModule')

    var arrayPermission = require('../../modules/' + nameFolderModule + '/models/serverfunction.js').permissions;
    return async function(req, res, next) {
        if (req.loggedUser.status !== 'enabled') {
            return res.status(403).json({
                errors: [{
                    field: "Permission",
                    title: "Forbidden"
                }]
            })
         }

        var models = global.app.orm.sequelize.models;
        var pathOriginal = req.path;
        var pathFinal = ""
        var modelsArr = Object.keys(models);
        pathOriginal.split('/').forEach(e => {
            if (modelsArr.indexOf(e) !== -1 || servicesWithOutModel.indexOf(e) !== -1) {
                pathFinal += "/" + e
            }
        })
        try {
            var serverfunctions = await models.roleserverfunction.findAll({
                where: {
                    "roleId": req.loggedUser.roleId
                },
                include: [{
                    association: "serverfunction",
                    where: {
                        "method": req.method,
                        "route": pathFinal
                    }
                }]
            })
        } catch (err) {
            return res.status(500)
                .json(jsonAPI.processErrors(err, req, {file: __filename}));
        }

        // else if (req.loggedUser.roleId === 4) {
        //     var models = global.app.orm.sequelize.models;
        //     try {
        //         var agencys = await models.agency.findAll({
        //             where: {
        //                 personId: req.loggedUser.id
        //             }
        //         })
        //     } catch (err) {
        //         return res.status(500)
        //             .json(jsonAPI.processErrors(err, req, { file: __filename }));
        //     }
        //
        //     if (agencys.length === 0) {
        //         error = new Error('No existe ninguna agencia asociada a ese usuario');
        //         return res.status(404)
        //             .json(jsonAPI.processErrors(error, req, { file: __filename }));
        //     } else {
        //         if (agencys[0].status !== 'approved') {
        //             return res.status(403).json({
        //                 errors: [{
        //                     field: "Permission",
        //                     title: "Forbidden"
        //                 }]
        //             })
        //         }
        //     }
        // }
        var find = false
        var RolePermission = {}
        // for (let i = 0; i < arrayPermission.length && !find; i++) {
        //     if (req.path.indexOf(arrayPermission[i].route) !== -1 && arrayPermission[i].method === req.method && arrayPermission[i].rol === req.loggedUser.roleId) {
        //         find = true
        //         RolePermission = arrayPermission[i]
        //     }
        // }
        if (serverfunctions.length > 0) {
            find = true
            RolePermission = {
                associatedModel: serverfunctions[0].serverfunction.associatedModel,
                route: serverfunctions[0].serverfunction.route,
                method: serverfunctions[0].serverfunction.method,
                rol: req.loggedUser.roleId,
                canAll: serverfunctions[0].canAll
            }
        }
        if (!find) {
            return res.status(403).json({
                errors: [{
                    field: "Permission",
                    title: "Forbidden"
                }]
            })
        } else {
            if (RolePermission.canAll === "no") {
                req.canAll = "no"
            } else if (RolePermission.canAll === "yes") {
                req.canAll = "yes"
            }

            return next();
        }
    }
}

function ensureAuthenticatedOrNotAutenticated() {
    var models = global.app.orm.sequelize.models;
    return function (req, res, next) {
        var bearer = "";
        try {
            bearer = req.header('Authorization')
                .split('Bearer ')[1];
        } catch (e) {
            if (req.hasOwnProperty('loggedUser')) {
                return res.status(403).json({
                    errors: [{
                        field: "Permission",
                        title: "Estás inflando"
                    }]
                })
            }
            return next()
        }
        ;

        jwt.verify(bearer, global.app.config.get('jwt:secret'), {
                ignoreExpiration: false
            },
            function (err,
                      decoded) {
                if (err) {
                    if (err?.name === 'TokenExpiredError') {
                        /**
                         * el token ha expirado, logueese de nuevo
                         * */
                        return res.status(401)
                            .json({
                                errors: [{
                                    field: 'authorization',
                                    title: 'Authorization has expired'
                                }]
                            });
                    }
                    return res.status(401)
                        .json({
                            errors: [{
                                field: 'authorization',
                                title: 'Invalid bearer authorization'
                            }]
                        });
                } else {

                    return findUserWithOutRoleByEmail(
                        decoded.data.email
                    ).then(function (user) {
                        if (!user) {
                            return res.status(401).json({
                                errors: [{
                                    field: "user",
                                    title: "user not found"
                                }]
                            })
                        }
                        if (user.dataValues.status != undefined && user.dataValues.status !== 'enabled') {
                            return res.status(401).json({
                                errors: [{
                                    field: "user",
                                    title: "user is disabled"
                                }]
                            })
                        }

                        var tokenlastLogout = moment(decoded.data.lastLogout);
                        var personlastLogout = moment(user.dataValues.lastLogout);

                        if (decoded.data.lastLogout == undefined) {
                            return res.status(401).json({
                                errors: [{
                                    field: "Authorization",
                                    title: "old token provided v2."
                                }]
                            })
                        }

                        if (personlastLogout.diff(tokenlastLogout, 'seconds') > 0) {
                            return res.status(401).json({
                                errors: [{
                                    field: "Authorization",
                                    title: "old token provided"
                                }]
                            })
                        } else {
                            user.dataValues.date = decoded.data.date //DateTimezone(decoded.data.date)
                            user.dataValues.lastLogin = user.dataValues.lastLogin //DateTimezone(user.dataValues.lastLogin)
                            req.loggedUser = user;
                            req.tokenLifeTime = expiresIn;
                            return next();
                        }
                    }).catch(function (e) {
                        console.log(e);
                        return res.status(401).json({
                            errors: [{
                                field: "Authorization",
                                title: e.message
                            }]
                        });
                    })
                }
            })
    }
}

function ensureAuthenticated() {
    var models = global.app.orm.sequelize.models;
    return function (req, res, next) {
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
        ;

        jwt.verify(bearer, global.app.config.get('jwt:secret'), {
                ignoreExpiration: false
            },
            function (err,
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

                    // ESTO ES PARA HAYAR EL DATE REAL SIN TIMEZONE
                    // decoded.data.date = new Date(decoded.data.date)
                    // const timeOffsetInMS = decoded.data.date.getTimezoneOffset() * 60000;
                    // decoded.data.date.setTime(decoded.data.date.getTime() - timeOffsetInMS);
                    return findUserWithOutRoleByEmail(decoded.data.email).then(function (user) {
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
                            user.dataValues.date = decoded.data.date //DateTimezone(decoded.data.date)
                            user.dataValues.lastLogin = user.dataValues.lastLogin //DateTimezone(user.dataValues.lastLogin)
                            req.loggedUser = user;
                            req.tokenLifeTime = expiresIn;
                            return next();
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
    }
}


function ensureHasPermission(permissionId) {
    var models = global.app.orm.sequelize.models;
    return function(req, res, next) {
        var method = req.method.toLowerCase();

        return models.RolePerson.findAll({
            where: {
                PersonId: req.loggedUser.id
            },
            raw: true,
            logging: console.log,
            attributes: ["RoleId"]
        }).then(function(roles) {
            var listRoleId = roles.map(function(item) {
                return item.RoleId;
            });
            return models.RolePermission.findOne({
                where: {
                    RoleId: {
                        [global.app.orm.Sequelize.Op.in]: listRoleId
                    },
                    PermissionId: permissionId,
                    [method]: 1
                }
            })
        }).then(function(rolePermissionX) {
            if (!rolePermissionX) {
                return res.status(403).json({
                    errors: [{
                        field: "Authentication",
                        title: "Your user dont have enough permissions"
                    }]
                })
            } else {
                return next();
            }
        })
    }
}


function basicStrategyVerifyCallback(username, password, done) {
    var models = global.app.orm.sequelize.models;
    if (typeof done != 'function') {
        return;
    }
    return models.person
        .findOne({
            where: {
                username: username,
                status: enabled
            }
        })
        .then(function(person) {
            if (!person) {
                done(null, false);
                return null;
            }
            if (!person.isValidPassword(password)) {
                done(null, false);
                return null;
            }
            done(null, person);
        })
}

function basicCheckUser(bearer, done) {

    jwt.verify(bearer, global.app.config.get('jwt:secret'), {
            ignoreExpiration: true
        },
        function(err,
            decoded) {
            if (err) {
                console.log(err);
                /**
                 * error al procesar el token, es falso
                 * */
                return done({
                    status: 401,
                    key: 'authorization',
                    message: 'Invalid bearer authorization'
                }, null);
            } else {

                return findUser(
                    decoded.data.username
                ).then(function(user) {

                    if (!user) {
                        console.log('Usuario no existeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                        return done({
                            status: 401,
                            key: 'user',
                            message: 'user not found'
                        }, null);
                    }
                    if (user.dataValues.username != decoded.data.username) {
                        console.log('Usuario de otra api');
                        return done({
                            status: 401,
                            key: 'user',
                            message: 'user not found :('
                        }, null);
                    }

                    if (user.dataValues.status !== 'enabled') {
                        console.log('user disableddddddddddddddddddddddddddddddddd');
                        return done({
                            status: 401,
                            key: 'user',
                            message: 'user is disabled'
                        }, null);

                    }
                    var personlastLogout = moment(user.dataValues.lastLogout);
                    if (decoded.data.lastLogout == undefined) {
                        return done({
                            status: 401,
                            key: 'authorization',
                            message: 'old token provided v2.'
                        }, null);
                    }

                    console.log('cant ', personlastLogout.diff(tokenlastLogout, 'seconds'));
                    if (personlastLogout.diff(tokenlastLogout, 'seconds') > 0) {
                        return done({
                            status: 401,
                            key: 'authorization',
                            message: 'old token provided v2.'
                        }, null);
                    } else {
                        /**
                         * si la ultima vez que se logueo la persona
                         * */
                        return done(
                            null, user);

                    }
                }).catch(function(e) {
                    return done({
                        status: 401,
                        key: 'error',
                        message: e.message
                    }, null);
                })
            }
        }
    )

}


/**
 * devuelve el listado de permisos de un usuario especifico
 * 
 * @param {Integer} UserId
 *  
 */
function getPermissionsByUserId(UserId) {
    console.log(UserId)
    var models = global.app.orm.sequelize.models;
    var Sequelize = global.app.orm.Sequelize;
    return models.RolePerson.findAll({
        where: {
            PersonId: UserId
        },
        attributes: ["RoleId"],
        raw: true
    }).then(function(roles) {
        {
            var items = roles.map(function(item) {
                return item.RoleId
            });

            return models.RolePermission.findAll({
                where: {
                    RoleId: {
                        $in: items
                    }
                },
                include: [{
                    model: models.Permission,
                    as: 'Permission',
                    attributes: ["name"]
                }],
                raw: true,
                attributes: ["PermissionId", "canGet", "canPost", "canPatch", 'canDelete', "canSee"]
            });
        }
    }).then(function(RolePermission) {
        var permissions = {}
        var PermissionId = 0;
        var permissionList = [];
        for (var i = 0; i < RolePermission.length; i++) {
            PermissionId = RolePermission[i]['Permission.name'];
            if (permissions[PermissionId] == undefined) {
                permissionList.push
                permissions[PermissionId] = {
                    canGet: RolePermission[i].canGet,
                    canPost: RolePermission[i].canPost,
                    canPatch: RolePermission[i].canPatch,
                    canDelete: RolePermission[i].canDelete,
                    canSee: RolePermission[i].canSee,
                }
            } else {
                permissions[PermissionId].canGet = permissions[PermissionId].canGet || RolePermission[id].canGet;
                permissions[PermissionId].canPatch = permissions[PermissionId].canPatch || RolePermission[i].canPatch;
                permissions[PermissionId].canSee = permissions[PermissionId].canSee || RolePermission[i].canSee;
                permissions[PermissionId].canPost = permissions[PermissionId].canPost || RolePermission[i].canPost;
                permissions[PermissionId].canDelete = permissions[PermissionId].canDelete || RolePermission[i].canDelete;
            }
        }
        return permissions;
    })

}