/**
 * Created by yartiles on 19/07/17.
 */

const jwt = require('jsonwebtoken');
const moment = require('moment');

function authenticate(socketConnection, next) {
    var auth = socketConnection.handshake.query.Authorization;
    console.log("procesando.\n\n\n\n\n\n\n\n\n\n\n......", socketConnection.handshake.query)
    if (!auth) {
        console.log("......NO AUTH........")
        return;
    }
    auth = auth.split(' ');

    function nextS(error, person) {
        console.log(error)
        console.log(person != undefined, !error)
        if (person != undefined && person.dataValues != undefined && !error) {
            socketConnection.request.user = {
                id: person.dataValues.id,
                username: person.dataValues.username
            };
            console.log(`
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      LLGEANDO AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII...................
      
      `)
            next(error);
        }
    }
    console.log(auth[0], "aquie")
    if (auth[0] == 'Basic') {
        /**
         * proceed
         * */

        auth = new Buffer(auth[0], 'base64').toString();
        var pos = auth.indexOf(':');
        if (pos == -1 || pos == auth.length - 1) {
            return;
        }
        var username = auth.substr(0, pos);
        var password = auth.substr(pos + 1, auth.length);
        if (username.length == 0) {
            return;
        }

        /**
         * todo checkear user y password
         * */
        return basicCheck(username, password, nextS);

    } else if (auth[0] == 'Bearer') {
        /**
         * proceed
         * */
        ;
        return bearerCheck(auth[1], nextS);
    } else {
        console.log("......NADA........")
        return;
    }
}
const env = process.env.NODE_ENV || 'development';
const config = global.app.config.get('jwt');
const models = global.app.orm.sequelize.models;

exports.authenticate = authenticate;

function basicCheck(username, password, done) {

    if (typeof done != 'function') {
        done = password;
        password = username;
        username = req;
    }

    return models
        .person.findOne({
            where: {
                username: username
            }
        })
        .then(function(person) {
            if (!person) {
                return done(null, false);
            }

            if (!person.isValidPassword(password)) {
                return done(null, false);
            } else {
                return done(null, person);
            }
        })
        .catch(function(error) {
            global.app.logger.error(error, {
                module: 'core/auth',
                submodule: 'middleware',
                stack: error.stack
            });
            return done(error);
            return null;
        });










}

function bearerCheck(token, done) {
    try {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log('not decodect-----------------------------------------------------');
                return done({
                    status: 401,
                    key: 'authorization',
                    message: 'Invalid bearer authorization'
                }, null);
            } else {
                console.log('si decodect');
                console.log(decoded);
                return models.person.findByPk(
                    decoded.data.id
                ).then(function(user) {
                    console.log('usuario buscado ', decoded.data.id);

                    if (!user) {
                        console.log('Usuario no existeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                        return done({
                            status: 401,
                            key: 'user',
                            message: 'user not found'
                        }, null);
                    }

                    console.log("id_username: " + user.id + '_' + user.dataValues.username);
                    console.log(user.dataValues.username);
                    if (user.status !== 'enabled') {
                        console.log('El usuario debe estar enabled');
                        return done({
                            status: 401,
                            key: 'user',
                            message: 'user is disabled'
                        }, null);

                    }
                    var tokenLastLogin = moment(decoded.data.lastLogout);
                    var personLastLogin = moment(user.dataValues.lastLogout);
                    if (decoded.data.lastLogout == undefined) {
                        console.log('unfedinedxxxxxxxxxxxxxxxxxx');
                        return done({
                            status: 401,
                            key: 'authorization',
                            message: 'old token provided v2.'
                        }, null);
                    }

                    console.log('cant ', personLastLogin.diff(tokenLastLogin, 'seconds'));
                    if (personLastLogin.diff(tokenLastLogin, 'seconds') > 0) {
                        console.log('old');
                        return done({
                            status: 401,
                            key: 'authorization',
                            message: 'old token provided'
                        }, null);
                    } else {
                        /**
                         * si la ultima vez que se logueo la persona
                         * */
                        ;
                        console.log('todo ok');
                        return done(
                            null, user);

                    }
                }).catch(function(e) {
                    console.log(e);
                    console.log('qqqqqqqqqqqqqqqqq');
                    return done({
                        status: 403,
                        key: 'error',
                        message: e.message
                    }, null);
                })
            }
        })
    } catch (e) {
        console.log('ZAZOOOOOOOOOOOOOOOO');
        console.log(e);
        return done({
            status: 401,
            key: 'authorization',
            message: 'Invalid bearer authorization'
        }, null);
    }
}