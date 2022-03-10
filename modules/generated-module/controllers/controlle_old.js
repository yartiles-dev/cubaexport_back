const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const fs = require('fs');

const controller = class Controller {
    jsonAPI = global.app.utils.RestJson;
    constructor(model) {
        this.model = model;
    }

    findById = async(req, res, next) => {
        var nameFolderModule = global.app.config.get('nameFolderModule')

        var errorQuery = this.jsonAPI.processErrorsQuerySingleCollection(req, nameFolderModule, this.model.tableName)
        if (errorQuery !== "") {
            var error = new Error(errorQuery);
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        var JsonApi = this.jsonAPI.buildQueryFromReqSingleCollection(req, nameFolderModule, this.model.tableName);
        if(JsonApi === "Forbidden"){
            return res.status(403).json({
                errors: [{
                  field: "Permission",
                  title: "Forbidden"
                }]
              })
        }
        var jsonAPIBody = {
            data: {}
        };

        this.model
            .findByPk(req.params.Id, JsonApi.query)
            .then(model => {
                if (!model) {
                    var error = new Error(
                        `No se encuentra el ${this.model.name} especificado`
                    );
                    return res.status(404)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));; // Not Found.
                } else if(req.canAll === "no" && model.personId !== req.loggedUser.id){
                    return res.status(403).json({
                        errors: [{
                          field: "Permission",
                          title: "Forbidden"
                        }]
                      })
                }

                jsonAPIBody.data = model
                res.status(200).json(jsonAPIBody);
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
    };

    findByParameters = (req, res, next) => {
        var nameFolderModule = global.app.config.get('nameFolderModule')

        var errorQuery = this.jsonAPI.processErrorsQuery(req, nameFolderModule, this.model.tableName)
        if (errorQuery !== "") {
            var error = new Error(errorQuery);
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        var find = this.jsonAPI.proccessOneRequestOrTwoRequest(req, nameFolderModule, this.model.tableName)
        // console.log(find)
        if (find) {
            var JsonApi = this.jsonAPI.buildQueryFromReqFirstRequest(req, nameFolderModule, this.model.tableName);
            if(JsonApi === "Forbidden"){
                return res.status(403).json({
                    errors: [{
                      field: "Permission",
                      title: "Forbidden"
                    }]
                  })
            }
            if(req.canAll === "no"){
                JsonApi.query.where.personId = req.loggedUser.id
            }
            this.model.findAndCountAll(JsonApi.query).then(models => {
                    var JsonApiSecond = this.jsonAPI.buildQueryFromReqSecondRequest(req, nameFolderModule, this.model.tableName, models.rows);
                    var jsonAPIBody = {
                        data: [],
                        _meta: {}
                    };
                    this.model
                        .findAll(JsonApiSecond.query)
                        .then(model => {
                            var modelsResult = []
                            models.rows.forEach(element => {
                                model.forEach(element2 => {
                                    if (element.id === element2.id) {
                                        modelsResult.push(element2)
                                    }
                                })
                            });
                            jsonAPIBody.data = modelsResult
                            jsonAPIBody._meta = {
                                totalCount: models.count,
                                totalCountPage: models.rows.length,
                                pageCount: Math.ceil(models.count / JsonApi.response.perPage),
                                currentPage: JsonApi.response.currentPage,
                                perPage: JsonApi.response.perPage
                            }
                            res.status(200).json(jsonAPIBody);
                        })
                        .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(400)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        })
                        .catch(function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(500)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        } else {
            var JsonApi = this.jsonAPI.buildQueryFromReq(req, nameFolderModule, this.model.tableName);
            if(JsonApi === "Forbidden"){
                return res.status(403).json({
                    errors: [{
                      field: "Permission",
                      title: "Forbidden"
                    }]
                  })
            }
            if(req.canAll === "no"){
                JsonApi.query.where.personId = req.loggedUser.id
            }
            var jsonAPIBody = {
                data: [],
                _meta: {}
            };

            this.model
                .findAndCountAll(JsonApi.query)
                .then(model => {
                    jsonAPIBody.data = model.rows
                    jsonAPIBody._meta = {
                        totalCount: model.count,
                        totalCountPage: model.rows.length,
                        pageCount: Math.ceil(model.count / JsonApi.response.perPage),
                        currentPage: JsonApi.response.currentPage,
                        perPage: JsonApi.response.perPage
                    }
                    res.status(200).json(jsonAPIBody);
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        }
    };

    delete = (req, res, next) => {
        this.model
            .findByPk(req.params.Id)
            .then(model => {
                if (!model) {
                    const error = new Error(
                        `No se encuentra el ${this.model.name} especificado para eliminar`
                    );
                    error.statusCode = 404;
                    throw error;
                } else if(req.canAll === "no" && model.personId !== req.loggedUser.id){
                    return res.status(403).json({
                        errors: [{
                          field: "Permission",
                          title: "Forbidden"
                        }]
                      })
                }
                model
                    .destroy()
                    .then(() => {
                        res.status(200).json({ data: model });
                    })
                    .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(400)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    })
                    .catch(function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(500)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    });
            })
            .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            })
            .catch(function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(500)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            });
    };

    delete_multiple = (req, res, next) => {
        var errorResult = ""
        var error = []
        if (!(req.body instanceof Object)) {
            error.push(`La peticion debe ser un objeto con los campos solicitados`)
        } else if (req.body instanceof Array) {
            error.push(`La peticion debe ser un objeto con los campos solicitados no un array`)
        }

        if(req.body.hasOwnProperty('ids') && req.body.hasOwnProperty('where')){
            error.push(`La peticion se puede efectuar con una lista de los ids a eliminar o bajo una condicion especifica`)
        } else if(!req.body.hasOwnProperty('ids') && !req.body.hasOwnProperty('where')) {
            error.push(`La peticion debe contener al menos el parametro where o el ids para efectuarse`)
        } else {
            for (let i in req.body) {
                if (i !== 'where' && i !== 'ids') {
                    error.push(`El parametro ${i} no es valido para efectuar la peticion`)
                } else if(i === 'ids'){
                    if(!(req.body[i] instanceof Array)){
                        error.push(`El parametro ${i} debe ser un array de los id a eliminar`)
                    } else {
                        var find = false
                        for(let j = 0; j < req.body[i].length && !find; j++){
                            if(typeof req.body[i][j] !== "number"){
                               find = true 
                            }
                        }
                        if(find){
                            error.push(`Cada elemento del parametro ${i} debe ser de tipo int`)
                        }
                    }
                } else if(i === 'where'){
                    if (!(req.body[i] instanceof Object)) {
                        error.push(`El parametro ${i} debe ser un objeto con los campos solicitados para filtrar`)
                    } else if (req.body[i] instanceof Array) {
                        error.push(`El parametro ${i} debe ser un objeto con los campos solicitados para filtrar no un array`)
                    } else {
                        var find = false
                        for(let j in req.body[i]){
                            if(req.body[i][j] instanceof Object){
                                find = true
                            }
                        }
                        if(find){
                            error.push(`Los campos solicitados para filtrar no pueden ser ni objetos ni arrays`)
                        }
                    }
                }
            }
        }

        if (error.length === 0) {
            errorResult = ""
        } else {
            for (let i = 0; i < error.length; i++) {
                errorResult = errorResult + error[i]
                if (i + 1 < error.length) {
                    errorResult = errorResult + "  &&  "
                }
            }
        }

        if(errorResult !== ""){
            var error = new Error(errorResult);
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        var where = "";
        if (req.body.ids) {
            where = {
                id: {
                    [Op.in]: req.body.ids
                }
            };
        } else if (req.body.where) {
            where = req.body.where;
        }

        if(req.canAll === "no"){
            where.personId = req.loggedUser.id
        }
        this.model
            .findAll({
                where: where
            })
            .then(models => {
                if (models.length >= 1) {
                    this.model
                        .destroy({
                            where: where
                        })
                        .then(() => {
                            res.status(200).json({ data: models });
                        })
                        .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(400)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        })
                        .catch(function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(500)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        });
                } else {
                    res.status(200).json({ data: models });
                }
            })
            .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            })
            .catch(function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(500)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            });
    };

    update = (req, res, next) => {
        var errorResult = ""
        var error = []
        if(req.body instanceof Array){
            error.push(`El body debe ser un objeto para actualizar`)
        } else {
            var find = false
            for(let i in req.body){
                if(req.body[i] instanceof Object){
                    find = true
                }
            }
            if(find){
                error.push(`Cada elemento del objeto a actualizar debe ser de tipo string, int, date, etc. no objeto ni array`)
            }
        }

        if (error.length === 0) {
            errorResult = ""
        } else {
            for (let i = 0; i < error.length; i++) {
                errorResult = errorResult + error[i]
                if (i + 1 < error.length) {
                    errorResult = errorResult + "  &&  "
                }
            }
        }

        if(errorResult !== ""){
            var error = new Error(errorResult);
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        var where = { id: req.params.Id }
        if(req.canAll === "no"){
            where.personId = req.loggedUser.id
        }

        this.model
            .update(req.body, {
                where: where
            })
            .then(() => {
                this.model
                    .findOne(where)
                    .then(model => {
                        if (!model) {
                            const error = new Error(
                                `No se encuentra el ${this.model.name} especificado para modificar o usted no posee los permisos necesarios`
                            );
                            error.statusCode = 404;
                            throw error;
                        }
                        res.status(200).json({ data: model });
                    })
                    .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(400)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    })
                    .catch(function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(500)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    });
            })
            .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            })
            .catch(function(error) {
                global.app.utils.logger.error(error, {
                    module: `/index`,
                    submodule: 'routes',
                    stack: error.stack
                });
                return res.status(500)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            });
    };

    //Lo hago asi para no actualizar los ids pero se puede hacer simplemente actualizando los ids si al final van a ser igual
    update_multiple = async(req, res, next) => {
        var errorResult = ""
        var error = [] 

        if(req.body instanceof Array){
            error.push(`El body de la peticion tiene que ser un objeto`)
        } else if(req.body instanceof Object){
            if(!req.body.hasOwnProperty('objs') && !req.body.hasOwnProperty('obj') && !req.body.hasOwnProperty('ids') && !req.body.hasOwnProperty('where') && !req.body.hasOwnProperty('nested')) {
                error.push(`La peticion debe contener al menos el parametro objs, obj, ids, where o el nested para efectuarse`)
            } else {
                var find = false
                for(let i in req.body){
                   if(i !== 'objs' && i !== 'obj' && i !== 'ids' && i !== 'where' && i !== 'nested'){
                    find = true
                    error.push(`El parametro ${i} no es valido para efectuar la peticion`)
                   }
                }
                if(!find){
                   if(req.body.hasOwnProperty('objs') && (req.body.hasOwnProperty('obj') || req.body.hasOwnProperty('ids') || req.body.hasOwnProperty('where') || req.body.hasOwnProperty('nested'))){
                       error.push(`La peticion si posee el parametro objs no puede tener otro parametro`)
                   } else if(req.body.hasOwnProperty('obj') && req.body.hasOwnProperty('ids') && (req.body.hasOwnProperty('objs') || req.body.hasOwnProperty('where') || req.body.hasOwnProperty('nested'))) {
                       error.push(`La peticion si posee el parametro obj y ids no puede tener otro parametro`)
                   } else if(req.body.hasOwnProperty('obj') && req.body.hasOwnProperty('where') && (req.body.hasOwnProperty('objs') || req.body.hasOwnProperty('ids') || req.body.hasOwnProperty('nested'))) {
                       error.push(`La peticion si posee el parametro obj y where no puede tener otro parametro`)
                   } else if(req.body.hasOwnProperty('obj') && req.body.hasOwnProperty('nested') && (req.body.hasOwnProperty('objs') || req.body.hasOwnProperty('ids') || req.body.hasOwnProperty('where'))) {
                       error.push(`La peticion si posee el parametro obj y nested no puede tener otro parametro`)
                   }
                }
            }
        }

        if (error.length === 0) {
            errorResult = ""
        } else {
            for (let i = 0; i < error.length; i++) {
                errorResult = errorResult + error[i]
                if (i + 1 < error.length) {
                    errorResult = errorResult + "  &&  "
                }
            }
        }

        if(errorResult !== ""){
            var error = new Error(errorResult);
            return res.status(400)
                .json(jsonAPI.processErrors(error, req, { file: __filename }));
        }

        const objs = req.body.objs;
        const ids = [];
        var id = "";
        var key = "";
        var result = null;
        var atributos_nested = "";
        if (objs) {
            var errorResult = ""
            var error = []
            var find = false
            var find2 = false
            objs.forEach(element=>{
                if(!element.hasOwnProperty('id')){
                    find = true
                }
                for(let i in element){
                    if(element[i] instanceof Object){
                        find2 = true
                    }
                }
            })
            if(find){
                error.push(`Cada elemento del objeto a actualizar debe contener el id del objeto a actualizar con las demas propiedades a actualizar`)
            }
            if(find2){
                error.push(`Cada elemento del objeto a actualizar debe ser de tipo string, int, date, etc. no objeto ni array`)
            }

            if (error.length === 0) {
                errorResult = ""
            } else {
                for (let i = 0; i < error.length; i++) {
                    errorResult = errorResult + error[i]
                    if (i + 1 < error.length) {
                        errorResult = errorResult + "  &&  "
                    }
                }
            }
    
            if(errorResult !== ""){
                var error = new Error(errorResult);
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            }

            for (let i = 0; i < objs.length; i++) {
                id = objs[i].id;
                ids.push(id);
                key = "id";
                delete objs[i][key];
                var where = { id: id }
                if(req.canAll === "no"){
                    where.personId = req.loggedUser.id
                }
                result = await this.model
                    .update(objs[i], { where: where })
                    .then()
                    .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(400)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    })
                    .catch(function(error) {
                        global.app.utils.logger.error(error, {
                            module: `/index`,
                            submodule: 'routes',
                            stack: error.stack
                        });
                        return res.status(500)
                            .json(jsonAPI.processErrors(error, req, { file: __filename }));
                    });
            }
            var where = { id: {[Op.in]: ids} }
            if(req.canAll === "no"){
               where.personId = req.loggedUser.id
            }
            this.model
                .findAll({
                    where: where
                })
                .then(models => {
                    res.status(200).json({ data: models });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        } else if (req.body.ids && req.body.obj) {
            var errorResult = ""
            var error = []

            if(!req.body.ids instanceof Array){
                error.push(`El parametro ids debe ser un arreglo de los id de las tuplas q a modificar`)
            } else {
                var find = false
                for (let i = 0; i < req.body.ids.length && !find; i++) {
                    if(typeof req.body.ids[i] !== "number"){
                        find = true
                    }
                }
                if(find){
                    error.push(`Cada id del array de ids debe ser de tipo entero`)
                }
            }

            if(!req.body.obj instanceof Object){
                error.push(`El parametro obj debe ser un objeto`)
            } else if(req.body.obj instanceof Array) {
                error.push(`El parametro obj debe ser un objeto no un array`)
            } else {
                var find = false
                for(let i in req.body.obj){
                    if(req.body.obj[i] instanceof Object){
                        find = true
                    }
                }
                if(find){
                    error.push(`Cada parametro del objeto obj debe ser string, int, date, etc. no objeto ni array`)
                }
            }

            if (error.length === 0) {
                errorResult = ""
            } else {
                for (let i = 0; i < error.length; i++) {
                    errorResult = errorResult + error[i]
                    if (i + 1 < error.length) {
                        errorResult = errorResult + "  &&  "
                    }
                }
            }
    
            if(errorResult !== ""){
                var error = new Error(errorResult);
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            }

            var where = {
                id: {
                    [Op.in]: req.body.ids
                }
            }
            if(req.canAll === "no"){
               where.personId = req.loggedUser.id
            }
            this.model
                .update(req.body.obj, {
                    where: where
                })
                .then(() => {
                    this.model
                        .findAll({
                            where: where
                        })
                        .then(models => {
                            res.status(200).json({ data: models });
                        })
                        .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(400)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        })
                        .catch(function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(500)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        } else if (req.body.where && req.body.obj) {
            var errorResult = ""
            var error = []

            if(!req.body.obj instanceof Object){
                error.push(`El parametro obj debe ser un objeto`)
            } else if(req.body.obj instanceof Array) {
                error.push(`El parametro obj debe ser un objeto no un array`)
            } else {
                var find = false
                for(let i in req.body.obj){
                    if(req.body.obj[i] instanceof Object){
                        find = true
                    }
                }
                if(find){
                    error.push(`Cada parametro del objeto obj debe ser string, int, date, etc. no objeto ni array`)
                }
            }

            if(!req.body.where instanceof Object){
                error.push(`El parametro where debe ser un objeto`)
            } else if(req.body.obj instanceof Array) {
                error.push(`El parametro where debe ser un objeto no un array`)
            } else {
                var find = false
                for(let i in req.body.where){
                    if(req.body.where[i] instanceof Object){
                        find = true
                    }
                }
                if(find){
                    error.push(`Cada parametro del objeto where debe ser string, int, date, etc. no objeto ni array`)
                }
            }

            if (error.length === 0) {
                errorResult = ""
            } else {
                for (let i = 0; i < error.length; i++) {
                    errorResult = errorResult + error[i]
                    if (i + 1 < error.length) {
                        errorResult = errorResult + "  &&  "
                    }
                }
            }
    
            if(errorResult !== ""){
                var error = new Error(errorResult);
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            }

            var where = req.body.where
            if(req.canAll === "no"){
               where.personId = req.loggedUser.id
            }
            this.model
                .update(req.body.obj, {
                    where: where
                })
                .then(() => {
                    var where2 = req.body.obj
                    if(req.canAll === "no"){
                        where2.personId = req.loggedUser.id
                    }
                    this.model
                        .findAll({
                            where: where2
                        })
                        .then(models => {
                            res.status(200).json({ data: models });
                        })
                        .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(400)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        })
                        .catch(function(error) {
                            global.app.utils.logger.error(error, {
                                module: `/index`,
                                submodule: 'routes',
                                stack: error.stack
                            });
                            return res.status(500)
                                .json(jsonAPI.processErrors(error, req, { file: __filename }));
                        });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        } else if (req.body.nested && req.body.obj) {
            var nested_relation = req.body.nested.nested_relation;
            var nested_where = req.body.nested.nested_where;
            var response = [];
            if (nested_relation.length >= 1) {
                for (let i = 0; i < nested_relation.length; i++) {
                    var obj = nested_relation[i];
                    if (obj.indexOf(".") !== -1) {
                        var array = obj.split(".");
                        var relation = "";
                        for (let j = array.length - 1; j >= 0; j--) {
                            if (j === array.length - 1) {
                                relation = {
                                    association: array[j],
                                    required: true,
                                    where: nested_where
                                };
                            } else {
                                relation = {
                                    association: array[j],
                                    required: true,
                                    include: [relation]
                                };
                            }
                        }
                    } else {
                        relation = { association: obj, where: nested_where };
                    }
                }
                atributos_nested = relation;
                this.model
                    .findAll({ include: [atributos_nested] })
                    .then(async models => {
                        var actualizacion = null;
                        for (let i = 0; i < models.length; i++) {
                            actualizacion = await this.model
                                .update(req.body.obj, { where: { id: models[i].id } })
                                .then(() => {
                                    this.model
                                        .findAll({ where: { id: models[i].id } })
                                        .then(model => {
                                            response.push(model[0]);
                                            if (i === models.length - 1)
                                                res.status(200).json({ data: response });
                                        })
                                        .catch(err => {
                                            if (!err.statusCode) {
                                                err.statusCode = 500;
                                            }
                                            next(err);
                                        });
                                })
                                .catch(err => {
                                    if (!err.statusCode) {
                                        err.statusCode = 500;
                                    }
                                    next(err);
                                });
                        }
                    })
                    .catch(err => {
                        if (!err.statusCode) {
                            err.statusCode = 500;
                        }
                        next(err);
                    });
            }
        }
    };

    //Este create tiene incluido tanto uno como varios
    create = (req, res, next) => {
        var errorResult = ""
        var error = []
        if (req.body instanceof Array) {

            var find = false
            for(let i = 0; i < req.body.length && !find; i++){
                if( !(req.body[i] instanceof Object)){
                    find = true
                    error.push(`Cada elemento del arreglo debe ser un objeto a crear del modelo en cuestion`)
                } else if(req.body[i] instanceof Array) {
                    find = true
                    error.push(`Cada elemento del arreglo debe ser un objeto a crear del modelo en cuestion no un array`)
                } else {
                    for(let j in req.body[i]){
                        if(req.body[i][j] instanceof Object){
                            find = true
                            error.push(`Todos los parametros de cada objeto a crear deben ser string, int, date, etc. menos object ni array`)
                        }
                    }
                }
            }

            var find = false
            req.body.forEach(element=>{
                if(element.hasOwnProperty('personId') && req.canAll === "no"){
                    var intPersonId = new Number(element.personId)
                   if(intPersonId !== req.loggedUser.id){
                       error.push(`Usted no tiene acceso a todos los elementos solicitados`)
                   }
               }
            })

            if (error.length === 0) {
                errorResult = ""
            } else {
                for (let i = 0; i < error.length; i++) {
                    errorResult = errorResult + error[i]
                    if (i + 1 < error.length) {
                        errorResult = errorResult + "  &&  "
                    }
                }
            }
    
            if(errorResult !== ""){
                var error = new Error(errorResult);
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            }
            if(req.canAll === "no"){
                req.body.forEach(element=> {
                    element.personId = req.loggedUser.id
                })
            }
            this.model
                .bulkCreate(req.body)
                .then(m => {
                    res.status(201).json({ data: m });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        } else if (req.body instanceof Object) {
            var find = false
            for(let i in req.body){
                if(req.body[i] instanceof Object){
                    find = true
                }
            }
            if(find){
                error.push(`Todos los parametros del objeto a crear deben ser string, int, date, etc. menos object ni array`)
            }

            if(req.body.hasOwnProperty('personId') && req.canAll === "no"){
                var intPersonId = new Number(req.body.personId)
               if(intPersonId !== req.loggedUser.id){
                   error.push(`Usted solo puede realizar solicitudes propias`)
               }
           }

            if (error.length === 0) {
                errorResult = ""
            } else {
                for (let i = 0; i < error.length; i++) {
                    errorResult = errorResult + error[i]
                    if (i + 1 < error.length) {
                        errorResult = errorResult + "  &&  "
                    }
                }
            }
    
            if(errorResult !== ""){
                var error = new Error(errorResult);
                return res.status(400)
                    .json(jsonAPI.processErrors(error, req, { file: __filename }));
            }

            if(req.canAll === "no"){
                req.body.personId = req.loggedUser.id
            }
            this.model
                .create(req.body)
                .then(model => {
                    res.status(201).json({ data: model });
                })
                .catch(global.app.orm.Sequelize.ValidationError, function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(400)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                })
                .catch(function(error) {
                    global.app.utils.logger.error(error, {
                        module: `/index`,
                        submodule: 'routes',
                        stack: error.stack
                    });
                    return res.status(500)
                        .json(jsonAPI.processErrors(error, req, { file: __filename }));
                });
        }
    };
};
module.exports = controller;