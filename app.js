"use strict";

var express = require("express");
const dns = require('dns').promises;
var path = require("path");
var fs = require("fs");
const os = require('os');
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var compression = require("compression");
var fileUpload = require("express-fileupload");
var useragent = require("useragent");
const DeviceDetector = require('node-device-detector');

var http = require("http");
var https = require("https");
var async = require("async");
//CON ESTO SE PUEDE SABER EL PAIS POR EL QUE SE ESTA CONECTANDO UNO
// var geoip = require('geoip-lite');
// var geo = geoip.lookup('200.55.152.13')
// console.log(geo)
//CON ESTO SE PUEDE SABER EL PAIS POR EL QUE SE ESTA CONECTANDO UNO

const servicesWithOutModel = [
    'v1',
    'help',
    'auth',
    'sign-up',
    'login',
    'logout',
    'generate',
    'createDataTest',
    'consume_data',
    'generated_json_postman',
    'create_migration',
    'confirm',
    'send_code',
    'change_password',
    'change_account',
    'login_email',
    'login_email_or_username',
    'confirm',
    'send_code',
    'change_password',
    'change_account'
]

var path  = require('path');
var nconf = require('nconf');

nconf.argv().env();

module.exports = {
    servicesWithOutModel
}

// Method to calculate service duration
const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

var app = express();

var config = require("./config/env/index");

if ("app" in global) {
    throw new Error("Global namespace already have a variable named `app`.");
}

global.app = {};
global.app.config = config;
global.app.express = app;
global.app.routes = {};
global.app.utils = require("./common/utils/index");
global.eventHandler = require("./common/socket/event-handler");
global.app.logger = require("./common/utils/index").logger;
global.app.security = require("./common/middleware/auth");
global.security = require("./common/middleware/auth");
global.app.emailTemplates = {};

app.use(compression());
app.use(cors({ maxAge: 604800000 }));

//Esto es para tener un directorio para fotos
app.use("/assets", express.static(path.join(__dirname, "./assets")));

// app.use(
//     fileUpload({
//         useTempFiles: true,
//         tempFileDir: "/assets/",
//     })
// );

// Esto es para coger directo el ip del server y montar el servidor sin necesidad de cambiar el host
var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address);
        }
    }
}

const host_finish = []
addresses.forEach((v,i,arr) => {
    host_finish.push(v.address)
})
host_finish.push('127.0.0.1')
const host_file = global.app.config.get('api:host')
let comparison = !Array.isArray(host_file) ?? false
for (let i = 0; i < host_finish.length && !comparison; i++) {
    if(host_file.filter(e => e === host_finish[i]).length === 0)
        comparison = true
}
if(comparison && process.env.NODE_ENV !== "production") {
    global.app.config.set('api:host', host_finish)
    global.app.config.save('api:host')
}

app.use(
    global.app.config.get("api:prefix") + "/public",
    express.static(__dirname + "/public", {
        maxAge: 604800000,
    })
);

app.use(bodyParser.json({ limit: global.app.config.get("api:fileLimit") }));
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: global.app.config.get("api:fileLimit"),
    })
);

var helmet = require("helmet");
app.use(helmet());
app.use(morgan("dev"));
app.use(function(req, res, next) {
    /**
     * para mitigar las peticiones duplicadas de los navegadores
     * ver
     * https://github.com/expressjs/express/issues/2512
     * */
    req.connection.setTimeout(1000 * 60 * 10);
    return next();
});
// Log API requests.
app.use(function(req, res, next) {
    const start = process.hrtime()
    if (
        (req.method.toLowerCase() === "post" ||
            req.method.toLowerCase() === "patch" ||
            req.method.toLowerCase() === "put") &&
        !req.is("application/json") &&
        req.path != "/v1/user/logout" &&
        req.path != "/v1/auth/logout"
    ) {
        return res.sendStatus(415); // Unsupported Media Type.
    }

    // let startTime = new Date()
    res.on("finish", function onResFinish() {
        // let finishedTime = new Date()
        const durationInMilliseconds = parseInt(getDurationInMilliseconds(start))
        if (res.statusCode !== 404 && res.statusCode !== 415) {
            var models = global.app.orm.sequelize.models
            var modelsArr = Object.keys(models);
            var pathOriginal = req.path;
            var pathFinal = ""

            pathOriginal.split('/').forEach(e => {
                if (modelsArr.indexOf(e) !== -1 || servicesWithOutModel.indexOf(e) !== -1) {
                    pathFinal += "/" + e
                }
            })
            global.app.orm.sequelize.models.serverfunction
                .findAll({
                    where: {
                        route: pathFinal,
                        method: req.method,
                    },
                })
                .then((serverFunctions) => {
                    if (serverFunctions.length === 0) {
                        console.log(
                            new Error(
                                "No se encuentra ningun serverfunction de acuerdo con la peticion"
                            )
                        );
                        return serverFunctions;
                    } else {
                        const userSpecificStuff = {
                            service_duration: durationInMilliseconds
                        };
                        if (req.loggedUser) {
                            // Get user specific stuff
                            // const date_now = (new Date()).getTime();
                            // const tokenLifeTime = ((new Date(req.loggedUser.date)).getTime() + parseInt(req.tokenLifeTime)) - date_now
                            // var personLastLogout = moment((new Date(req.loggedUser.date)).getTime() + parseInt(req.tokenLifeTime), 'milliseconds');
                            // const tokenLifeTime = personLastLogout.diff(date_now, 'milliseconds')

                            const date_logged_user = (new Date(req.loggedUser.dataValues.date)).getTime()
                            const tokenLifeTime = new Date(date_logged_user + parseInt(req.tokenLifeTime))

                            userSpecificStuff.personId = req.loggedUser.username;
                            userSpecificStuff.token_life_time = tokenLifeTime;
                            userSpecificStuff.last_login = req.loggedUser.lastLogin;
                        }

                        // Esto es con node-device-detector
                        const detector = new DeviceDetector();
                        const userAgentDetector = detector.detect(req.headers['user-agent'])
                        const operatingSystem = Object.values(userAgentDetector.os).toString()
                        const device = Object.values(userAgentDetector.device).toString()
                        const navigator = Object.values(userAgentDetector.client).toString()

                        // navigator esta por defecto
                        // Esto es con useragent
                        // useragent(true)
                        // const agent = useragent.parse(req.headers['user-agent']);
                        // const operatingSystem = agent.os.toString()
                        // const navigator = agent.toAgent()
                        // // const device = "Desktop" // Esto lo hago asi pq en la yuri son todos maquinas y pq no estoy pa romperme la cabeza
                        // const device = agent.device.toString() === "Other 0.0.0" ? "Desktop" : agent.device.toString()
                        global.app.orm.sequelize.models.log
                            .create({
                                // personId: id_user,
                                serverFunctionId: serverFunctions[0].id,
                                statusCode: res.statusCode,
                                originIp: req.ip,
                                // mac: req.header('mac'),
                                navigator: navigator,
                                os: operatingSystem,
                                device: device,
                                ...userSpecificStuff
                            })
                            .then((log) => {
                                return log;
                            })
                            .catch((err) => {
                                global.app.utils.logger.error(err, {
                                    module: `cubaExport`,
                                    submodule: "app",
                                    stack: err.stack,
                                });
                            });
                    }
                })
                .catch((err) => {
                    global.app.utils.logger.error(err, {
                        module: `cubaExport`,
                        submodule: "app",
                        stack: err.stack,
                    });
                });
        }
        global.app.utils.logger.info("API request.", {
            module: "core",
            submodule: "api-request",
            data: {
                req: {
                    method: req.method,
                    url: req.url,
                    ip: req.ip,
                },
                res: {
                    statusCode: res.statusCode,
                },
            },
        });
        // global.app.orm.sequelize.models.navigationinfo.create({
        //     personId: req.loggedUser.id,
        //     originIP: (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.ip, //Esto no estoy seguro
        //     navigator: req.header('browser'),
        //     os: req.header('os'),

        // })
    });

    // Esto se ejecuta despues del res.on(finish), es un ultimo paso
    // res.on('close', () => {
    //     const durationInMilliseconds = getDurationInMilliseconds (start)
    //     console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
    // })
    next();
});

global.nombre = "unoi dos tres";
// loading Db configuration
var db = require("./common/db");
const moment = require("moment");
global.app.orm = db;
global.jsonAPI = global.app.utils.jsonAPI;

async.series(
    [
        function(cb) {
            // Setup database connections.
            db.setupDB(function(error) {
                if (error) {
                    return cb(error);
                }
                cb();
            });
        },

        function(cb) {
            // Initializing routing system.
            global.app.utils.initOnModules({
                hook: function hookRegisteringRoutes(module, itemPath, cbHook) {
                    if ("setRoutes" in module) {
                        try {
                            module.setRoutes();
                        } catch (error) {
                            return cbHook(error);
                        }
                    }
                    cbHook();
                },
                cb: function onFinishRegisteringRoutes(error) {
                    if (error) {
                        global.app.utils.logger.error(error, {
                            module: "core",
                            submodule: "routes",
                            stack: error.stack,
                        });
                        return cb(error);
                    }
                    global.app.utils.logger.info("Routes were setup successfully.", {
                        module: "core",
                        submodule: "routes",
                    });
                    cb();
                },
            });
        },
        function(cb) {
            // Initializing tasks system.
            global.app.utils.initOnModules({
                hook: function hookRegisteringTasks(module, itemPath, cbHook) {
                    if ("loadTasks" in module) {
                        try {
                            module.loadTasks();
                        } catch (error) {
                            return cbHook(error);
                        }
                    }
                    cbHook();
                },
                cb: function onFinishRegisteringTasks(error) {
                    if (error) {
                        global.app.utils.logger.error(error, {
                            module: "core",
                            submodule: "tasks",
                            stack: error.stack,
                        });
                        return cb(error);
                    }
                    global.app.utils.logger.info("Tasks were setup successfully.", {
                        module: "core",
                        submodule: "tasks",
                    });
                    cb();
                },
            });
        },
        function(cb) {
            if (!global.app.config.get("mailer:enabled")) {
                global.app.utils.logger.info(
                    "Not registering email templates since mailer is disabled in config.", {
                        module: "core",
                        submodule: "emails",
                    }
                );
                return cb();
            }

            // Registering email templates.
            global.app.utils.initOnModules({
                hook: function hookRegisteringTasks(module, itemPath, cbHook) {
                    if ("loadEmails" in module) {
                        try {
                            module.loadEmails();
                        } catch (error) {
                            return cbHook(error);
                        }
                    }
                    cbHook();
                },
                cb: function onFinishRegisteringTasks(error) {
                    if (error) {
                        global.app.utils.logger.error(error, {
                            module: "core",
                            submodule: "emails",
                            stack: error.stack,
                        });
                        return cb(error);
                    }
                    global.app.utils.logger.info(
                        "Email templates were registered successfully.", {
                            module: "core",
                            submodule: "emails",
                        }
                    );
                    cb();
                },
            });
        },
        function(cb) {
            var route,
                routes = [];
            require("./common/utils/hooks-handler").start();
            global.app.utils = require("./common/utils/index");
            global.app.security = require("./common/middleware").auth;

            cb();
        },
    ],
    async function(error) {
        if (error) {
            // Do nothing. This error is already handled by the innermost package.
            // For now, log a final error and do not start the server.
            global.app.utils.logger.error(
                "Application won't start due init errors.", {
                    module: "core",
                    submodule: "init",
                    stack: error.stack,
                }
            );
            // Exit the app with error status.
            throw new Error(error);
        }

        // Register the 500 error express handler.
        app.use(function(errorUseMiddleware, req, res, next) {
            global.app.utils.logger.error(errorUseMiddleware, {
                module: "core",
                submodule: "middleware",
                stack: errorUseMiddleware.stack,
            });
            res.status(500).json({});
        });

        // Register the 500 error express handler.
        app.use(function(errorUseMiddleware, req, res, next) {
            // Signature needed even when not used since it is what it set it as an error middleware.

            global.app.utils.logger.error(errorUseMiddleware, {
                module: "core",
                submodule: "middleware",
                stack: errorUseMiddleware.stack,
            });
            res.status(500).json(utils.jsonAPI.processErrors(errorUseMiddleware));
        });

        var serverCreator;
        /*
                                                var selfSignedKeysPath = path.join('keys', 'self-signed');

                                                var httpsOptions       = {
                                                  key : fs.readFileSync(path.join(selfSignedKeysPath, 'key.pem')),
                                                  cert: fs.readFileSync(path.join(selfSignedKeysPath, 'cert.pem'))
                                                };*/

        serverCreator =
            /*(global.app.config.get('api:useHttps'))
                                                                                         ? https.createServer.bind(this, httpsOptions, app)
                                                                                         :*/
            http.createServer.bind(this, app);

        var server = serverCreator().on("error", function onServerError(
            errorOnCreateServer
        ) {
            if (errorOnCreateServer.syscall !== "listen") {
                throw errorOnCreateServer;
            }

            // Handle specific listen errors with friendly messages.
            if (errorOnCreateServer.code === "EACCES") {
                global.app.utils.logger.error(
                    app.get("port") + " requires elevated privileges.", {
                        module: "core",
                        submodule: "init",
                        stack: errorOnCreateServer.stack,
                    }
                );
                throw new Error(errorOnCreateServer);
            } else if (errorOnCreateServer.code === "EADDRINUSE") {
                global.app.utils.logger.error(app.get("port") + " is already in use.", {
                    module: "core",
                    submodule: "init",
                    stack: errorOnCreateServer.stack,
                });
                throw new Error(errorOnCreateServer);
            }
            throw errorOnCreateServer;
        });

        //socket connection
        var socket = require("./common/socket/socket");
        socket.create(server);

        const environment = nconf.get('NODE_ENV') || process.env.NODE_ENV || 'development';

        let host_name
        if(environment === 'production_heroku' || environment === "production") {
            host_name = global.app.config.get("hostname")
        }

        console.log(environment, host_name)

        const port = process.env.PORT || global.app.config.get("api:port")
        const host = !host_name ? global.app.config.get("api:host") : undefined

        server.listen(
            port,
            host,
            function() {
                if(environment === 'production_heroku' || environment === "production") {
                    global.app.utils.logger.info(
                        `Server listening on https://${host_name}${global.app.config.get("api:prefix")}.`, {
                            module: "core",
                            submodule: "init",
                        }
                    );
                }
                else if(environment !== "development")
                    global.app.utils.logger.info(
                        `Server listening on http://${Array.isArray(host) ? host[0] : host}:${port}${global.app.config.get("api:prefix")}.`, {
                            module: "core",
                            submodule: "init",
                        }
                    );
                else
                    host_finish.forEach((value, index, array) => {
                    global.app.utils.logger.info(
                        `Server listening on http://${value}:${port}${global.app.config.get("api:prefix")}.`, {
                            module: "core",
                            submodule: "init",
                        }
                    );
                })

                // Log uncaught errors and act accordingly.
                // http://shapeshed.com/uncaught-exceptions-in-node
                process.on("uncaughtException", function onUncaughtException(
                    errorOnUncaught
                ) {
                    global.app.utils.logger.error(errorOnUncaught, {
                        module: "core",
                        submodule: "uncaught",
                        stack: errorOnUncaught.stack,
                    });
                    // Exit the app with error status.
                    throw new Error(errorOnUncaught);
                });
            }
        );
    }
);