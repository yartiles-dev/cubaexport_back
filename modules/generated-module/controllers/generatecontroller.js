//const controller = require('./controller')
const fs = require('fs');
const Sequelize = require('sequelize')
const {forEach} = require("p-iteration");
const Controller = class Controller {
    constructor() {}



    consume_data = async(req, res, next) => {
        var models = global.app.orm.sequelize.models;
        var now = new Date
        var year = now.getFullYear()
        var month = now.getMonth() + 1
        var day = now.getDate() + 1
        if (day === 1 || day === 2 || day === 3 || day === 4 || day === 5 ||
            day === 6 || day === 7 || day === 8 || day === 9) {
            day = `0${day}`
        }

        var names = []
        if (name_model === 'country' || name_model === 'language' || name_model === 'changes' || name_model === 'comments' ||
            name_model === 'discount' || name_model === 'notification' || name_model === 'options' || name_model === 'post' ||
            name_model === 'role' || name_model === 'serverfunction' || name_model === 'showmember') {
            count = 10
            names.push(['country', 'language', 'changes', 'comments', 'discount', 'notification', 'options', 'post', 'role', 'serverfunction', 'showmember'])
        } else if (name_model === 'person' || name_model === 'location') {
            count = 20
        } else if (name_model === 'payment' || name_model === 'show' || name_model === 'navigationinfo' ||
            name_model === 'agency' || name_model === 'log' || name_model === 'notificationperson' ||
            name_model === 'roleperson' || name_model === 'roleserverfunction') {
            count = 30
        } else if (name_model === 'booking' || name_model === 'agencydiscount' || name_model === 'showdiscount' ||
            name_model === 'showshowmember') {
            count = 40
        } else if (name_model === 'debt' || name_model === 'cancellation') {
            count = 50
        }

        var names = ['language', 'role', 'country', 'person', 'serverfunction', 'roleserverfunction']
        var persons = await models.person.findAll()
        var countries = await models.country.findAll()
        var languages = await models.language.findAll()
        var roles = await models.role.findAll()
        var serverfunctions = await models.serverfunction.findAll()
        var roleserverfunctions = await models.roleserverfunction.findAll()
        var datas = [languages, roles, countries, persons, serverfunctions, roleserverfunctions]

        for (var i = 0; i < datas.length; i++) {
            for (let j = 0; j < datas[i].length; j++) {
                if (i === 3) {
                    datas[i][j].lastLogin = null
                    datas[i][j].lastLogout = null
                }
                datas[i][j].createdAt = now;
                datas[i][j].updatedAt = now;
            }
        }

        for (let i = 0; i < 6; i++) {
            var fichero = `'use strict';

        var tableName = '${names[i]}';
        
        var data = ${JSON.stringify(datas[i])}
        
        var now            = new Date();
for (var i=0;i<data.length;i++){
    data[i].createdAt= now;
    data[i].updatedAt= now;
}`

            fichero = fichero + `
        module.exports = {
            up  : function (queryInterface, Sequelize) {
          
              return queryInterface.bulkInsert('${names[i]}', data );
            },
            down: function (queryInterface, Sequelize) {
              /*
               Add reverting commands here.
               Return a promise to correctly handle asynchronicity.
          
               Example:
               return queryInterface.bulkDelete('Person', null, {});
               */
            }
          };`

            //A PARTIR DE AQUI CONSTRUIR LOS SEEDERS
            fs.writeFileSync(`seeders/${year}${month}${day}00000${i}${names[i]}.js`, fichero)
        }

        return res.sendStatus(200)
    }

    generated_json_postman = async(req, res, next) => {
        var ensureAuthenticated = true
        var nameFolderModule = global.app.config.get('nameFolderModule')
        var PostmanFile = `
            {
                "info": {
                    "_postman_id": "46aeeb76-3d95-4b40-8256-18e5cbe47dca",
                    "name": "${nameFolderModule}",
                    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
                },
                "item": [`
        var method = ""
        var url = ""
        var path = []
        var arrayprefix = global.app.config.get('api').prefix.split('/')
        var actions = ["index", "show", "create-One-Many", "update", "delete", "delete_multiple", "update_multiple"]
        var protocol = "http"
        var firstTime = true
        if (global.app.config.get('api').useHttps) {
            protocol = "https"
        }
        var host = 'localhost'

        for (let i in global.app.orm.sequelize.models) {
            var model = await global.app.orm.sequelize.models[i].findAll()
            var raw_update_multiple = model
            raw_update_multiple = JSON.stringify(raw_update_multiple)
            raw_update_multiple = JSON.stringify(raw_update_multiple)
            var raw_index = {
                attributos: {
                    "LocalsAttributes": model[0]._options.attributes
                }
            }
            raw_index = JSON.stringify(raw_index)
            raw_index = JSON.stringify(raw_index)
            model = JSON.stringify(model[0])
            model = JSON.stringify(model)
            var rawEspecific = {
                ids: [1, 2]
            }
            rawEspecific = JSON.stringify(rawEspecific)
            rawEspecific = JSON.stringify(rawEspecific)
            var raw = ""
            if (firstTime) {
                if (ensureAuthenticated) {
                    PostmanFile = PostmanFile + `{
                            "name": "Auth",
                            "item": [{
                                "name": "sign-up",
                                "request": {
                                    "method": "POST",
                                    "header": [{
                                        "key": "Content-Type",
                                        "name": "Content-Type",
                                        "value": "application/json",
                                        "type": "text"
                                    }],
                                    "body": {
                                        "mode": "raw",
                                        "raw": ""
                                    },
                                    "url": {
                                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/sign-up"}",
                                        "protocol": "${protocol}",
                                        "host": [
                                            "${host}"
                                        ],
                                        "port": "${global.app.config.get('api').port}",
                                        "path": [
                                            "${arrayprefix[1]}",
                                            "sign-up"
                                        ]
                                    }
                                },
                                "response": []
                            },
                            {
                                "name": "Login",
                                "request": {
                                    "auth": {
                                        "type": "basic",
                                        "basic": [{
                                                "key": "password",
                                                "value": "123",
                                                "type": "string"
                                            },
                                            {
                                                "key": "username",
                                                "value": "yartiles",
                                                "type": "string"
                                            }
                                        ]
                                    },
                                    "method": "GET",
                                    "header": [],
                                    "body": {
                                        "mode": "raw",
                                        "raw": ""
                                    },
                                    "url": {
                                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/login"}",
                                        "protocol": "${protocol}",
                                        "host": [
                                            "${host}"
                                        ],
                                        "port": "${global.app.config.get('api').port}",
                                        "path": [
                                            "${arrayprefix[1]}",
                                            "auth",
                                            "login"
                                        ]
                                    }
                                },
                                "response": []
                            },
                            {
                                "name": "LoginEmail",
                                "request": {
                                    "auth": {
                                        "type": "basic",
                                        "basic": [{
                                                "key": "password",
                                                "value": "123",
                                                "type": "string"
                                            },
                                            {
                                                "key": "email",
                                                "value": "testing@gmail.com",
                                                "type": "string"
                                            }
                                        ]
                                    },
                                    "method": "GET",
                                    "header": [],
                                    "body": {
                                        "mode": "raw",
                                        "raw": ""
                                    },
                                    "url": {
                                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/login_email"}",
                                        "protocol": "${protocol}",
                                        "host": [
                                            "${host}"
                                        ],
                                        "port": "${global.app.config.get('api').port}",
                                        "path": [
                                            "${arrayprefix[1]}",
                                            "auth",
                                            "login_email"
                                        ]
                                    }
                                },
                                "response": []
                            },
                            {
                                "name": "LoginEmailOrUsername",
                                "request": {
                                    "auth": {
                                        "type": "basic",
                                        "basic": [{
                                                "key": "password",
                                                "value": "123",
                                                "type": "string"
                                            },
                                            {
                                                "key": "email_or_username",
                                                "value": "testing@gmail.com or yartiles",
                                                "type": "string"
                                            }
                                        ]
                                    },
                                    "method": "GET",
                                    "header": [],
                                    "body": {
                                        "mode": "raw",
                                        "raw": ""
                                    },
                                    "url": {
                                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/login_email_or_username"}",
                                        "protocol": "${protocol}",
                                        "host": [
                                            "${host}"
                                        ],
                                        "port": "${global.app.config.get('api').port}",
                                        "path": [
                                            "${arrayprefix[1]}",
                                            "auth",
                                            "login_email_or_username"
                                        ]
                                    }
                                },
                                "response": []
                            },
                            {
                                "name": "logout",
                                "request": {
                                    "auth": {
                                        "type": "bearer"
                                    },
                                    "method": "GET",
                                    "header": [],
                                    "body": {
                                        "mode": "raw",
                                        "raw": ""
                                    },
                                    "url": {
                                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/logout"}",
                                        "protocol": "${protocol}",
                                        "host": [
                                            "${host}"
                                        ],
                                        "port": "${global.app.config.get('api').port}",
                                        "path": [
                                            "${arrayprefix[1]}",
                                            "auth",
                                            "logout"
                                        ]
                                    }
                                },
                                "response": []
                            },
                            {
\t\t\t\t\t"name": "confirm",
\t\t\t\t\t"request": {
\t\t\t\t\t\t"method": "GET",
\t\t\t\t\t\t"header": [
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t"key": "Content-Type",
\t\t\t\t\t\t\t\t"name": "Content-Type",
\t\t\t\t\t\t\t\t"value": "application/json",
\t\t\t\t\t\t\t\t"type": "text"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t],
\t\t\t\t\t\t"url": {
\t\t\t\t\t\t\t"raw": "http://localhost:6541/v1/confirm?code=testCode98765",
\t\t\t\t\t\t\t"protocol": "http",
\t\t\t\t\t\t\t"host": [
\t\t\t\t\t\t\t\t"localhost"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"port": "6541",
\t\t\t\t\t\t\t"path": [
\t\t\t\t\t\t\t\t"v1",
\t\t\t\t\t\t\t\t"confirm"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"query": [
\t\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t\t"key": "code",
\t\t\t\t\t\t\t\t\t"value": "testCode98765"
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t]
\t\t\t\t\t\t}
\t\t\t\t\t},
\t\t\t\t\t"response": []
\t\t\t\t},
\t\t\t\t{
\t\t\t\t\t"name": "send_code",
\t\t\t\t\t"request": {
\t\t\t\t\t\t"method": "GET",
\t\t\t\t\t\t"header": [
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t"key": "Content-Type",
\t\t\t\t\t\t\t\t"name": "Content-Type",
\t\t\t\t\t\t\t\t"value": "application/json",
\t\t\t\t\t\t\t\t"type": "text"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t],
\t\t\t\t\t\t"url": {
\t\t\t\t\t\t\t"raw": "http://localhost:6541/v1/send_code?email=email.test@gmail.com",
\t\t\t\t\t\t\t"protocol": "http",
\t\t\t\t\t\t\t"host": [
\t\t\t\t\t\t\t\t"localhost"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"port": "6541",
\t\t\t\t\t\t\t"path": [
\t\t\t\t\t\t\t\t"v1",
\t\t\t\t\t\t\t\t"send_code"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"query": [
\t\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t\t"key": "email",
\t\t\t\t\t\t\t\t\t"value": "email.test@gmail.com"
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t]
\t\t\t\t\t\t}
\t\t\t\t\t},
\t\t\t\t\t"response": []
\t\t\t\t},
\t\t\t\t{
\t\t\t\t\t"name": "change_password",
\t\t\t\t\t"request": {
\t\t\t\t\t\t"method": "POST",
\t\t\t\t\t\t"header": [
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t"key": "Content-Type",
\t\t\t\t\t\t\t\t"name": "Content-Type",
\t\t\t\t\t\t\t\t"value": "application/json",
\t\t\t\t\t\t\t\t"type": "text"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t],
\t\t\t\t\t\t"body": {
\t\t\t\t\t\t\t"mode": "raw",
\t\t\t\t\t\t\t"raw": "{\\n\\t\\"code\\":\\"testCode98765\\",\\n\\t\\"new_password\\":\\"abc\\",\\n\\t\\"email\\":\\"testing@gmail.com\\"\\n}"
\t\t\t\t\t\t},
\t\t\t\t\t\t"url": {
\t\t\t\t\t\t\t"raw": "http://localhost:6541/v1/change_password",
\t\t\t\t\t\t\t"protocol": "http",
\t\t\t\t\t\t\t"host": [
\t\t\t\t\t\t\t\t"localhost"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"port": "6541",
\t\t\t\t\t\t\t"path": [
\t\t\t\t\t\t\t\t"v1",
\t\t\t\t\t\t\t\t"change_password"
\t\t\t\t\t\t\t]
\t\t\t\t\t\t}
\t\t\t\t\t},
\t\t\t\t\t"response": []
\t\t\t\t},
\t\t\t\t{
\t\t\t\t\t"name": "change_account",
\t\t\t\t\t"request": {
\t\t\t\t\t\t"auth": {
\t\t\t\t\t\t\t"type": "bearer",
\t\t\t\t\t\t\t"bearer": [
\t\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t\t"key": "token",
\t\t\t\t\t\t\t\t\t"value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo0MiwidXNlcm5hbWUiOiJjaGFybGkiLCJuYW1lIjoiQ2FybG9zIEJyaXRvIiwibGFzdExvZ291dCI6IjIwMjAtMDItMDVUMjI6MjY6NDIuMDAwWiIsImRhdGUiOiIyMDIwLTAyLTIwVDE5OjM0OjA2LjIwM1oiLCJzdGF0dXMiOiJlbmFibGVkIiwibGFzdExvZ2luIjoiMjAyMC0wMi0yMFQxOTozNDowNi4yMDNaIiwiZW1haWwiOiJycGVyZXp0OTExQGdtYWlsLmNvbSIsImNyZWF0ZWRBdCI6IjIwMjAtMDItMDVUMjI6MjY6NDIuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDItMTFUMDM6MDU6MzcuMDAwWiIsInJhbmRvbSI6MC44NzY5MDg5MjYyNjE4NTM3LCJyb2xlSWQiOjN9LCJpYXQiOjE1ODIyMjcyNDYsImV4cCI6MTU4MjI2MzI0Nn0.8FxjBPYmVERcQUYAg256HSWPdEoNm_a3u7T3CkB5KBI",
\t\t\t\t\t\t\t\t\t"type": "string"
\t\t\t\t\t\t\t\t}
\t\t\t\t\t\t\t]
\t\t\t\t\t\t},
\t\t\t\t\t\t"method": "PATCH",
\t\t\t\t\t\t"header": [
\t\t\t\t\t\t\t{
\t\t\t\t\t\t\t\t"key": "Content-Type",
\t\t\t\t\t\t\t\t"name": "Content-Type",
\t\t\t\t\t\t\t\t"value": "application/json",
\t\t\t\t\t\t\t\t"type": "text"
\t\t\t\t\t\t\t}
\t\t\t\t\t\t],
\t\t\t\t\t\t"body": {
\t\t\t\t\t\t\t"mode": "raw",
\t\t\t\t\t\t\t"raw": "\\t{\\n\\t\\t\\"username\\":\\"arletis\\",\\n\\t\\t\\"name\\":\\"Arletis\\",\\n\\t\\t\\"age\\":24,\\n\\t\\t\\"email\\":\\"testing@gmail.com\\",\\n\\t\\t\\"countryId\\":\\"53\\"\\n\\t}"
\t\t\t\t\t\t},
\t\t\t\t\t\t"url": {
\t\t\t\t\t\t\t"raw": "http://localhost:6541/v1/change_account/42",
\t\t\t\t\t\t\t"protocol": "http",
\t\t\t\t\t\t\t"host": [
\t\t\t\t\t\t\t\t"localhost"
\t\t\t\t\t\t\t],
\t\t\t\t\t\t\t"port": "6541",
\t\t\t\t\t\t\t"path": [
\t\t\t\t\t\t\t\t"v1",
\t\t\t\t\t\t\t\t"change_account",
\t\t\t\t\t\t\t\t"42"
\t\t\t\t\t\t\t]
\t\t\t\t\t\t}
\t\t\t\t\t},
\t\t\t\t\t"response": []
\t\t\t\t}
                        ]
                    },
                  `
                }

                PostmanFile = PostmanFile + `{
                        "name": "${i}",
                        "item": [`
                firstTime = false
            } else {
                PostmanFile = PostmanFile + `,{
                        "name": "${i}",
                        "item": [`
            }
            for (let j = 0; j < actions.length; j++) {
                path = []
                path.push(arrayprefix[1])
                path.push(`${i}`)
                if (actions[j] === "index" || actions[j] === "show") {
                    method = "PUT"
                    raw = raw_index
                    if (actions[j] === "index") {
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i}"`
                    } else {
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i + "/1"}"`
                        path.push("1")
                    }
                } else if (actions[j] === "create-One-Many") {
                    raw = model
                    method = "POST"
                    url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i}"`
                } else if (actions[j] === "update" || actions[j] === "update_multiple") {
                    method = "PATCH"
                    if (actions[j] === "update") {
                        raw = model
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i + "/1"}"`
                        path.push("1")
                    } else {
                        raw = raw_update_multiple
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i}"`
                    }
                } else if (actions[j] === "delete" || actions[j] === "delete_multiple") {
                    method = "DELETE"
                    if (actions[j] === "delete") {
                        raw = null
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i + "/1"}"`
                        path.push("1")
                    } else {
                        raw = rawEspecific
                        url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + i}"`
                    }
                }
                if (ensureAuthenticated) {
                    PostmanFile = PostmanFile + `{
                            "name": "${actions[j]}",
                        "request": {
                            "method": "${method}",
                            "auth": {
                                "type": "bearer"
                            },
                            "header": [{
                                "key": "Content-Type",
                                "name": "Content-Type",
                                "value": "application/json",
                                "type": "text"
                            }],
                            "body": {
                                "mode": "raw",
                                "raw": ${raw}
                            },
                            "url": {
                                "raw": ${url},
                                "protocol": "${protocol}",
                                "host": [
                                    "${host}"
                                ],
                                "port": "${global.app.config.get('api').port}",
                                "path": [`
                    for (let j = 0; j < path.length; j++) {
                        if (j !== path.length - 1) {
                            PostmanFile = PostmanFile + `
                                        "${path[j]}",`
                        } else {
                            PostmanFile = PostmanFile + `
                                        "${path[j]}"`
                        }
                    }
                    PostmanFile = PostmanFile + `
                            ]`
                    PostmanFile = PostmanFile + `
                            }
                        },
                        "response": []
                    }`
                } else {
                    PostmanFile = PostmanFile + `{
                            "name": "${actions[j]}",
                        "request": {
                            "method": "${method}",
                            "header": [{
                                "key": "Content-Type",
                                "name": "Content-Type",
                                "value": "application/json",
                                "type": "text"
                            }],
                            "body": {
                                "mode": "raw",
                                "raw": ${raw}
                            },
                            "url": {
                                "raw": ${url},
                                "protocol": "${protocol}",
                                "host": [
                                    "${host}"
                                ],
                                "port": "${global.app.config.get('api').port}",
                                "path": [`
                    for (let j = 0; j < path.length; j++) {
                        if (j !== path.length - 1) {
                            PostmanFile = PostmanFile + `
                                        "${path[j]}",`
                        } else {
                            PostmanFile = PostmanFile + `
                                        "${path[j]}"`
                        }
                    }
                    PostmanFile = PostmanFile + `
                            ]`
                    PostmanFile = PostmanFile + `
                            }
                        },
                        "response": []
                    }`
                }
                if (j !== actions.length - 1) {
                    PostmanFile = PostmanFile + `,
                        `
                }
            }
            PostmanFile = PostmanFile + `
            ]
        }`
        }
        PostmanFile = PostmanFile + `,
            {
                "name": "index",
                "request": {
                    "method": "GET",
                    "header": [],
                    "body": {
                        "mode": "raw",
                        "raw": ""
                    },
                    "url": {
                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix}",
                        "protocol": "${protocol}",
                        "host": [
                             "${host}"
                                ],
                        "port": "${global.app.config.get('api').port}",
                        "path": [
                            "${arrayprefix[1]}"
                        ]
                    }
                },
                "response": []
            },
            {
                "name": "help",
                "request": {
                    "method": "GET",
                    "header": [],
                    "body": {
                        "mode": "raw",
                        "raw": ""
                    },
                    "url": {
                        "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/help"}",
                        "protocol": "${protocol}",
                        "host": [
                             "${host}"
                                ],
                        "port": "${global.app.config.get('api').port}",
                        "path": [
                            "${arrayprefix[1]}",
                            "help"
                        ]
                    }
                },
                "response": []
            }
        ]
    }`
        fs.writeFileSync(`consume_files/RestServices${nameFolderModule}.json`, PostmanFile);
        return res.sendStatus(200)
    }

    create_migration = (req, res, next) => {
        var models = global.app.orm.sequelize.models;
        var count = 50
        for (let i in models) {
            var name_model = models[i].name
            var now = new Date
            var migration = `'use strict';

        var tableName = '${name_model}';
        
        
        module.exports = {
            up: function(queryInterface, Sequelize) {
                var tableDefinition = {
                    `

            var final_migration = `
                };

                    return queryInterface
                        .createTable(tableName, tableDefinition);
                },
                down: function(queryInterface) {
                    return queryInterface.dropTable(tableName);
                }
            };`

            var model_original = fs.readFileSync(`modules/cubaExport/models/${name_model}.js`).toString()
            var primer_corte = model_original.split("global.app.orm.mixins.attributes, {")
            var segundo_corte = primer_corte[1].split("}), {")

            var casi_ultimo = segundo_corte[0].replace(/references: {/g,
                `onUpdate: "cascade",
        onDelete: "restrict",
        references: {`)

            var ultimo = casi_ultimo.replace(/global.app.orm.Sequelize/g, "Sequelize")
            ultimo = ultimo.replace(/global.app.orm.sequelize/g, "Sequelize")

            migration = migration + ultimo

            migration = migration + final_migration
            var year = now.getFullYear()
            var month = now.getMonth() + 1
            var day = now.getDate() + 1
            if (name_model === 'country' || name_model === 'language' || name_model === 'changes' || name_model === 'comments' ||
                name_model === 'discount' || name_model === 'notification' || name_model === 'options' || name_model === 'post' ||
                name_model === 'role' || name_model === 'serverfunction' || name_model === 'showmember') {
                count = 10
            } else if (name_model === 'person' || name_model === 'location') {
                count = 20
            } else if (name_model === 'payment' || name_model === 'show' || name_model === 'navigationinfo' ||
                name_model === 'agency' || name_model === 'log' || name_model === 'notificationperson' ||
                name_model === 'roleperson' || name_model === 'roleserverfunction') {
                count = 30
            } else if (name_model === 'booking' || name_model === 'agencydiscount' || name_model === 'showdiscount' ||
                name_model === 'showshowmember') {
                count = 40
            } else if (name_model === 'debt' || name_model === 'cancellation') {
                count = 50
            }
            if (day === 1 || day === 2 || day === 3 || day === 4 || day === 5 ||
                day === 6 || day === 7 || day === 8 || day === 9) {
                fs.writeFileSync(`migrations/${year}${month}0${day}0000${count}${name_model}.js`, migration)
            } else {
                fs.writeFileSync(`migrations/${year}${month}${day}0000${count}${name_model}.js`, migration)
            }
            count++
        }

        return res.sendStatus(200)
    }
    generate = async(req, res, next) => {

        // var istimestamp = false
        // if (req.body.hasOwnProperty('timestamp')) {
        //     if (typeof req.body.timestamp === 'boolean') {
        //         istimestamp = req.body.timestamp
        //     } else {
        //         var error = new Error(
        //             `El parametro timestamp tiene que ser true o false`
        //         );
        //         return res.status(400)
        //             .json(jsonAPI.processErrors(error, req, { file: __filename }));;
        //     }
        // } else {
        //     var error = new Error(
        //         `Es obligatorio pasar el parametro timestamp : false | true`
        //     );
        //     return res.status(400)
        //         .json(jsonAPI.processErrors(error, req, { file: __filename }));;
        // }

        var ensureAuthenticated = false
        if (req.body.hasOwnProperty('ensureAuthenticated')) {
            if (typeof req.body.ensureAuthenticated === 'boolean') {
                ensureAuthenticated = req.body.ensureAuthenticated
            } else {
                var error = new Error(
                    `El parametro ensureAuthenticated tiene que ser true o false`
                );
                return res.status(500)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));;
            }
        }

        // const sequelize = new Sequelize("cuba_export", "postgres", "admin", {
        //     host: "localhost",
        //     port: 5432,
        //     dialect: 'postgres',
        //     logging: false
        // })

        // try{
        //     const pepe = await sequelize.authenticate()
        //     console.log(pepe)
        // } catch {
        //     console.log('No se pudo')
        // }

        var nameFolderModule = global.app.config.get('nameFolderModule')
        var table_schema = ""
        if (global.app.config.get('database').activeDialect === 'mysql'){
            table_schema = global.app.config.get('database').dialects.mysql.database
        }
        else if (global.app.config.get('database').activeDialect === 'postgres') {
            table_schema = "public"
        }

        const listTables = await global.app.orm.sequelize
            .query(`SELECT table_name
FROM information_schema.tables
WHERE table_schema = '${table_schema}'
ORDER BY table_name;`, {
                type: global.app.orm.sequelize.QueryTypes.SELECT
            })
            .then(result => {
                return result.map(e => e.table_name)
            })
            .catch(error => {
                console.log(error)
            });

        fs.mkdirSync(`modules/${nameFolderModule}`)
        fs.mkdirSync(`modules/${nameFolderModule}/controllers`)
        fs.mkdirSync(`modules/${nameFolderModule}/models`)
        fs.mkdirSync(`modules/${nameFolderModule}/routes`)
        fs.mkdirSync('modules/api-root')
        fs.mkdirSync('modules/api-root/routes')

        if (ensureAuthenticated) {
            fs.mkdirSync('modules/auth')
            fs.mkdirSync('modules/auth/emails')
            fs.mkdirSync('modules/auth/emails/new-user')
            fs.mkdirSync('modules/auth/routes')
            fs.mkdirSync('modules/auth/routes/login')
            fs.mkdirSync('modules/auth/routes/login_email')
            fs.mkdirSync('modules/auth/routes/login_email_or_username')
            fs.mkdirSync('modules/auth/routes/confirm')
            fs.mkdirSync('modules/auth/routes/send_code')
            fs.mkdirSync('modules/auth/routes/change_password')
            fs.mkdirSync('modules/auth/routes/change_account')
            fs.mkdirSync('modules/auth/routes/logout')
            fs.mkdirSync('modules/auth/routes/sign-up')
            fs.mkdirSync('modules/auth/routes/validate')
        }

        var controllerGenerica = fs.readFileSync('modules/generated-module/controllers/controller.js')
        fs.writeFileSync(`modules/${nameFolderModule}/controllers/controller.js`, controllerGenerica)

        var modelSequelize = ""

        var createFlie = ``
        var index = `'use strict';`
        var models = `
        exports.loadModels = function loadModels() {`
        var task = `
        exports.loadTasks = function loadTasks() {};`
        var routes = `
        exports.setRoutes = function setRoutes() {
            var models = global.app.orm.sequelize.models;`
        listTables.forEach(element => {

            modelSequelize = require(`../modelsSequelize/${element}`)(global.app.orm.sequelize, Sequelize)

            index = index + `
            const ${element}Routes = require('./routes/${element}route')
            const ${element}Controller = require('./controllers/${element}controller')`

            models = models + `
            require('./models/${element}').loadModel();`

            routes = routes + `
            new ${element}Routes(${element}Controller, models.${element}).router`

            fs.writeFileSync(`modules/${nameFolderModule}/controllers/${element}controller.js`, `const controller = require('./controller')
const Controller = class Controller extends controller {
constructor(model) {
   super(model)
}
}
    
module.exports = Controller
                                                    `);
            fs.writeFileSync(`modules/${nameFolderModule}/routes/${element}route.js`, `
            const express = require('express')

const routerGenerico = require('./routes')

//Estas son las rutas especificas para productos
class Routes extends routerGenerico {
    constructor(controller,model) {
        super(controller,model)
    }
}
module.exports = Routes
            `)
        })

        createFlie = index + models + `
        };` + task + routes + `};`
        fs.writeFileSync(`modules/${nameFolderModule}/index.js`, createFlie);

        if (ensureAuthenticated) {
            fs.writeFileSync(`modules/${nameFolderModule}/routes/routes.js`, `
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
            `)
        } else {
            fs.writeFileSync(`modules/${nameFolderModule}/routes/routes.js`, `
            const express = require("express");
            var ensureAuthenticated = global.app.security.ensureAuthenticated();

    //Esto es para las rutas genericas
    class Routes {
        router = global.app.config.get('api:prefix');
        constructor(controller, model) {
            controller = new controller(model)
                //Collection
            global.app.express
                .route(this.router + "/" + model.name + "/")
                .put(controller.findByParameters)
                .post(controller.create)
                .patch(controller.update_multiple)
                .delete(controller.delete_multiple);
            //Single
            global.app.express
                .route(this.router + "/" + model.name + "/:Id")
                .put(controller.findById)
                .patch(controller.update)
                .delete(controller.delete);
        }
    }
    module.exports = Routes;
            `)
        }

        var modelSequelize = ""
        var modelGenerate = ""
        var atributes = ""
        var arrayRelations = []
        var arrayMany = []

        listTables.forEach(element => {
            arrayMany = []
            var fichero = fs.readFileSync(`modules/generated-module/modelsSequelize/${element}.js`).toString()
            var primerCorte = "const Sequelize = require('sequelize');" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
            // var primerCorte = "/* jshint indent: 2 */" + "\n" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
            var casicompleto = fichero.split(primerCorte)
            var completo = casicompleto[1].split("}, {")
        })

        listTables.forEach(async element => {
            var istimestamp = false
            var cantVerificarTimeStamp = 0
            var modelSequelize = require('../modelsSequelize/' + element)
            var modelSequelizeCreado = modelSequelize(global.app.orm.sequelize, global.app.orm.Sequelize)

            var fichero = fs.readFileSync(`modules/generated-module/modelsSequelize/${element}.js`).toString()
            // var primerCorte = "/* jshint indent: 2 */" + "\n" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
            var primerCorte = "const Sequelize = require('sequelize');" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
            var casicompleto = fichero.split(primerCorte)
            var casicasicompleto = casicompleto[1].split("}, {")
            var completo = casicasicompleto[0].replace(/DataTypes/g, 'global.app.orm.Sequelize')

            if(casicasicompleto[1].indexOf("timestamps: true,") !== -1){
                istimestamp = true
            }

            let createdUpdatedDeletedAt = istimestamp ? `,
    createdAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: false
    },
    deletedAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: true
    }` : ''

                // if (fichero.indexOf(" createdAt: {") !== -1) {
            //     cantVerificarTimeStamp++
            // }
            // if (fichero.indexOf(" updatedAt: {") !== -1) {
            //     cantVerificarTimeStamp++
            // }
            // if (fichero.indexOf(" deletedAt: {") !== -1) {
            //     cantVerificarTimeStamp++
            // }

            // if (cantVerificarTimeStamp === 3) {
            //     istimestamp = true
            // }

            console.log(istimestamp)

            arrayRelations = []
            modelSequelize = require(`../modelsSequelize/${element}`)(global.app.orm.sequelize, Sequelize)
            var requireBcript = ""
            if (ensureAuthenticated) {
                requireBcript = `var bcrypt = require('bcryptjs');`
            }
            modelGenerate = `'use strict';

            var lodash = require('lodash');
            ${requireBcript}
            
            exports.loadModel = function loadModel() {
                const ${element} = global.app.orm.sequelize.define('${element}',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        ${completo}${createdUpdatedDeletedAt}`

            modelGenerate = modelGenerate + `
        }), {
            timestamps: ${istimestamp},
            comment: 'A example model.',
            freezeTableName: true,
            tableName: '${element}',
            hooks: {}
        });
        ${element}.associate = function() {
            var models = global.app.orm.sequelize.models;`

            //A PARTIR DE AQUI ES QUE SE MANEJAN LOS ATRIBUTOS
            var arrayAttributesAuxiliar = []
            for (let i in modelSequelizeCreado) {
                if (i === 'fieldRawAttributesMap') {
                    for (let j in modelSequelizeCreado[i]) {
                        arrayAttributesAuxiliar.push(j)
                    }
                }
            }

            //A PARTIR DE AQUI SE MANEJAN LAS RELACIONES

            var arrayRelationsAuxiliar = []
            for (let i in modelSequelizeCreado) {
                if (i === 'fieldRawAttributesMap') {
                    for (let j in modelSequelizeCreado[i]) {
                        if (modelSequelizeCreado[i][j].hasOwnProperty('references')) {
                            //Para saber el nombre del campo-- j
                            //Para saber el nombre del modelo al cual asociarlo-- modelSequelizeCreado[i][j].references.model

                            var cant = 0
                            for (let k in modelSequelize[i]) {
                                if (modelSequelizeCreado[i][k].hasOwnProperty('references')) {
                                    if (modelSequelizeCreado[i][j].references.model === modelSequelizeCreado[i][k].references.model && j !== k) {
                                        cant++
                                    }
                                }
                            }
                            var association = modelSequelizeCreado[i][j].references.model
                            if (cant > 0) {
                                association = modelSequelizeCreado[i][j].references.model + j
                            }

                            modelGenerate = modelGenerate + `
                    models.${element}.belongsTo(models.${modelSequelizeCreado[i][j].references.model}, { foreignKey: '${j}', as: '${association}' });`
                            arrayRelationsAuxiliar.push({
                                typeRelation: 'belongsTo',
                                nameModel: `${modelSequelizeCreado[i][j].references.model}`,
                                nameRelation: `${association}`
                            })
                        }
                    }
                }
            }

            listTables.forEach(element2 => {
                var modelSequelizeElement2 = require('../modelsSequelize/' + element2)
                var modelSequelizeCreadoElement2 = modelSequelizeElement2(global.app.orm.sequelize, global.app.orm.Sequelize)

                for (let i in modelSequelizeCreadoElement2) {
                    if (i === 'fieldRawAttributesMap') {
                        for (let j in modelSequelizeCreadoElement2[i]) {
                            if (modelSequelizeCreadoElement2[i][j].hasOwnProperty('references')) {
                                if (modelSequelizeCreadoElement2[i][j].references.model === element) {

                                    var cant = 0
                                    for (let k in modelSequelizeCreadoElement2[i]) {
                                        if (modelSequelizeCreadoElement2[i][k].hasOwnProperty('references')) {
                                            if (modelSequelizeCreadoElement2[i][j].references.model === modelSequelizeCreadoElement2[i][k].references.model && j !== k) {
                                                cant++
                                            }
                                        }
                                    }
                                    var association = element2
                                    if (cant > 0) {
                                        association = element2 + j
                                    }

                                    if (modelSequelizeCreadoElement2[i][j].hasOwnProperty('unique')) {
                                        if (modelSequelizeCreadoElement2[i][j].unique === true) {
                                            modelGenerate = modelGenerate + `
                                    models.${element}.hasOne(models.${element2}, { foreignKey: '${j}', as: '${association}' });`
                                            arrayRelationsAuxiliar.push({
                                                typeRelation: 'hasOne',
                                                nameModel: `${element2}`,
                                                nameRelation: `${association}`
                                            })
                                        } else {
                                            modelGenerate = modelGenerate + `
                                    models.${element}.hasMany(models.${element2}, { foreignKey: '${j}', as: '${association}s' });`
                                            arrayRelationsAuxiliar.push({
                                                typeRelation: 'hasMany',
                                                nameModel: `${element2}`,
                                                nameRelation: `${association}s`
                                            })
                                        }
                                    } else {
                                        modelGenerate = modelGenerate + `
                                    models.${element}.hasMany(models.${element2}, { foreignKey: '${j}', as: '${association}s' });`
                                        arrayRelationsAuxiliar.push({
                                            typeRelation: 'hasMany',
                                            nameModel: `${element2}`,
                                            nameRelation: `${association}s`
                                        })
                                    }
                                }
                            }
                        }
                    }
                }
            })
            if (element === 'person' || element === 'Person' || element === 'persons' || element === 'Persons' ||
                element === 'user' || element === 'User' || element === 'users' || element === 'Users') {
                if (ensureAuthenticated) {
                    modelGenerate = modelGenerate.replace(/password: {/g, `
                    password: {
                        set: function(password) {
                            var rounds = 8;
                            var hashedPassword = bcrypt.hashSync(password, rounds);
                            this.setDataValue('password', hashedPassword);
                        },`)
                    modelGenerate = modelGenerate + `
                    }
                    ${element}.prototype.isValidPassword = function(password) {
                        var hashedPassword = this.get('password', {
                            role: 'auth'
                        });
                        return bcrypt.compareSync(password, hashedPassword);`
                }
                if (modelGenerate.indexOf('email: {') !== -1) {
                    modelGenerate = modelGenerate.replace(/email: {/g, `
                    email: {
                        validate: {
                            isEmail: true
                        },`)
                }
            }
            modelGenerate = modelGenerate + `
                    }
                };`

            modelGenerate = modelGenerate + `
                exports.arrayRelations = [`
            arrayRelationsAuxiliar.forEach(auxiliar => {
                modelGenerate = modelGenerate + `
                    {
                    typeRelation:'${auxiliar.typeRelation}',
                    nameModel:'${auxiliar.nameModel}',
                    nameRelation:'${auxiliar.nameRelation}'
                },`
            })
            modelGenerate = modelGenerate + `
        ]
    `

            modelGenerate = modelGenerate + `
    exports.arrayAttributes = [`
            for (let i = 0; i < arrayAttributesAuxiliar.length; i++) {
                if (i !== arrayAttributesAuxiliar.length - 1) {
                    modelGenerate = modelGenerate + `'${arrayAttributesAuxiliar[i]}',`
                } else {
                    modelGenerate = modelGenerate + `'${arrayAttributesAuxiliar[i]}'`
                }
            }
            modelGenerate = modelGenerate + `]`

            // for (let i = 0; i < req.body.modelAccessControl; i++) {
            //
            // }

            //     for await (const contents of files.map(file => fs.readFile(file, 'utf8'))) {
            //         console.log(contents)
            //     }
            // }

            let modelGenerateServerFunction = modelGenerate
            if (req.body.hasOwnProperty('modelAccessControl') && element === 'serverfunction') {
                let arrayPermission = ''
                await forEach(req.body.modelAccessControl, async auxiliar => {
                    console.log(auxiliar.rol)
                    var cantMostrar = 0
                    // De esta manera busca el id del rol en la BD en vez de ponerlos exactos a mano
                    var modelSequelizeRole = require(`../modelsSequelize/role`)(global.app.orm.sequelize, Sequelize)
                    var role = await modelSequelizeRole.findOne({ where: { name: auxiliar.rol } })
                        .then(model => {
                            return model
                        })
                        .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/Id`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(400)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        })
                        .catch(function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/Id`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(500)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        });
                    // var role = {
                    //     id: 0
                    // }
                    // if (auxiliar.rol === "master")
                    //     role.id = 9
                    // else if (auxiliar.rol === "admin")
                    //     role.id = 7
                    // else if (auxiliar.rol === "tcp")
                    //     role.id = 10
                    // else if (auxiliar.rol === "agency")
                    //     role.id = 4
                    // else if (auxiliar.rol === "manager")
                    //     role.id = 5
                    // else if (auxiliar.rol === "promo")
                    //     role.id = 6
                    // else if (auxiliar.rol === "employee")
                    //     role.id = 7
                    // else if (auxiliar.rol === "doorman")
                    //     role.id = 8
                    auxiliar.permission.forEach(auxiliar2 => {
                        if (auxiliar2.hasOwnProperty('read')) {
                            cantMostrar++
                            var canAll = 'yes'
                            if (auxiliar2.read === 0) {
                                var canAll = 'no'
                            }
                            arrayPermission = arrayPermission + `
                            {
                            associatedModel:'${auxiliar2.model}',
                            route:'${global.app.config.get('api').prefix + '/' + auxiliar2.model}',
                            method:'PUT',
                            rol:${role.id},
                            canAll:'${canAll}'
                        },`
                        }
                        if (auxiliar2.hasOwnProperty('create')) {
                            cantMostrar++
                            var canAll = 'yes'
                            if (auxiliar2.read === 0) {
                                var canAll = 'no'
                            }
                            arrayPermission = arrayPermission + `
                            {
                            associatedModel:'${auxiliar2.model}',
                            route:'${global.app.config.get('api').prefix + '/' + auxiliar2.model}',
                            method:'POST',
                            rol:${role.id},
                            canAll:'${canAll}'
                        },`
                        }
                        if (auxiliar2.hasOwnProperty('delete')) {
                            cantMostrar++
                            var canAll = 'yes'
                            if (auxiliar2.read === 0) {
                                var canAll = 'no'
                            }
                            arrayPermission = arrayPermission + `
                            {
                            associatedModel:'${auxiliar2.model}',
                            route:'${global.app.config.get('api').prefix + '/' + auxiliar2.model}',
                            method:'DELETE',
                            rol:${role.id},
                            canAll:'${canAll}'
                        },`
                        }
                        if (auxiliar2.hasOwnProperty('update')) {
                            cantMostrar++
                            var canAll = 'yes'
                            if (auxiliar2.read === 0) {
                                var canAll = 'no'
                            }
                            arrayPermission = arrayPermission + `
                            {
                            associatedModel:'${auxiliar2.model}',
                            route:'${global.app.config.get('api').prefix + '/' + auxiliar2.model}',
                            method:'PATCH',
                            rol:${role.id},
                            canAll:'${canAll}'
                        },`
                        }
                    })
                    console.log(cantMostrar)
                })
                modelGenerateServerFunction = modelGenerateServerFunction + `
                 exports.permissions = [` + arrayPermission + `
        ]
    `
            }
            //PARA LLENAR EL MODELO CON LOS PERMISOS
            //         if(element==='serverfunction'){
            //             var modelSequelizeServerFunction = require(`../modelsSequelize/serverfunction`)(global.app.orm.sequelize, Sequelize)
            //             var modelSequelizeRoleServerFunction = require(`../modelsSequelize/roleserverfuntions`)(global.app.orm.sequelize, Sequelize)
            //             modelSequelizeRoleServerFunction.belongsTo(modelSequelizeServerFunction, { foreignKey: 'serverFuncionId', as: 'serverfunction' })
            //             modelSequelizeServerFunction.hasMany(modelSequelizeRoleServerFunction, { foreignKey: 'serverFuncionId', as: 'roleserverfuntionss' })
            //             var arrayRoleServerFunction = await modelSequelizeRoleServerFunction.findAll({include: [{association:'serverfunction'}]}).then(data=>{
            //                 return data
            //             })
            //             modelGenerate = modelGenerate + `
            //             exports.permissions = [`
            //             arrayRoleServerFunction.forEach(auxiliar => {
            //             modelGenerate = modelGenerate + `
            //                 {
            //                 associatedModel:'${auxiliar.serverfunction.associatedModel}',
            //                 route:'${auxiliar.serverfunction.route}',
            //                 method:'${auxiliar.serverfunction.method}',
            //                 rol:${auxiliar.roleId},
            //                 canAll:'${auxiliar.canAll}'
            //             },`
            //         })
            //         modelGenerate = modelGenerate + `
            //     ]
            // `
            //         }


            modelGenerate = modelGenerate.replace(/sequelize.literal/g, `global.app.orm.sequelize.literal`)
            modelGenerateServerFunction = modelGenerateServerFunction.replace(/sequelize.literal/g, `global.app.orm.sequelize.literal`)
            fs.writeFileSync(`modules/${nameFolderModule}/models/${element}.js`, modelGenerate);
            fs.writeFileSync(`modules/${nameFolderModule}/models/${element}.js`, modelGenerateServerFunction);
        })

        var bulkCreateFunction = []
        listTables.forEach(async element => {
            bulkCreateFunction.push({ route: global.app.config.get('api').prefix + '/' + element, method: 'PUT', associatedModel: element })
            bulkCreateFunction.push({ route: global.app.config.get('api').prefix + '/' + element, method: 'POST', associatedModel: element })
            bulkCreateFunction.push({ route: global.app.config.get('api').prefix + '/' + element, method: 'PATCH', associatedModel: element })
            bulkCreateFunction.push({ route: global.app.config.get('api').prefix + '/' + element, method: 'DELETE', associatedModel: element })
        })

        var response = await global.app.orm.sequelize.models.serverfunction.bulkCreate(bulkCreateFunction).then(data => {
            return data
        })

        if (req.body.hasOwnProperty('modelAccessControl')) {
            req.body.modelAccessControl.forEach(async el => {
                var bulkCreateRole = []
                var modelSequelizeRole = require(`../modelsSequelize/role`)(global.app.orm.sequelize, Sequelize)
                var role = await modelSequelizeRole.findOne({ where: { name: el.rol } })
                    .then(model => {
                        return model
                    })
                    .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/Id`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(400)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    })
                    .catch(function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/Id`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(500)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    });
                el.permission.forEach(el2 => {
                    const pepe = role.id
                    if (el2.hasOwnProperty('read')) {
                        var canAll = 'yes'
                        if (el2.read === 0) {
                            canAll = 'no'
                        }
                        var find = false
                        for (let index = 0; index < response.length && !find; index++) {
                            if (el2.model === response[index].associatedModel && response[index].method === 'PUT') {
                                find = true
                                bulkCreateRole.push({ "serverFunctionId": response[index].id, "roleId": role.id, "canAll": canAll })
                            }
                        }
                    }
                    if (el2.hasOwnProperty('create')) {
                        var canAll = 'yes'
                        if (el2.read === 0) {
                            canAll = 'no'
                        }
                        var find = false
                        for (let index = 0; index < response.length && !find; index++) {
                            if (el2.model === response[index].associatedModel && response[index].method === 'POST') {
                                find = true
                                bulkCreateRole.push({ "serverFunctionId": response[index].id, "roleId": role.id, "canAll": canAll })
                            }
                        }
                    }
                    if (el2.hasOwnProperty('delete')) {
                        var canAll = 'yes'
                        if (el2.read === 0) {
                            canAll = 'no'
                        }
                        var find = false
                        for (let index = 0; index < response.length && !find; index++) {
                            if (el2.model === response[index].associatedModel && response[index].method === 'DELETE') {
                                find = true
                                bulkCreateRole.push({ "serverFunctionId": response[index].id, "roleId": role.id, "canAll": canAll })
                            }
                        }
                    }
                    if (el2.hasOwnProperty('update')) {
                        var canAll = 'yes'
                        if (el2.read === 0) {
                            canAll = 'no'
                        }
                        var find = false
                        for (let index = 0; index < response.length && !find; index++) {
                            if (el2.model === response[index].associatedModel && response[index].method === 'PATCH') {
                                find = true
                                bulkCreateRole.push({ "serverFunctionId": response[index].id, "roleId": role.id, "canAll": canAll })
                            }
                        }
                    }
                })

                var response2 = await global.app.orm.sequelize.models.roleserverfunction.bulkCreate(bulkCreateRole).then(data => {
                    return data
                })
            })
        }

        //PARA POBLAR LA BD CON PERMISOS BASICOS
        // console.log('///////////Entre AQUI')
        //     listTables.forEach(async element=>{
        //         var bulkCreateFunction = []
        //         bulkCreateFunction.push({route: global.app.config.get('api').prefix + '/' + element, method: 'GET', associatedModel: element})
        //         bulkCreateFunction.push({route: global.app.config.get('api').prefix + '/' + element, method: 'POST', associatedModel: element})
        //         bulkCreateFunction.push({route: global.app.config.get('api').prefix + '/' + element, method: 'PATCH', associatedModel: element})
        //         bulkCreateFunction.push({route: global.app.config.get('api').prefix + '/' + element, method: 'DELETE', associatedModel: element})

        //         var response = await global.app.orm.sequelize.models.serverfunction.bulkCreate(bulkCreateFunction).then(data=>{
        //             return data
        //         })
        //         var bulkCreateRole = []
        //         response.forEach(element2=>{
        //             bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 2})
        //             if(element==='booking' && element2.method==='GET'){
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
        //             } else if(element==='booking' && element2.method==='POST'){
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
        //             } else if(element==='booking' && element2.method==='PATCH'){
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
        //             } else if(element==='booking' && element2.method==='DELETE'){
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6, "canAll": "no"})
        //                 bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
        //             }
        //         })
        //         var modelSequelizefdg = require(`../modelsSequelize/roleserverfuntions`)(global.app.orm.sequelize, Sequelize)
        //         const response2 = await modelSequelizefdg.bulkCreate(bulkCreateRole).then(data2 => {
        //         return data2
        //     })

        //     })       
        //     console.log('///////////SALI AQUI')

//         var PostmanFile = `
//         {
//             "info": {
//                 "_postman_id": "46aeeb76-3d95-4b40-8256-18e5cbe47dca",
//                 "name": "${nameFolderModule}",
//                 "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
//             },
//             "item": [`
//         var method = ""
//         var url = ""
//         var path = []
//         var arrayprefix = global.app.config.get('api').prefix.split('/')
//         var actions = ["index", "show", "create-One-Many", "update", "delete", "delete_multiple", "update_multiple"]
//         var protocol = "http"
//         var firstTime = true
//         if (global.app.config.get('api').useHttps) {
//             protocol = "https"
//         }
//         var host = global.app.config.get('api').host
//         if (host === '0.0.0.0') {
//             host = 'localhost'
//         }
//         listTables.forEach(async element => {
//             var model = await global.app.orm.sequelize.models[element].findAll()
//             if (firstTime) {
//                 if (ensureAuthenticated) {
//                     PostmanFile = PostmanFile + `{
//                         "name": "Auth",
//                         "item": [{
//                             "name": "sign-up",
//                             "request": {
//                                 "method": "POST",
//                                 "header": [{
//                                     "key": "Content-Type",
//                                     "name": "Content-Type",
//                                     "value": "application/json",
//                                     "type": "text"
//                                 }],
//                                 "body": {
//                                     "mode": "raw",
//                                     "raw": ""
//                                 },
//                                 "url": {
//                                     "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/sign-up"}",
//                                     "protocol": "${protocol}",
//                                     "host": [
//                                         "${host}"
//                                     ],
//                                     "port": "${global.app.config.get('api').port}",
//                                     "path": [
//                                         "${arrayprefix[1]}",
//                                         "sign-up"
//                                     ]
//                                 }
//                             },
//                             "response": []
//                         },
//                         {
//                             "name": "Login",
//                             "request": {
//                                 "auth": {
//                                     "type": "basic",
//                                     "basic": [{
//                                             "key": "password",
//                                             "value": "123",
//                                             "type": "string"
//                                         },
//                                         {
//                                             "key": "username",
//                                             "value": "Yuniet",
//                                             "type": "string"
//                                         }
//                                     ]
//                                 },
//                                 "method": "GET",
//                                 "header": [],
//                                 "body": {
//                                     "mode": "raw",
//                                     "raw": ""
//                                 },
//                                 "url": {
//                                     "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/login"}",
//                                     "protocol": "${protocol}",
//                                     "host": [
//                                         "${host}"
//                                     ],
//                                     "port": "${global.app.config.get('api').port}",
//                                     "path": [
//                                         "${arrayprefix[1]}",
//                                         "auth",
//                                         "login"
//                                     ]
//                                 }
//                             },
//                             "response": []
//                         },
//                         {
//                             "name": "logout",
//                             "request": {
//                                 "auth": {
//                                     "type": "bearer"
//                                 },
//                                 "method": "GET",
//                                 "header": [],
//                                 "body": {
//                                     "mode": "raw",
//                                     "raw": ""
//                                 },
//                                 "url": {
//                                     "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/auth/logout"}",
//                                     "protocol": "${protocol}",
//                                     "host": [
//                                         "${host}"
//                                     ],
//                                     "port": "${global.app.config.get('api').port}",
//                                     "path": [
//                                         "${arrayprefix[1]}",
//                                         "auth",
//                                         "logout"
//                                     ]
//                                 }
//                             },
//                             "response": []
//                         }
//                     ]
//                 },`
//                 }
//
//                 PostmanFile = PostmanFile + `{
//                     "name": "${element}",
//                     "item": [`
//                 firstTime = false
//             } else {
//                 PostmanFile = PostmanFile + `,{
//                     "name": "${element}",
//                     "item": [`
//             }
//             for (let i = 0; i < actions.length; i++) {
//                 path = []
//                 path.push(arrayprefix[1])
//                 path.push(`${element}`)
//                 if (actions[i] === "index" || actions[i] === "show") {
//                     method = "PUT"
//                     if (actions[i] === "index") {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element}"`
//                     } else {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element + "/1"}"`
//                         path.push("1")
//                     }
//                 } else if (actions[i] === "create-One-Many") {
//                     method = "POST"
//                     url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element}"`
//                 } else if (actions[i] === "update" || actions[i] === "update_multiple") {
//                     method = "PATCH"
//                     if (actions[i] === "update") {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element + "/1"}"`
//                         path.push("1")
//                     } else {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element}"`
//                     }
//                 } else if (actions[i] === "delete" || actions[i] === "delete_multiple") {
//                     method = "DELETE"
//                     if (actions[i] === "delete") {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element + "/1"}"`
//                         path.push("1")
//                     } else {
//                         url = `"${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/" + element}"`
//                     }
//                 }
//                 if (ensureAuthenticated) {
//                     PostmanFile = PostmanFile + `{
//                         "name": "${actions[i]}",
//                     "request": {
//                         "method": "${method}",
//                         "auth": {
//                             "type": "bearer"
//                         },
//                         "header": [{
//                             "key": "Content-Type",
//                             "name": "Content-Type",
//                             "value": "application/json",
//                             "type": "text"
//                         }],
//                         "body": {
//                             "mode": "raw",
//                             "raw": ""
//                         },
//                         "url": {
//                             "raw": ${url},
//                             "protocol": "${protocol}",
//                             "host": [
//                                 "${host}"
//                             ],
//                             "port": "${global.app.config.get('api').port}",
//                             "path": [`
//                     for (let j = 0; j < path.length; j++) {
//                         if (j !== path.length - 1) {
//                             PostmanFile = PostmanFile + `
//                                     "${path[j]}",`
//                         } else {
//                             PostmanFile = PostmanFile + `
//                                     "${path[j]}"`
//                         }
//                     }
//                     PostmanFile = PostmanFile + `
//                         ]`
//                     PostmanFile = PostmanFile + `
//                         }
//                     },
//                     "response": []
//                 }`
//                 } else {
//                     PostmanFile = PostmanFile + `{
//                         "name": "${actions[i]}",
//                     "request": {
//                         "method": "${method}",
//                         "header": [{
//                             "key": "Content-Type",
//                             "name": "Content-Type",
//                             "value": "application/json",
//                             "type": "text"
//                         }],
//                         "body": {
//                             "mode": "raw",
//                             "raw": ""
//                         },
//                         "url": {
//                             "raw": ${url},
//                             "protocol": "${protocol}",
//                             "host": [
//                                 "${host}"
//                             ],
//                             "port": "${global.app.config.get('api').port}",
//                             "path": [`
//                     for (let j = 0; j < path.length; j++) {
//                         if (j !== path.length - 1) {
//                             PostmanFile = PostmanFile + `
//                                     "${path[j]}",`
//                         } else {
//                             PostmanFile = PostmanFile + `
//                                     "${path[j]}"`
//                         }
//                     }
//                     PostmanFile = PostmanFile + `
//                         ]`
//                     PostmanFile = PostmanFile + `
//                         }
//                     },
//                     "response": []
//                 }`
//                 }
//                 if (i !== actions.length - 1) {
//                     PostmanFile = PostmanFile + `,
//                     `
//                 }
//             }
//             PostmanFile = PostmanFile + `
//         ]
//     }`
//         })
//         PostmanFile = PostmanFile + `,
//         {
//             "name": "index",
//             "request": {
//                 "method": "GET",
//                 "header": [],
//                 "body": {
//                     "mode": "raw",
//                     "raw": ""
//                 },
//                 "url": {
//                     "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix}",
//                     "protocol": "${protocol}",
//                     "host": [
//                          "${host}"
//                             ],
//                     "port": "${global.app.config.get('api').port}",
//                     "path": [
//                         "${arrayprefix[1]}"
//                     ]
//                 }
//             },
//             "response": []
//         },
//         {
//             "name": "help",
//             "request": {
//                 "method": "GET",
//                 "header": [],
//                 "body": {
//                     "mode": "raw",
//                     "raw": ""
//                 },
//                 "url": {
//                     "raw": "${"http://" + host + ":" + global.app.config.get('api').port + global.app.config.get('api').prefix + "/help"}",
//                     "protocol": "${protocol}",
//                     "host": [
//                          "${host}"
//                             ],
//                     "port": "${global.app.config.get('api').port}",
//                     "path": [
//                         "${arrayprefix[1]}",
//                         "help"
//                     ]
//                 }
//             },
//             "response": []
//         }
//     ]
// }`

        var indexHelp = ""
        indexHelp = indexHelp + `
'use strict';

module.exports = function(req, res) {
  var absoluteNewLinkPath = [
    req.protocol,
    '://',
    req.hostname,
    ':',
    global.app.config.get('api:port'),
    global.app.config.get('api:prefix')
  ].join('');
  
  // Public links.
  var jsonAPIBody = {
    links: {
        "help": absoluteNewLinkPath + '/help',`

        if (ensureAuthenticated) {
            indexHelp = indexHelp + `
          "signup": absoluteNewLinkPath + '/sign-up',
          "login": absoluteNewLinkPath + '/auth/login',
          "login_email": absoluteNewLinkPath + '/auth/login_email',
          "login_email_or_username": absoluteNewLinkPath + '/auth/login_email_or_username',
          "confirm": absoluteNewLinkPath + '/auth/confirm',
          "send_code": absoluteNewLinkPath + '/auth/send_code',
          "change_password": absoluteNewLinkPath + '/auth/change_password',
          "change_account": absoluteNewLinkPath + '/auth/change_account',
          "logout": absoluteNewLinkPath + '/auth/logout',`
        }
        for (let i = 0; i < listTables.length; i++) {
            indexHelp = indexHelp + `
            "${listTables[i]}": absoluteNewLinkPath + "/${listTables[i]}",`
        }
        indexHelp = indexHelp + `
}
};
return res.status(200).json(jsonAPIBody); // OK.
};`

        fs.writeFileSync('modules/api-root/routes/index.js', indexHelp)

        var ApiRouteIndex = `
'use strict';

exports.setRoutes = function setRoutes() {
  global.app.express
        .route(global.app.config.get('api:prefix'))
        .get(require('./routes/index'));

  global.app.express
        .route('/')
        .get(require('./routes/index'));

  global.app.express
        .route(global.app.config.get('api:prefix')+'/help')
        .get(require('./routes/help'));
};`
        var find = false
        var nameAuth = ""
        for (let i = 0; i < listTables.length && !find; i++) {
            if (listTables[i] === 'person' || listTables[i] === 'Person' || listTables[i] === 'persons' || listTables[i] === 'Persons' ||
                listTables[i] === 'user' || listTables[i] === 'User' || listTables[i] === 'users' || listTables[i] === 'Users') {
                nameAuth = listTables[i]
                find = true
            }
        }

        fs.writeFileSync('modules/api-root/index.js', ApiRouteIndex)

        var ApiRouteHelp = fs.readFileSync('modules/generated-module/FilesAuxiliarys/help.js')

        fs.writeFileSync('modules/api-root/routes/help.js', ApiRouteHelp)

        if (ensureAuthenticated) {
            var htmlpug = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/emails/new-user/html.pug')
            fs.writeFileSync('modules/auth/emails/new-user/html.pug', htmlpug)

            var textpug = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/emails/new-user/text.pug')
            fs.writeFileSync('modules/auth/emails/new-user/text.pug', textpug)

            var indexAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/index.js')
            fs.writeFileSync('modules/auth/index.js', indexAuthRoute)

            var indexLoginAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/login/index.js')
            var indexLoginAuthRouteReplace = indexLoginAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/login/index.js', indexLoginAuthRouteReplace)

            var indexLoginEmailAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/login_email/index.js')
            var indexLoginEmailAuthRouteReplace = indexLoginEmailAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/login_email/index.js', indexLoginEmailAuthRouteReplace)

            var indexLoginEmailOrUsernameAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/login_email_or_username/index.js')
            var indexLoginEmailOrUsernameAuthRouteReplace = indexLoginEmailOrUsernameAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/login_email_or_username/index.js', indexLoginEmailOrUsernameAuthRouteReplace)

            var indexConfirmAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/confirm/index.js')
            var indexConfirmAuthRouteReplace = indexConfirmAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/confirm/index.js', indexConfirmAuthRouteReplace)

            var indexSendCodeAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/send_code/index.js')
            var indexSendCodeAuthRouteReplace = indexSendCodeAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/send_code/index.js', indexSendCodeAuthRouteReplace)

            var indexChangePasswordAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/change_password/index.js')
            var indexChangePasswordAuthRouteReplace = indexChangePasswordAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/change_password/index.js', indexChangePasswordAuthRouteReplace)

            var indexChangeAccountAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/change_account/index.js')
            var indexChangeAccountAuthRouteReplace = indexChangeAccountAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/change_account/index.js', indexChangeAccountAuthRouteReplace)

            var indexLogoutAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/logout/index.js')
            fs.writeFileSync('modules/auth/routes/logout/index.js', indexLogoutAuthRoute)

            var indexSignUpAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/sign-up/index.js')
            var indexSignUpAuthRouteReplace = indexSignUpAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/sign-up/index.js', indexSignUpAuthRouteReplace)

            var indexValidateAuthRoute = fs.readFileSync('modules/generated-module/FilesAuxiliarys/auth/routes/validate/index.js')
            var indexValidateAuthRouteReplace = indexValidateAuthRoute.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('modules/auth/routes/validate/index.js', indexValidateAuthRouteReplace)

            var authMiddleware = fs.readFileSync('common/middleware/auth.js')
            var authMiddlewareReplace = authMiddleware.toString().replace(/models.Person/g, `models.${nameAuth}`)
            fs.writeFileSync('common/middleware/auth.js', authMiddlewareReplace)
        }

        // fs.writeFileSync(`consume_files/RestServices${nameFolderModule}.json`, PostmanFile);
        res.status(200).json({ message: "Todo creado correctamente" });
    }
}

module.exports = Controller