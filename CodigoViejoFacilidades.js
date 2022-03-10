// const User = require("../database/models/User");
// const Product = require("../database/models/Productos");
// const TipoProducto = require('../database/models/TipoProducto')

//npx sequelize-auto -o "./models" -d node-complete -h localhost -u root -p 3306 -x 123abc -e mysql
//npx sequelize-auto -o "./modules/generated-module/modelsSequelize" -d node-complete -h localhost -u root -p 3306 -x 123abc -e mysql

// Esto es para modificar valor antes de mostrar
// get: function() {
//
//     this.setDataValue('password', "123");
//     return this.getDataValue("password");
// },

//Esto es para definir una por una las relaciones------- model: User
//Esto es para decir los campos que quiero devolver---- attributes: ['name']
//Esta sentencia es para coger todas las relaciones que existan por debajo--- findAll({ include: [{ all: true, nested: true }]});
//Esto es para relacionar por el alias--- association: 'user'
//Esto es para las nested Query---- include: [{ model: Product, where: { title: "sfgdfgdfg" } }] ---- Esto ademas es para para si quieres devolver todos los objetos padres---- required: false
//Esto es para las nested Query--- include: [{ model: Product,  , include: [{ model: TipoProducto, required: true, where: { inventario: "sdf" } }] }] CADA VEZ QUE BAJO UN NIVEL TENGO QUE PONER required: true
//Esto es para llamar un arreglo de relaciones---- include: ['user', 'tipo_product'] Claro que es por los alias de las relaciones
//include: [{ association: 'products', include: [{ association: 'tipo_product' }] }] Claro que es por los alias de las relaciones Esto es para relaciones demtro de relaciones
//include: [{ association: 'user' }, { association: 'tipo_product' }] Claro que es por los alias de las relaciones Esto es para las relaciones del modelo en el que estes parado
//A partir de aqui voy a meter nested query

//Esta es la forma vieja!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var atributos = "";
// var atributosRelaciones = [];
// if (req.body.attributos) {
//     if (req.body.attributos.length >= 1) {
//         var atributosLocales = [];
//         for (let i = 0; i < req.body.attributos.length; i++) {
//             var obj = req.body.attributos[i];
//             var atributosEspecificos = [];
//             for (let j = 0; j < obj.length; j++) {
//                 var objEspecifico = obj[j];
//                 if (objEspecifico.indexOf(".") === -1) {
//                     atributosLocales.push(objEspecifico);
//                 } else {
//                     var array = objEspecifico.split(".");
//                     var relation = "";
//                     atributosEspecificos.push(array[array.length - 1]);
//                     if (j === obj.length - 1) {
//                         for (let k = array.length - 2; k >= 0; k--) {
//                             if (k === array.length - 2) {
//                                 relation = {
//                                     association: array[k],
//                                     attributes: atributosEspecificos
//                                 };
//                             } else {
//                                 relation = { association: array[k], include: [relation] };
//                             }
//                         }
//                         atributosRelaciones.push(relation);
//                     }
//                 }
//             }
//         }
//         if (atributosLocales.length > 0) atributos = atributosLocales;
//     }
// }

//Esta es la forma vieja!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var atributos_nested = "";
// if (req.body.attr) {
//     if (req.body.attr.nested_attr) {
//         var nested_attr = req.body.attr.nested_attr;
//         var key = "nested_attr";
//         delete req.body.attr[key];
//         if (nested_attr.length >= 1) {
//             for (let i = 0; i < nested_attr.length; i++) {
//                 var obj = nested_attr[i];
//                 if (obj.indexOf(".") !== -1) {
//                     var array = obj.split(".");
//                     var relation = "";
//                     for (let j = array.length - 2; j >= 0; j--) {
//                         if (j === array.length - 2) {
//                             var arraycondicion = array[array.length - 1].split(":");
//                             var condicion = JSON.parse(
//                                 "{" +
//                                 '"' +
//                                 arraycondicion[0] +
//                                 '"' +
//                                 ":" +
//                                 '"' +
//                                 arraycondicion[1] +
//                                 '"' +
//                                 "}"
//                             );
//                             relation = {
//                                 association: array[j],
//                                 required: true,
//                                 where: condicion
//                             };
//                         } else {
//                             relation = {
//                                 association: array[j],
//                                 required: true,
//                                 include: [relation]
//                             };
//                         }
//                     }
//                 }
//             }
//             atributos_nested = relation;
//         }
//     }
// }

//CODIGO VIEJOOOOOOOOOOOOOOOOOOO VA EN EL PROCESAMIENTO DE LOS ATTRNESTED
// var array = i.split(".");
// var relation = "";
// for (let j = array.length - 1; j >= 0; j--) {
//     if (j === array.length - 1) {
//         relation = {
//             association: array[j],
//             required: true,
//             where: req.body.attr[i]
//         };
//     } else {
//         relation = {
//             association: array[j],
//             required: true,
//             include: [relation]
//         };
//     }
// }
// atributos_nested.push(relation);

//RUTAS VIEJAS
// this.router.post('/', new controller(model).index)
//         this.router.post('/find_by_id/:Id', new controller(model).findById)
//         this.router.post('/find_by_parameters', new controller(model).findByParameters)
//         this.router.post('/delete/:Id', new controller(model).delete)
//         this.router.post('/create', new controller(model).create)
//         this.router.post('/update/:Id', new controller(model).update)
//         this.router.post('/delete_multiple', new controller(model).delete_multiple)
//         this.router.post('/create_multiple', new controller(model).create_multiple)
//         this.router.post('/update_multiple', new controller(model).update_multiple)

//CREATE MULTIPLE VIEJO
// create_multiple = (req, res, next) => {
//     this.model
//         .bulkCreate(req.body)
//         .then(m => {
//             res.status(200).json({ data: m });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };

//Esta funcion ya no c usa pq el index lo que invoca es el find_by_parameters
// index = (req, res, next) => {
//     this.model
//         .findAll({ include: [{ all: true }] })
//         .then(model => {
//             res.status(200).json({
//                 data: model
//             });
//         })
//         .catch(err => {
//             if (!err.statusCode) {
//                 err.statusCode = 500;
//             }
//             next(err);
//         });
// };

//PARSEO DE LA BD PARA CONTRUIR LOS MODELOS COMO SE USAN EN EL GUAJIRITO
// const listTables = await global.app.orm.sequelize
//             .query("SHOW Tables", {
//                 type: global.app.orm.sequelize.QueryTypes.SHOWTABLES
//             })
//             .then(result => {
//                 return result
//             });

//         var modelSequelize = ""
//         var modelGenerate = ""
//         var atributes = ""
//         var modelString = ""
//         var enumboolean = false
//         var arrayAuxiliarEnum = []
//         var arrayRelations = []
//         console.log(listTables)
//         listTables.forEach(element => {
//             arrayRelations = []
//             modelSequelize = require(`../modelsSequelize/${element}`)(global.app.orm.sequelize, Sequelize)
//             modelString = fs.readFileSync(`modules/new-generated-module/modelsSequelize/${element}.js`).toString()
//             modelGenerate = `'use strict';

//             var lodash = require('lodash');

//             exports.loadModel = function loadModel() {
//                 const ${element} = global.app.orm.sequelize.define('${element}',
//                     lodash.extend({}, global.app.orm.mixins.attributes, {`

//             var modelStringDatatypes = modelString.split('DataTypes')
//             atributes = modelSequelize.rawAttributes
//             for (let i in atributes) {
//                 if (i !== 'id' && i !== 'createdAt' && i !== 'updatedAt' && i !== 'deletedAt') {
//                     modelGenerate = modelGenerate + `
//                             "${i}": {`
//                     for (let j in atributes[i]) {
//                         if (j !== 'Model' && j !== 'fieldName' && j !== '_modelAttribute' && j !== 'field') {
//                             if (j === 'type') {
//                                 if (atributes[i][j] instanceof Sequelize.STRING) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.STRING,`
//                                 } else if (atributes[i][j] instanceof Sequelize.TEXT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.TEXT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.INTEGER) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.INTEGER,`
//                                 } else if (atributes[i][j] instanceof Sequelize.DOUBLE) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.DOUBLE,`
//                                 } else if (atributes[i][j] instanceof Sequelize.DATE) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.DATE,`
//                                 } else if (atributes[i][j] instanceof Sequelize.ENUM) {
//                                     enumboolean = true
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.ENUM,`
//                                 } else if (atributes[i][j] instanceof Sequelize.JSON) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.JSON,`
//                                 } else if (atributes[i][j] instanceof Sequelize.BOOLEAN) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.BOOLEAN,`
//                                 } else if (atributes[i][j] instanceof Sequelize.CHAR) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.CHAR,`
//                                 } else if (atributes[i][j] instanceof Sequelize.FLOAT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.FLOAT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.NUMBER) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.NUMBER,`
//                                 } else if (atributes[i][j] instanceof Sequelize.RANGE) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.RANGE,`
//                                 } else if (atributes[i][j] instanceof Sequelize.TIME) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.TIME,`
//                                 } else if (atributes[i][j] instanceof Sequelize.UUID) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.UUID,`
//                                 } else if (atributes[i][j] instanceof Sequelize.UUIDV1) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.UUIDV1,`
//                                 } else if (atributes[i][j] instanceof Sequelize.UUIDV4) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.UUIDV4,`
//                                 } else if (atributes[i][j] instanceof Sequelize.VIRTUAL) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.VIRTUAL,`
//                                 } else if (atributes[i][j] instanceof Sequelize.ABSTRACT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.ABSTRACT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.ARRAY) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.ARRAY,`
//                                 } else if (atributes[i][j] instanceof Sequelize.DATEONLY) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.DATEONLY,`
//                                 } else if (atributes[i][j] instanceof Sequelize.DECIMAL) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.DECIMAL,`
//                                 } else if (atributes[i][j] instanceof Sequelize.INET) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.INET,`
//                                 } else if (atributes[i][j] instanceof Sequelize.NOW) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.NOW,`
//                                 } else if (atributes[i][j] instanceof Sequelize.REAL) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.REAL,`
//                                 } else if (atributes[i][j] instanceof Sequelize.SMALLINT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.SMALLINT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.JSONB) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.JSONB,`
//                                 } else if (atributes[i][j] instanceof Sequelize.GEOMETRY) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.GEOMETRY,`
//                                 } else if (atributes[i][j] instanceof Sequelize.MEDIUMINT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.MEDIUMINT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.TINYINT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.TINYINT,`
//                                 } else if (atributes[i][j] instanceof Sequelize.BLOB) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.BLOB,`
//                                 } else if (atributes[i][j] instanceof Sequelize.CIDR) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.CIDR,`
//                                 } else if (atributes[i][j] instanceof Sequelize.CITEXT) {
//                                     modelGenerate = modelGenerate + `
//                                     "${j}": DATATYPE.CITEXT,`
//                                 }
//                             } else {
//                                 if (atributes[i][j] instanceof Object) {
//                                     var isArray = false
//                                     modelGenerate = modelGenerate + `
//                                    "${j}": `
//                                     var numberForString = ""
//                                     var firstTime = true
//                                     for (let k in atributes[i][j]) {
//                                         if (!isNaN(k)) {
//                                             isArray = true
//                                             numberForString = parseInt(k)
//                                             if (numberForString === 0) {
//                                                 if(typeof atributes[i][j][k] === 'string'){
//                                                     modelGenerate = modelGenerate + `["${atributes[i][j][k]}",`
//                                                 } else {
//                                                     modelGenerate = modelGenerate + `[${atributes[i][j][k]},`
//                                                 }
//                                             } else if (numberForString > 0 && k < atributes[i][j].length - 1) {
//                                                 if(typeof atributes[i][j][k] === 'string'){
//                                                     modelGenerate = modelGenerate + `"${atributes[i][j][k]}",`
//                                                 } else {
//                                                     modelGenerate = modelGenerate + `${atributes[i][j][k]},`
//                                                 }
//                                             } else if (numberForString === atributes[i][j].length - 1) {
//                                                 if(typeof atributes[i][j][k] === 'string'){
//                                                     modelGenerate = modelGenerate + `"${atributes[i][j][k]}"],`
//                                                 } else {
//                                                     modelGenerate = modelGenerate + `${atributes[i][j][k]}],`
//                                                 }
//                                             }
//                                         } else {
//                                             //arrayAuxiliarEnum.push(atributes[i][j][k])
//                                             if (firstTime) {
//                                                 if (j === 'references' && k === 'model') {
//                                                     arrayRelations.push(atributes[i][j][k])
//                                                 }
//                                                 if(typeof atributes[i][j][k] === 'string'){
//                                                     firstTime = false
//                                                 modelGenerate = modelGenerate + `{
//                                                     "${k}":"${atributes[i][j][k]}",`
//                                                 } else {
//                                                     firstTime = false
//                                                 modelGenerate = modelGenerate + `{
//                                                     "${k}":${atributes[i][j][k]},`
//                                                 }                                           
//                                             } else {
//                                                 if(typeof atributes[i][j][k] === 'string'){
//                                                     modelGenerate = modelGenerate + `
//                                                     "${k}":"${atributes[i][j][k]}",`
//                                                 } else {
//                                                     modelGenerate = modelGenerate + `
//                                                     "${k}":${atributes[i][j][k]},`
//                                                 }                                               
//                                             }
//                                         }
//                                     }
//                                     if (!isArray) {
//                                         modelGenerate = modelGenerate + `
//                                     },`
//                                     }
//                                 } else {
//                                     if (typeof atributes[i][j] === 'string') {
//                                         modelGenerate = modelGenerate + `
//                                    "${j}": "${atributes[i][j]}",`
//                                     } else {
//                                         modelGenerate = modelGenerate + `
//                                    "${j}": ${atributes[i][j]},`
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                     modelGenerate = modelGenerate + `},`
//                 }
//             }
//             modelGenerate = modelGenerate + `
//         }), {
//             comment: 'A example model.',
//             freezeTableName: true,
//             tableName: '${element}',
//             hooks: {}
//         });
//         Animal.associate = function() {
//             var models = global.app.orm.sequelize.models;`
//             for(let i = 0;i<arrayRelations.length;i++){
//                     modelGenerate = modelGenerate + `
//                     models.${element}.belongsTo(models.${arrayRelations[i]}, {
//                         as: '${arrayRelations[i]}'
//                     });`
//             }
//             modelGenerate = modelGenerate + `
//                     }
//                 };`
//                 //console.log(fs.readFileSync(`modules/new-generated-module/modelsSequelize/${element}.js`).toString())
//                 //console.log(atributes)    
//             fs.writeFileSync(`modules/new-generated-module/models/${element}(Pruebas).js`, modelGenerate);
//         })


//const controller = require('./controller')
// const fs = require('fs');
// const Sequelize = require('sequelize')
// const Controller = class Controller {
//     constructor() {}
//     generate = async(req, res, next) => {

//         var istimestamp = false
//         if (req.body.hasOwnProperty('timestamp')) {
//             if (typeof req.body.timestamp === 'boolean') {
//                 istimestamp = req.body.timestamp
//             } else {
//                 var error = new Error(
//                     `El parametro timestamp tiene que ser true o false`
//                 );
//                 return res.status(500)
//                     .json(jsonAPI.processErrors(error, req, { file: __filename }));;
//             }
//         } else {
//             var error = new Error(
//                 `Es obligatorio pasar el parametro timestamp : false | true`
//             );
//             return res.status(500)
//                 .json(jsonAPI.processErrors(error, req, { file: __filename }));;
//         }

//         var ensureAuthenticated = false
//         if (req.body.hasOwnProperty('ensureAuthenticated')) {
//             if (typeof req.body.ensureAuthenticated === 'boolean') {
//                 ensureAuthenticated = req.body.ensureAuthenticated
//             } else {
//                 var error = new Error(
//                     `El parametro ensureAuthenticated tiene que ser true o false`
//                 );
//                 return res.status(500)
//                     .json(jsonAPI.processErrors(error, req, { file: __filename }));;
//             }
//         }

//         const listTables = await global.app.orm.sequelize
//             .query("SHOW Tables", {
//                 type: global.app.orm.sequelize.QueryTypes.SHOWTABLES
//             })
//             .then(result => {
//                 return result
//             });

//         var modelSequelize = ""

//         var createFlie = ``
//         var index = `'use strict';`
//         var models = `
//         exports.loadModels = function loadModels() {`
//         var task = `
//         exports.loadTasks = function loadTasks() {};`
//         var routes = `
//         exports.setRoutes = function setRoutes() {
//             var models = global.app.orm.sequelize.models;`
//         listTables.forEach(element => {

//             modelSequelize = require(`../modelsSequelize/${element}`)(global.app.orm.sequelize, Sequelize)
//             console.log(modelSequelize)

//             index = index + `
//             const ${element}Routes = require('./routes/${element}route')
//             const ${element}Controller = require('./controllers/${element}controller')`

//             models = models + `
//             require('./models/${element}').loadModel();`

//             routes = routes + `
//             new ${element}Routes(${element}Controller, models.${element}).router`

//             fs.writeFileSync(`modules/new-generated-module/controllers/${element}controller.js`, `const controller = require('./controller')
// const Controller = class Controller extends controller {
// constructor(model) {
//    super(model)
// }
// }

// module.exports = Controller
//                                                     `);
//             fs.writeFileSync(`modules/new-generated-module/routes/${element}route.js`, `
//             const express = require('express')

// const routerGenerico = require('./routes')

// //Estas son las rutas especificas para productos
// class Routes extends routerGenerico {
//     constructor(controller,model) {
//         super(controller,model)
//     }
// }
// module.exports = Routes
//             `)
//         })

//         createFlie = index + models + `
//         };` + task + routes + `};`
//         fs.writeFileSync(`modules/new-generated-module/index.js`, createFlie);

//         if (ensureAuthenticated) {
//             fs.writeFileSync(`modules/new-generated-module/routes/routes.js`, `
//             const express = require("express");
//     var ensureAuthenticated = global.app.security.ensureAuthenticated();

//     //Esto es para las rutas genericas
//     class Routes {
//         router = global.app.config.get('api:prefix');
//         constructor(controller, model) {
//             controller = new controller(model)
//                 //Collection
//             global.app.express
//                 .route(this.router + "/" + model.name + "/")
//                 .get(ensureAuthenticated, controller.findByParameters)
//                 .post(ensureAuthenticated, controller.create)
//                 .patch(ensureAuthenticated, controller.update_multiple)
//                 .delete(ensureAuthenticated, controller.delete_multiple);
//             //Single
//             global.app.express
//                 .route(this.router + "/" + model.name + "/:Id")
//                 .get(ensureAuthenticated, controller.findById)
//                 .patch(ensureAuthenticated, controller.update)
//                 .delete(ensureAuthenticated, controller.delete);
//         }
//     }
//     module.exports = Routes;
//             `)
//         } else {
//             fs.writeFileSync(`modules/new-generated-module/routes/routes.js`, `
//             const express = require("express");
//             var ensureAuthenticated = global.app.security.ensureAuthenticated();

//     //Esto es para las rutas genericas
//     class Routes {
//         router = global.app.config.get('api:prefix');
//         constructor(controller, model) {
//             controller = new controller(model)
//                 //Collection
//             global.app.express
//                 .route(this.router + "/" + model.name + "/")
//                 .get(controller.findByParameters)
//                 .post(controller.create)
//                 .patch(controller.update_multiple)
//                 .delete(controller.delete_multiple);
//             //Single
//             global.app.express
//                 .route(this.router + "/" + model.name + "/:Id")
//                 .get(controller.findById)
//                 .patch(controller.update)
//                 .delete(controller.delete);
//         }
//     }
//     module.exports = Routes;
//             `)
//         }

//         var modelSequelize = ""
//         var modelGenerate = ""
//         var atributes = ""
//         var arrayRelations = []

//         listTables.forEach(element => {
//             var fichero = fs.readFileSync(`modules/generated-module/modelsSequelize/${element}.js`).toString()
//             var primerCorte = "/* jshint indent: 2 */" + "\n" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
//             var casicompleto = fichero.split(primerCorte)
//             var completo = casicompleto[1].split("}, {")
//         })

//         listTables.forEach(element => {

//             var fichero = fs.readFileSync(`modules/generated-module/modelsSequelize/${element}.js`).toString()
//             var primerCorte = "/* jshint indent: 2 */" + "\n" + "\n" + "module.exports = function(sequelize, DataTypes) {" + "\n" + "  return sequelize.define('" + element + "', {"
//             var casicompleto = fichero.split(primerCorte)
//             var casicasicompleto = casicompleto[1].split("}, {")
//             var completo = casicasicompleto[0].replace(/DataTypes/g, 'global.app.orm.Sequelize')

//             arrayRelations = []
//             modelSequelize = require(`../modelsSequelize/${element}`)(global.app.orm.sequelize, Sequelize)
//             modelGenerate = `'use strict';

//             var lodash = require('lodash');

//             exports.loadModel = function loadModel() {
//                 const ${element} = global.app.orm.sequelize.define('${element}',
//                     lodash.extend({}, global.app.orm.mixins.attributes, {
//                         ${completo}`

//             // atributes = modelSequelize.rawAttributes
//             // for (let i in atributes) {
//             //     if (i !== 'id' && i !== 'createdAt' && i !== 'updatedAt' && i !== 'deletedAt') {
//             //         modelGenerate = modelGenerate + `
//             //                 "${i}": {`
//             //         for (let j in atributes[i]) {
//             //             if (j !== 'Model' && j !== 'fieldName' && j !== '_modelAttribute' && j !== 'field') {
//             //                 if (j === 'type') {
//             //                     if (typeof atributes[i][j] === 'string') {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.` + atributes[i][j] + `,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.STRING) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.STRING,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.TEXT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.TEXT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.INTEGER) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.INTEGER,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.DOUBLE) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.DOUBLE,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.DATE) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.DATE,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.ENUM) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.ENUM,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.JSON) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.JSON,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.BOOLEAN) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.BOOLEAN,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.CHAR) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.CHAR,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.FLOAT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.FLOAT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.NUMBER) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.NUMBER,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.RANGE) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.RANGE,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.TIME) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.TIME,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.UUID) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.UUID,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.UUIDV1) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.UUIDV1,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.UUIDV4) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.UUIDV4,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.VIRTUAL) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.VIRTUAL,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.ABSTRACT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.ABSTRACT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.ARRAY) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.ARRAY,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.DATEONLY) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.DATEONLY,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.DECIMAL) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.DECIMAL,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.INET) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.INET,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.NOW) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.NOW,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.REAL) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.REAL,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.SMALLINT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.SMALLINT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.JSONB) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.JSONB,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.GEOMETRY) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.GEOMETRY,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.MEDIUMINT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.MEDIUMINT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.TINYINT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.TINYINT,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.BLOB) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.BLOB,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.CIDR) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.CIDR,`
//             //                     } else if (atributes[i][j] instanceof Sequelize.CITEXT) {
//             //                         modelGenerate = modelGenerate + `
//             //                         "${j}": global.app.orm.Sequelize.CITEXT,`
//             //                     }
//             //                 } else {
//             //                     if (atributes[i][j] instanceof Object) {
//             //                         var isArray = false
//             //                         modelGenerate = modelGenerate + `
//             //                        "${j}": `
//             //                         var numberForString = ""
//             //                         var firstTime = true
//             //                         for (let k in atributes[i][j]) {
//             //                             if (!isNaN(k)) {
//             //                                 isArray = true
//             //                                 numberForString = parseInt(k)
//             //                                 if (numberForString === 0) {
//             //                                     if (typeof atributes[i][j][k] === 'string') {
//             //                                         modelGenerate = modelGenerate + `["${atributes[i][j][k]}",`
//             //                                     } else {
//             //                                         modelGenerate = modelGenerate + `[${atributes[i][j][k]},`
//             //                                     }
//             //                                 } else if (numberForString > 0 && k < atributes[i][j].length - 1) {
//             //                                     if (typeof atributes[i][j][k] === 'string') {
//             //                                         modelGenerate = modelGenerate + `"${atributes[i][j][k]}",`
//             //                                     } else {
//             //                                         modelGenerate = modelGenerate + `${atributes[i][j][k]},`
//             //                                     }
//             //                                 } else if (numberForString === atributes[i][j].length - 1) {
//             //                                     if (typeof atributes[i][j][k] === 'string') {
//             //                                         modelGenerate = modelGenerate + `"${atributes[i][j][k]}"],`
//             //                                     } else {
//             //                                         modelGenerate = modelGenerate + `${atributes[i][j][k]}],`
//             //                                     }
//             //                                 }
//             //                             } else {
//             //                                 if (firstTime) {
//             //                                     if (j === 'references' && k === 'model') {
//             //                                         arrayRelations.push(atributes[i][j][k])
//             //                                     }
//             //                                     if (typeof atributes[i][j][k] === 'string') {
//             //                                         firstTime = false
//             //                                         modelGenerate = modelGenerate + `{
//             //                                         "${k}":"${atributes[i][j][k]}",`
//             //                                     } else {
//             //                                         firstTime = false
//             //                                         modelGenerate = modelGenerate + `{
//             //                                         "${k}":${atributes[i][j][k]},`
//             //                                     }
//             //                                 } else {
//             //                                     if (typeof atributes[i][j][k] === 'string') {
//             //                                         modelGenerate = modelGenerate + `
//             //                                         "${k}":"${atributes[i][j][k]}",`
//             //                                     } else {
//             //                                         modelGenerate = modelGenerate + `
//             //                                         "${k}":${atributes[i][j][k]},`
//             //                                     }
//             //                                 }
//             //                             }
//             //                         }
//             //                         if (!isArray) {
//             //                             modelGenerate = modelGenerate + `
//             //                         },`
//             //                         }
//             //                     } else {
//             //                         if (typeof atributes[i][j] === 'string') {
//             //                             modelGenerate = modelGenerate + `
//             //                        "${j}": "${atributes[i][j]}",`
//             //                         } else {
//             //                             modelGenerate = modelGenerate + `
//             //                        "${j}": ${atributes[i][j]},`
//             //                         }
//             //                     }
//             //                 }
//             //             }
//             //         }
//             //         modelGenerate = modelGenerate + `},`
//             //     }
//             // }
//             //AQUI PONGO EL TIMESTAMP EN FALSE PQ LA BD CON LA Q ESTOY TRABAJANDO NO TIENE LOS CAMPOS NECESARIOS PA TRABAJAR CON ESTO
//             modelGenerate = modelGenerate + `
//         }), {
//             timestamps: ${istimestamp},
//             comment: 'A example model.',
//             freezeTableName: true,
//             tableName: '${element}',
//             hooks: {}
//         });
//         ${element}.associate = function() {
//             var models = global.app.orm.sequelize.models;`
//             listTables.forEach(element2 => {
//                     if (completo.indexOf(element2) !== -1) {
//                         if (element2 !== element) {
//                             modelGenerate = modelGenerate + `
//                     models.${element}.belongsTo(models.${element2});`
//                         }
//                     }
//                 })
//                 // for (let i = 0; i < arrayRelations.length; i++) {
//                 //     modelGenerate = modelGenerate + `
//                 //         models.${element}.belongsTo(models.${arrayRelations[i]});`
//                 // }
//             modelGenerate = modelGenerate + `
//                     }
//                 };`
//             fs.writeFileSync(`modules/new-generated-module/models/${element}.js`, modelGenerate);
//         })

//         res.status(200).json({ message: "Todo creado correctamente" });
//     }
// }

// module.exports = Controller

//ESTA ERA LA FORMA VIEJA DE RELACIONAR LAS TABLAS
// var fichero = fs.readFileSync(`modules/generated-module/modelsSequelize/${element2}.js`).toString()
// if (completo.indexOf(`model: '${element2}'`) !== -1) {
//     if (element2 !== element) {
//         modelGenerate = modelGenerate + `
//     models.${element}.belongsTo(models.${element2}, { foreignKey: 'TiendaId' });`
//     }
// }
// if (fichero.indexOf(`model: '${element}'`) !== -1) {
//     if (element2 !== element) {
//         modelGenerate = modelGenerate + `
//     models.${element}.hasMany(models.${element2});`
//     }
// }

// where: {
//     'people.aiss.countrydatalocalities.id': global.app.orm.sequelize.where(global.app.orm.sequelize.fn(
//         'LOWER', global.app.orm.sequelize.col(
//             'people.aiss.countrydatalocalities.id'
//         )
//     ), 'LIKE', '%1%')
// },
// where: {
//     '$people.aiss.countrydatalocalities.id$': 1
// },
//where: { '$people.aiss.countrydatalocalities.id$': 2 },
//where: { include: [{ association: 'people', include: [{ association: 'aiss', include: [{ association: 'countrydatalocalities', where: { id: 1 } }] }] }] }, //attrlocales,
// include: [{
//     // all: true,
//     // nested: true
//     model: global.app.orm.sequelize.models.ais,
//     as: 'aiss',
//     required: false,
//     where: {
//         "id": "4"
//     }

// include: [{
//     model: global.app.orm.sequelize.models.agencyreservation,
//     as: 'agencyreservations',
//     required: true,
//     subQuery: false,
//     where: {
//         fkId: '7'
//     }

// right: true,
// include: [{
//         model: global.app.orm.sequelize.models.postaladdresses,
//         as: 'postaladdresses',
//         required: true,
//         subQuery: false,
//         where: {
//             postalCode: 'Amargur'
//         },

//         // right: true,

//         // where: {
//         //     "$countrydatalocalities$": {
//         //         name: "Alonso de Rojas"
//         //     }
//         // },
//         include: [{
//             model: global.app.orm.sequelize.models.countrydatalocalities,
//             as: 'countrydatalocalities',
//             // rigth: true,
//             required: true,
//             subQuery: false,


//             where: {
//                 name: 'Barrios del casco histórico'
//             }

//         }]
//     }]
// where: {
//     '$aiss.id$': 1
// },
// include: [{
//     association: 'aiss',
//     required: true,
//     where: {
//         '$countrydatalocalities.id$': 3
//     },
//     include: [{
//         association: 'countrydatalocalities',
//         required: true,
//         where: {
//             id: 3
//         }
//     }]
// }]
//}], //relations,
//attributes: atributos,


//ESTO ES UN EJEMPLO DEL PASO 2 PARA POBLAR LA BD CUANDO ESTOY GENERANDO EL PROYECTO CON PERMISOS Y ACCIONES
// if(element==='debt' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6})
// } else if(element==='shows' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6})
// } else if(element==='location' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6})
// } else if(element==='artist' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 6})
// } else if(element==='discount' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
// } else if(element==='discount' && element2.method==='GET'){
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 1, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 5})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 4, "canAll": "no"})
//     bulkCreateRole.push({"serverFuncionId": element2.id, "roleId": 3})
// }