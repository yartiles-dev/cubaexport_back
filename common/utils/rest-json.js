const Sequelize = require("sequelize");
const Op = Sequelize.Op;

function devNotification(data) {
    if (data.noMail) {
        return 0;
    }
    //return 0;
    if (!global.app.config.get("developers:sendNotifications")) {
        // inactive dev notification
        return;
    }
    if (typeof data != 'object' || data.subject == undefined) {
        data = {
            subject: 'Dev Notification',
            text: data
        }
    }
    if (typeof data.text == 'object') {

        data.text = JSON.stringify(data);
    }
    var mailerConfig = global.app.config.get('mailer');
    if (mailerConfig == undefined ||
        global.app.utils.mailer == undefined ||
        typeof global.app.utils.mailer.sendMail !== 'function') {
        return;
    }

    var mail = {
        from: mailerConfig.from,
        bcc: global.app.config.get("developers:mails"),
        subject: data.subject,
        text: data.text,
        html: data.text
    };
    global.app.utils.mailer.sendMail(mail,
        function (err, info) {
            if (err) {
                global.app.utils.logger.error('Dev mailer', {messages: err.message});
            } else {
                global.app.utils.logger.info('Dev mailer', {messages: info.response});
                global.app.utils.mailer.close();
            }
        }
    );
}

function processErrors(error, req, extra) {
    console.log('Entrando a la gestion de los errores');
    var language = 'en';
    if (req == undefined) {
        req = {};
    } else {
        language = req.header('language');
    }
    console.log('en el header viene', language);
    language = language || 'en';
    console.log(language);
    // TODO: Refactor this function to be simpler.
    var jsonAPIErrors = {
        errors: []
    };
    var errorsToTranslate = [];

    if (error.errors && error.errors.length) {
        lodash.forEach(error.errors, function (item) {
            var newError = {};
            if (error.name || error.code) {
                newError.code = error.name || error.code;
            }
            if (item.message || item.title) {
                newError.title = item.message || item.title;
            }
            if (item.path || item.field) {
                newError.field = item.path || item.field;
            }
            if (item.status) {
                newError.status = item.status;
            }
            errorsToTranslate.push(newError);
        });
    } else {
        var newError = {};
        if (error.name) {
            newError.code = error.name;
        }
        if (error.message || error.title) {
            newError.title = error.message || error.title;
        }
        if (error.path || error.field) {
            newError.field = error.path || error.field;
        }
        if (error.status) {
            newError.status = error.status;
        }
        errorsToTranslate.push(newError);
    }
    if (!language) {
        language = 'en';
    }

    if (!language || !lang[language]) {
        devNotification({language1: language});
        jsonAPIErrors.errors = errorsToTranslate;
    } else {
        errorsToTranslate.forEach(function (err) {
            var tempLanguage = lang[language];
            if (tempLanguage["fields"][err.field]) {
                err.field = tempLanguage["fields"][err.field];
            } else {
                devNotification({
                    user: req.user,
                    extra: extra,
                    language2: language,
                    field: err.field,
                    err: error.stack
                });
            }
            if (tempLanguage['messages'][err.title]) {
                err.title = tempLanguage["messages"][err.title];
            } else {
                devNotification({
                    user: req.user,
                    extra: extra,
                    language3: language,
                    title: err.title,
                    err: error.stack
                });
            }
            jsonAPIErrors.errors.push(err);
        });
    }

    return jsonAPIErrors;
}

function processErrorsQuerySingleCollection(req, nameFolderModule, tableName) {
    var error = []
    var errorResult = ""

    if (!(req.body instanceof Object)) {
        error.push(`La peticion debe ser un objeto con los campos solicitados`)
    } else if (req.body instanceof Array) {
        error.push(`La peticion debe ser un objeto con los campos solicitados no un array`)
    }

    for (let i in req.body) {
        if (i !== 'relations' && i !== 'attributos') {
            error.push(`El parametro ${i} no es valido para efectuar la peticion`)
        }
    }

    if (req.body.hasOwnProperty('relations')) {
        var relations = req.body.relations
        if (relations !== "all" && !(relations instanceof Array)) {
            error.push(`El parametro relations debe ser un arreglo de relaciones o simplemente la palabra all`)
        } else if (relations instanceof Array) {
            relations.forEach(element => {
                var tableNameCopy = tableName
                if (typeof element !== 'string') {
                    error.push(`Cada elemento del arreglo debe ser un string especificando un nombre de una relacion`)
                } else {
                    var arrayRelation = element.split(".")
                    var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                    findAuxiliar = true
                    for (let i = 0; i < arrayRelation.length && findAuxiliar; i++) {
                        var find = false
                        var positionModel = null
                        for (let j = 0; j < ArrayRelationsModel.length && !find; j++) {
                            if (ArrayRelationsModel[j].nameRelation === arrayRelation[i]) {
                                find = true
                                positionModel = j
                            }
                        }
                        if (find) {
                            tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                            ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                        } else {
                            findAuxiliar = false
                            error.push(`La relacion ${arrayRelation[i]} no existe el modelo ${tableNameCopy}`)
                        }
                    }
                }
            })
        }
    }

    if (req.body.hasOwnProperty('attributos')) {
        var attributos = req.body.attributos
        if (!(attributos instanceof Object)) {
            error.push(`El parametro attributos debe ser un objeto`)
        } else if (attributos instanceof Array) {
            error.push(`El parametro attributos debe ser un objeto no un arreglo`)
        } else {
            for (let i in attributos) {
                if (!(attributos[i] instanceof Array)) {
                    error.push(`El parametro ${i} debe ser un arreglo de los atributos a mostrar de el modelo en cuestion o de alguna de sus relaciones`)
                } else {

                    if (!req.body.hasOwnProperty('relations')) {
                        if (i !== 'LocalsAttributes') {
                            error.push(`Debe establecer primero la relacion ${i} del parametro attributos en el parametro relations`)
                        }
                    } else if (req.body.hasOwnProperty('relations')) {
                        if (req.body.relations === "all") {
                            if (i.indexOf(".") !== -1) {
                                error.push(`No se puede procesar la relacion ${i} del parametro attributos porque la consulta devuelve nada mas las relaciones directas del modelo solicitado`)
                            }
                        } else if (req.body.relations instanceof Array) {
                            if (i !== 'LocalsAttributes') {
                                var todobien = true
                                var find = false
                                var arrayAttributos = i.split(".")
                                for (let j = 0; j < relations.length && !find; j++) {
                                    var arrayRelations = relations[j].split(".")
                                    todobien = true
                                    for (let k = 0; k < arrayAttributos.length && todobien; k++) {
                                        if (k < arrayRelations.length) {
                                            if (arrayAttributos[k] !== arrayRelations[k]) {
                                                todobien = false
                                            }
                                        } else if (k < arrayAttributos.length) {
                                            todobien = false
                                        }
                                    }
                                    if (todobien) {
                                        find = true
                                    }
                                }
                                if (!todobien) {
                                    error.push(`Debe establecer primero la relacion ${i} del parametro attributos en el parametro relations`)
                                }
                            }
                        }
                    }

                    attributos[i].forEach(element => {
                        if (typeof element !== 'string') {
                            error.push(`Todos los elementos del arreglo ${i} deben ser de tipo string especificando el nombre de los atributos`)
                        }
                    })
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
    return errorResult
}

function processErrorsQuery(req, nameFolderModule, tableName) {
    var error = []
    var errorResult = ""

    if (!(req.body instanceof Object)) {
        error.push(`La peticion debe ser un objeto con los campos solicitados`)
    } else if (req.body instanceof Array) {
        error.push(`La peticion debe ser un objeto con los campos solicitados no un array`)
    }

    for (let i in req.body) {
        if (i !== 'relations' && i !== 'pagination' && i !== 'currentPage' && i !== 'attributos' && i !== 'attr' && i !== 'orderBy' && i !== 'oper') {
            error.push(`El parametro ${i} no es valido para efectuar la peticion`)
        }
    }

    if (req.body.hasOwnProperty('relations')) {
        var relations = req.body.relations
        if (relations !== "all" && !(relations instanceof Array)) {
            error.push(`El parametro relations debe ser un arreglo de relaciones o simplemente la palabra all`)
        } else if (relations instanceof Array) {
            relations.forEach(element => {
                var tableNameCopy = tableName
                if (typeof element !== 'string') {
                    error.push(`Cada elemento del arreglo debe ser un string especificando un nombre de una relacion`)
                } else {
                    var arrayRelation = element.split(".")
                    var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                    findAuxiliar = true
                    for (let i = 0; i < arrayRelation.length && findAuxiliar; i++) {
                        var find = false
                        var positionModel = null
                        for (let j = 0; j < ArrayRelationsModel.length && !find; j++) {
                            if (ArrayRelationsModel[j].nameRelation === arrayRelation[i]) {
                                find = true
                                positionModel = j
                            }
                        }
                        if (find) {
                            tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                            ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                        } else {
                            findAuxiliar = false
                            error.push(`La relacion ${arrayRelation[i]} no existe el modelo ${tableNameCopy}`)
                        }
                    }
                }
            })
        }
    }
    if (req.body.hasOwnProperty('pagination')) {
        var pagination = req.body.pagination
        if (typeof pagination !== 'number' && pagination !== 'all') {
            error.push(`El parametro pagination debe ser un numero entero o all`)
        }
    }

    if (req.body.hasOwnProperty('currentPage')) {
        var currentPage = req.body.currentPage
        if (typeof currentPage !== 'number') {
            error.push(`El parametro currentPage debe ser un numero entero`)
        }
    }

    if (req.body.hasOwnProperty('attributos')) {
        var attributos = req.body.attributos
        if (!(attributos instanceof Object)) {
            error.push(`El parametro attributos debe ser un objeto`)
        } else if (attributos instanceof Array) {
            error.push(`El parametro attributos debe ser un objeto no un arreglo`)
        } else {
            for (let i in attributos) {
                if (!(attributos[i] instanceof Array)) {
                    error.push(`El parametro ${i} debe ser un arreglo de los atributos a mostrar de el modelo en cuestion o de alguna de sus relaciones`)
                } else {

                    if (!req.body.hasOwnProperty('relations')) {
                        if (i !== 'LocalsAttributes') {
                            error.push(`Debe establecer primero la relacion ${i} del parametro attributos en el parametro relations`)
                        }
                    } else if (req.body.hasOwnProperty('relations')) {
                        if (req.body.relations === "all") {
                            if (i.indexOf(".") !== -1) {
                                error.push(`No se puede procesar la relacion ${i} del parametro attributos porque la consulta devuelve nada mas las relaciones directas del modelo solicitado`)
                            }
                        } else if (req.body.relations instanceof Array) {
                            if (i !== 'LocalsAttributes') {
                                var todobien = true
                                var find = false
                                var arrayAttributos = i.split(".")
                                for (let j = 0; j < relations.length && !find; j++) {
                                    var arrayRelations = relations[j].split(".")
                                    todobien = true
                                    for (let k = 0; k < arrayAttributos.length && todobien; k++) {
                                        if (k < arrayRelations.length) {
                                            if (arrayAttributos[k] !== arrayRelations[k]) {
                                                todobien = false
                                            }
                                        } else if (k < arrayAttributos.length) {
                                            todobien = false
                                        }
                                    }
                                    if (todobien) {
                                        find = true
                                    }
                                }
                                if (!todobien) {
                                    error.push(`Debe establecer primero la relacion ${i} del parametro attributos en el parametro relations`)
                                }
                            }
                        }
                    }

                    if (i !== 'LocalsAttributes') {
                        var tableNameCopy = tableName
                        var arrayRelation = i.split(".")
                        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                        var ArrayAttributesModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayAttributes
                        findAuxiliar = true
                        for (let j = 0; j < arrayRelation.length && findAuxiliar; j++) {
                            var find = false
                            var positionModel = null
                            for (let k = 0; k < ArrayRelationsModel.length && !find; k++) {
                                if (ArrayRelationsModel[k].nameRelation === arrayRelation[j]) {
                                    find = true
                                    positionModel = k
                                }
                            }
                            if (find) {
                                tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                                ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                                ArrayAttributesModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayAttributes
                            }
                        }
                        for (let j = 0; j < attributos[i].length; j++) {
                            if (typeof attributos[i][j] !== 'string') {
                                error.push(`Todos los elementos del arreglo ${i} deben ser de tipo string especificando el nombre de los atributos`)
                            } else {
                                var findAttribute = false
                                for (let k = 0; k < ArrayAttributesModel.length && !findAttribute; k++) {
                                    if (ArrayAttributesModel[k] === attributos[i][j]) {
                                        findAttribute = true
                                    }
                                }
                                if (!findAttribute) {
                                    error.push(`El atributo ${attributos[i][j]} no existe en el modelo ${tableNameCopy}`)
                                }
                            }
                        }
                    } else {
                        var tableNameCopy = tableName
                        var ArrayAttributesModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayAttributes
                        for (let j = 0; j < attributos[i].length; j++) {
                            if (typeof attributos[i][j] !== 'string') {
                                error.push(`Todos los elementos del arreglo ${i} deben ser de tipo string especificando el nombre de los atributos`)
                            } else {
                                var findAttribute = false
                                for (let k = 0; k < ArrayAttributesModel.length && !findAttribute; k++) {
                                    if (ArrayAttributesModel[k] === attributos[i][j]) {
                                        findAttribute = true
                                    }
                                }
                                if (!findAttribute) {
                                    error.push(`El atributo ${attributos[i][j]} no existe en el modelo ${tableNameCopy}`)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (req.body.hasOwnProperty('attr')) {
        var attr = req.body.attr
        if (!(attr instanceof Object)) {
            error.push(`El parametro attr debe ser un objeto`)
        } else if (attr instanceof Array) {
            error.push(`El parametro attr debe ser un objeto no un arreglo`)
        } else {
            for (let i in attr) {
                if (attr[i] instanceof Array) {
                    attr[i].forEach(element => {
                        if (typeof element !== 'string' && element !== null) {
                            error.push(`Todos los elementos del arreglo ${i} deben ser de tipo string`)
                        }
                    })
                } else if (typeof attr[i] === 'number' || typeof attr[i] === 'boolean') {
                    error.push(`El elemento ${i} del parametro attr debe ser un objeto, arreglo o string de los valores posibles para la consulta aunque el parametro sea de tipo number`)
                } else if (attr[i] instanceof Object) {

                    if (!req.body.hasOwnProperty('relations')) {
                        error.push(`Debe establecer primero la relacion ${i} del parametro attr en el parametro relations`)
                    } else if (req.body.hasOwnProperty('relations')) {
                        if (req.body.relations === "all") {
                            if (i.indexOf(".") !== -1) {
                                error.push(`No se puede procesar la relacion ${i} del parametro attr porque la consulta devuelve nada mas las relaciones directas del modelo solicitado`)
                            }
                        } else if (req.body.relations instanceof Array) {
                            var todobien = true
                            var find = false
                            var arrayAttr = i.split(".")
                            for (let j = 0; j < relations.length && !find; j++) {
                                var arrayRelations = relations[j].split(".")
                                todobien = true
                                for (let k = 0; k < arrayAttr.length && todobien; k++) {
                                    if (k < arrayRelations.length) {
                                        if (arrayAttr[k] !== arrayRelations[k]) {
                                            todobien = false
                                        }
                                    } else if (k < arrayAttr.length) {
                                        todobien = false
                                    }
                                }
                                if (todobien) {
                                    find = true
                                }
                            }
                            if (!todobien) {
                                error.push(`Debe establecer primero la relacion ${i} del parametro attr en el parametro relations`)
                            }
                        }
                    }

                    for (let j in attr[i]) {
                        if (typeof attr[i][j] !== 'string' && !(attr[i][j] instanceof Array)) {
                            error.push(`Todos los elementos de la relacion ${j} deben ser de tipo string o arreglo de string`)
                        } else if (attr[i][j] instanceof Array) {
                            attr[i][j].forEach(element => {
                                if (typeof element !== 'string' && element !== null) {
                                    error.push(`Todos los elementos del arreglo ${j} deben ser de tipo string`)
                                }
                            })
                        }
                    }
                }
            }
        }
    }

    if (req.body.hasOwnProperty('oper')) {
        var oper = req.body.oper
        if (!req.body.hasOwnProperty('attr')) {
            error.push(`El parametro oper solo se puede poner una vez exista el parametro attr`)
        }
        if (!(oper instanceof Array)) {
            error.push(`El parametro oper debe ser un arreglo de attr`)
        } else {
            oper.forEach(element => {
                if (!(element instanceof Object)) {
                    error.push(`Todos los elementos del parametro oper deben ser objetos`)
                } else if (element instanceof Array) {
                    error.push(`Todos los elementos del parametro oper deben ser objetos no arreglos`)
                } else {
                    for (let i in element) {
                        if (element[i] instanceof Array) {
                            element[i].forEach(element2 => {
                                if (typeof element2 !== 'string' && element2 !== null) {
                                    error.push(`Todos los elementos del arreglo ${i} deben ser de tipo string`)
                                }
                            })
                        } else if (typeof element[i] === 'number' || typeof element[i] === 'boolean') {
                            error.push(`El elemento ${i} del parametro oper debe ser un objeto, arreglo o string de los valores posibles para la consulta aunque el parametro sea de tipo number`)
                        } else if (element[i] instanceof Object) {

                            if (!req.body.hasOwnProperty('relations')) {
                                error.push(`Debe establecer primero la relacion ${i} del parametro oper en el parametro relations`)
                            } else if (req.body.hasOwnProperty('relations')) {
                                if (req.body.relations === "all") {
                                    if (i.indexOf(".") !== -1) {
                                        error.push(`No se puede procesar la relacion ${i} del parametro oper porque la consulta devuelve nada mas las relaciones directas del modelo solicitado`)
                                    }
                                } else if (req.body.relations instanceof Array) {
                                    var todobien = true
                                    var find = false
                                    var arrayOper = i.split(".")
                                    for (let j = 0; j < relations.length && !find; j++) {
                                        var arrayRelations = relations[j].split(".")
                                        todobien = true
                                        for (let k = 0; k < arrayOper.length && todobien; k++) {
                                            if (k < arrayRelations.length) {
                                                if (arrayOper[k] !== arrayRelations[k]) {
                                                    todobien = false
                                                }
                                            } else if (k < arrayOper.length) {
                                                todobien = false
                                            }
                                        }
                                        if (todobien) {
                                            find = true
                                        }
                                    }
                                    if (!todobien) {
                                        error.push(`Debe establecer primero la relacion ${i} del parametro oper en el parametro relations`)
                                    }
                                }
                            }

                            for (let j in element[i]) {
                                if (typeof element[i][j] !== 'string' && !(element[i][j] instanceof Array)) {
                                    error.push(`Todos los elementos de la relacion ${j} deben ser de tipo string o arreglo de string`)
                                } else if (element[i][j] instanceof Array) {
                                    element[i][j].forEach(element => {
                                        if (typeof element !== 'string' && element !== null) {
                                            error.push(`Todos los elementos del arreglo ${j} deben ser de tipo string`)
                                        }
                                    })
                                }
                            }
                        }
                    }
                }
            })
        }
    }

    if (req.body.hasOwnProperty('orderBy')) {
        var orderBy = req.body.orderBy
        if (!(orderBy instanceof Object)) {
            error.push(`El parametro orderBy debe ser un objeto`)
        } else if (orderBy instanceof Array) {
            error.push(`El parametro orderBy debe ser un objeto no un arreglo`)
        } else {
            for (let i in orderBy) {
                if (i !== 'mode' && i !== 'attr') {
                    error.push(`El parametro ${i} no es valido para efectuar el ordenamiento`)
                } else {
                    if (typeof orderBy[i] !== "string") {
                        error.push(`El parametro ${i} debe ser un string`)
                    } else if (i === "mode" && (orderBy[i] !== 'ASC' && orderBy[i] !== 'asc' && orderBy[i] !== 'DESC' && orderBy[i] !== 'desc')) {
                        error.push(`El parametro ${i} espera como valor ASC || asc || DESC || desc`)
                    } else if (i === "attr") {
                        if (orderBy[i].indexOf(".") !== -1) {
                            var arrayRelationOrder = orderBy[i].split(".")
                            var stringRelationOrder = ""
                            for (let j = 0; j < arrayRelationOrder.length - 1; j++) {
                                stringRelationOrder = stringRelationOrder + arrayRelationOrder[j]
                                if (j + 1 < arrayRelationOrder.length - 1) {
                                    stringRelationOrder = stringRelationOrder + "."
                                }
                            }
                            if (!req.body.hasOwnProperty('relations')) {
                                error.push(`Debe establecer primero la relacion ${stringRelationOrder} del parametro orderBy en el parametro relations`)
                            } else if (req.body.hasOwnProperty('relations')) {
                                if (req.body.relations === "all") {
                                    if (arrayRelationOrder.length > 2) {
                                        error.push(`No se puede procesar la relacion ${stringRelationOrder} del parametro orderBy porque la consulta devuelve nada mas las relaciones directas del modelo solicitado`)
                                    }
                                } else if (req.body.relations instanceof Array) {
                                    var todobien = true
                                    var find = false
                                    var arrayOrder = stringRelationOrder.split(".")
                                    for (let j = 0; j < relations.length && !find; j++) {
                                        var arrayRelations = relations[j].split(".")
                                        todobien = true
                                        for (let k = 0; k < arrayOrder.length && todobien; k++) {
                                            if (k < arrayRelations.length) {
                                                if (arrayOrder[k] !== arrayRelations[k]) {
                                                    todobien = false
                                                }
                                            } else if (k < arrayOrder.length) {
                                                todobien = false
                                            }
                                        }
                                        if (todobien) {
                                            find = true
                                        }
                                    }
                                    if (!todobien) {
                                        error.push(`Debe establecer primero la relacion ${stringRelationOrder} del parametro orderBy en el parametro relations`)
                                    }
                                }
                            }

                        }
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
    return errorResult
}

function proccessOneRequestOrTwoRequest(req, nameFolderModule, tableName) {
    var find = false
    if (req.body.hasOwnProperty('attr')) {
        for (let i in req.body.attr) {
            if (req.body.attr[i] instanceof Object && !(req.body.attr[i] instanceof Array)) {
                var tableNameCopy = tableName
                var arrayRelations = i.split(".")
                var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                for (let j = 0; j < arrayRelations.length && !find; j++) {
                    var findEspecific = false
                    var positionModel = null
                    for (let h = 0; h < ArrayRelationsModel.length && !findEspecific; h++) {
                        if (ArrayRelationsModel[h].nameRelation === arrayRelations[j]) {
                            findEspecific = true
                            positionModel = h
                            if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                find = true
                            }
                        }
                    }
                    tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                    ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                }
            }
        }
    }
    if (req.body.hasOwnProperty('orderBy')) {
        var tableNameCopy = tableName
        var arrayRelations = req.body.orderBy.attr.split(".")
        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
        if (arrayRelations.length > 1) {
            for (let j = 0; j < arrayRelations.length - 1 && !find; j++) {
                var findEspecific = false
                var positionModel = null
                for (let h = 0; h < ArrayRelationsModel.length && !findEspecific; h++) {
                    if (ArrayRelationsModel[h].nameRelation === arrayRelations[j]) {
                        findEspecific = true
                        positionModel = h
                        if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                            find = true
                        }
                    }
                }
                tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
            }
        }
    }
    if (req.body.hasOwnProperty('oper')) {
        req.body.oper.forEach(element => {
            for (let i in element) {
                if (element[i] instanceof Object && !(element[i] instanceof Array)) {
                    var tableNameCopy = tableName
                    var arrayRelations = i.split(".")
                    var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                    for (let j = 0; j < arrayRelations.length && !find; j++) {
                        var findEspecific = false
                        var positionModel = null
                        for (let h = 0; h < ArrayRelationsModel.length && !findEspecific; h++) {
                            if (ArrayRelationsModel[h].nameRelation === arrayRelations[j]) {
                                findEspecific = true
                                positionModel = h
                                if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                    find = true
                                }
                            }
                        }
                        tableNameCopy = ArrayRelationsModel[positionModel].nameModel
                        ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableNameCopy).arrayRelations
                    }
                }
            }
        })
    }
    return find
}

async function buildQueryFromReqFirstRequest(req, nameFolderModule, tableName) {
    var relations = await relationsFirstRequest(req, nameFolderModule, tableName);
    if (relations === "Forbidden") {
        return relations
    }
    var attrlocales = this.attrLocales(req);
    var functionOrder = this.order(req);
    var order = functionOrder.order;
    if (req.body.pagination !== 'all') {
        var functionPagination = this.pagination(req);
        var currentPage = functionPagination.currentPage;
        var perPage = functionPagination.perPage;
        var limit = functionPagination.limit;
        var offset = functionPagination.offset;
    }

    return {
        query: {
            limit: limit ?? null,
            offset: offset ?? null,
            subQuery: false,
            required: true,
            distinct: true,
            attributes: ["id"],
            include: relations,
            where: attrlocales,
            order: order
        },
        response: {
            currentPage: currentPage,
            perPage: perPage
        }
    }
}

async function buildQueryFromReqSecondRequest(req, nameFolderModule, tableName, models) {
    var relations = await this.relations(req, nameFolderModule, tableName);
    var functionAtributos = this.atributos(req);
    var atributos = functionAtributos.atributos;

    var arrayIds = []
    models.forEach(element => {
        arrayIds.push(element.id)
    })

    return {
        query: {
            subQuery: false,
            required: true,
            distinct: true,
            attributes: atributos,
            include: relations,
            where: {
                id: {
                    [Op.in]: arrayIds
                }
            }
        }
    }
}

async function buildQueryFromReq(req, nameFolderModule, tableName) {
    var relations = await this.relations(req, nameFolderModule, tableName);
    if (relations === "Forbidden") {
        return relations
    }
    var functionAtributos = this.atributos(req);
    var atributos = functionAtributos.atributos;
    var attrlocales = this.attrLocales(req);
    var functionOrder = this.order(req);
    var order = functionOrder.order;
    if (req.body.pagination !== 'all') {
        var functionPagination = this.pagination(req);
        var currentPage = functionPagination.currentPage;
        var perPage = functionPagination.perPage;
        var limit = functionPagination.limit;
        var offset = functionPagination.offset;
    }

    return {
        query: {
            limit: limit ?? null,
            offset: offset ?? null,
            subQuery: false,
            required: true,
            distinct: true,
            attributes: atributos,
            include: relations,
            where: attrlocales,
            //     {
            //     "department_id": {
            //         [Op.ne]: null
            //     }
            // },
            order: order
        },
        response: {
            currentPage: currentPage,
            perPage: perPage
        }
    }
}

async function buildQueryFromReqSingleCollection(req, nameFolderModule, tableName) {
    var relations = await this.relations(req, nameFolderModule, tableName);
    if (relations === "Forbidden") {
        return relations
    }
    var functionAtributos = this.atributos(req);
    var atributos = functionAtributos.atributos;

    return {
        query: {
            subQuery: false,
            required: true,
            distinct: true,
            include: relations,
            attributes: atributos,
        }
    }
}

function processOperator(attr) {
    var array = [];
    if (attr !== null) {
        if (attr.indexOf("<") !== -1 && attr.indexOf("=") === -1) {
            array = attr.split("<");
            array.forEach(element => {
                if (element !== "<") {
                    attr = {
                        [Op.lt]: element
                    };
                }
            });
        } else if (attr.indexOf(">") !== -1 && attr.indexOf("=") === -1) {
            array = attr.split(">");
            array.forEach(element => {
                if (element !== ">") {
                    attr = {
                        [Op.gt]: element
                    };
                }
            });
        } else if (attr.indexOf("!") !== -1) {
            array = attr.split("!");
            array.forEach(element => {
                if (element !== "!") {
                    attr = {
                        [Op.ne]: element
                    };
                }
            });
        } else if (attr.indexOf("%") !== -1) {
            array = attr.split("%");
            array.forEach(element => {
                if (element !== "%") {
                    attr = {
                        [Op.substring]: element
                    };
                }
            });
        } else if (attr.indexOf(">=") !== -1) {
            array = attr.split(">=");
            array.forEach(element => {
                if (element !== ">=") {
                    attr = {
                        [Op.gte]: element
                    };
                }
            });
        } else if (attr.indexOf("<=") !== -1) {
            array = attr.split("<=");
            array.forEach(element => {
                if (element !== "<=") {
                    attr = {
                        [Op.lte]: element
                    };
                }
            });
        } else if (attr.indexOf("=>") !== -1) {
            array = attr.split("=>");
            array.forEach(element => {
                if (element !== "=>") {
                    attr = {
                        [Op.gte]: element
                    };
                }
            });
        } else if (attr.indexOf("=<") !== -1) {
            array = attr.split("=<");
            array.forEach(element => {
                if (element !== "=<") {
                    attr = {
                        [Op.lte]: element
                    };
                }
            });
        }
    }
    return attr;
};

async function relations(req, nameFolderModule, tableName) {
    let relations = [];
    var errorPermission = false
    if (req.body.relations) {
        if (req.body.relations === "all") {
            var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations
            for (let zy = 0; zy < ArrayRelationsModel.length; zy++){
                if (!errorPermission) {
                    var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[zy].nameModel, nameFolderModule, req.loggedUser.roleId);
                    if (RolePermissionAuthenticationNested.error !== "") {
                        errorPermission = true
                        relations = "Forbidden"
                    } else {
                        var RelationAtributos = ""
                        if (req.body.hasOwnProperty("attributos")) {
                            for (let j in req.body.attributos) {
                                if (j === ArrayRelationsModel[zy].nameRelation) {
                                    RelationAtributos = req.body.attributos[j]
                                }
                            }
                        }

                        var isSeparate = false
                        if (ArrayRelationsModel[zy].typeRelation === 'hasMany') {
                            isSeparate = true
                        }
                        if (ArrayRelationsModel[zy].typeRelation === 'hasMany') {
                            relations.push({
                                association: ArrayRelationsModel[zy].nameRelation,
                                attributes: RelationAtributos,
                                subQuery: false,
                                required: true,
                                separate: isSeparate
                            })
                        } else if (ArrayRelationsModel[zy].typeRelation === 'hasOne' || ArrayRelationsModel[zy].typeRelation === 'belongsTo') {
                            relations.push({
                                association: ArrayRelationsModel[zy].nameRelation,
                                attributes: RelationAtributos,
                                subQuery: false,
                                right: true,
                                separate: isSeparate
                            })
                        }
                    }
                }
            }
            // ArrayRelationsModel.forEach(async (element) => {
            //     if (!errorPermission) {
            //         var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(element.nameModel, nameFolderModule, req.loggedUser.roleId);
            //         if (RolePermissionAuthenticationNested.error !== "") {
            //             errorPermission = true
            //             relations = "Forbidden"
            //         } else {
            //             var RelationAtributos = ""
            //             if (req.body.hasOwnProperty("attributos")) {
            //                 for (let j in req.body.attributos) {
            //                     if (j === element.nameRelation) {
            //                         RelationAtributos = req.body.attributos[j]
            //                     }
            //                 }
            //             }
            //
            //             var isSeparate = false
            //             if (element.typeRelation === 'hasMany') {
            //                 isSeparate = true
            //             }
            //             if (element.typeRelation === 'hasMany') {
            //                 relations.push({
            //                     association: element.nameRelation,
            //                     attributes: RelationAtributos,
            //                     subQuery: false,
            //                     required: true,
            //                     separate: isSeparate
            //                 })
            //             } else if (element.typeRelation === 'hasOne' || element.typeRelation === 'belongsTo') {
            //                 relations.push({
            //                     association: element.nameRelation,
            //                     attributes: RelationAtributos,
            //                     subQuery: false,
            //                     right: true,
            //                     separate: isSeparate
            //                 })
            //             }
            //         }
            //     }
            // })
        } else {
            for (let i = 0; i < req.body.relations.length; i++) {
                var obj = req.body.relations[i];
                if (!errorPermission) {
                    if (obj.indexOf(".") !== -1) {
                        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations
                        var array = obj.split(".");
                        var relation = "";
                        var arrayIshasMany = []
                        for (let j = 0; j < array.length; j++) {
                            var find = false
                            for (let h = 0; h < ArrayRelationsModel.length && !find; h++) {
                                if (ArrayRelationsModel[h].nameRelation === array[j]) {
                                    var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[h].nameModel, nameFolderModule, req.loggedUser.roleId);
                                    if (RolePermissionAuthenticationNested.error !== "") {
                                        errorPermission = true
                                        relations = "Forbidden"
                                    } else {
                                        find = true
                                        if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                            arrayIshasMany.push({isHasMany: true, isHasOne: false})
                                        } else if (ArrayRelationsModel[h].typeRelation === 'hasOne') {
                                            arrayIshasMany.push({isHasMany: false, isHasOne: true})
                                        } else {
                                            arrayIshasMany.push({isHasMany: false, isHasOne: false})
                                        }
                                        ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + ArrayRelationsModel[h].nameModel).arrayRelations
                                    }
                                }
                            }
                        }
                        if (!errorPermission) {
                            var arrayAtributosToRelation = []
                            if (req.body.hasOwnProperty("attributos")) {
                                for (let j in req.body.attributos) {
                                    var find = true
                                    if (j !== "LocalsAttributes") {
                                        var arrayAtributos = j.split(".");
                                        for (let h = 0; h < array.length && find && h < arrayAtributos.length; h++) {
                                            if (arrayAtributos[h] !== array[h]) {
                                                find = false
                                            }
                                        }
                                        if (find) {
                                            arrayAtributosToRelation.push(j)
                                        }
                                    }
                                }
                            }
                            for (let j = array.length - 1; j >= 0; j--) {
                                var find = false
                                var RelationAtributos = ""
                                for (let h = 0; h < arrayAtributosToRelation.length && !find; h++) {
                                    var arrayAtributosToRelationSingle = arrayAtributosToRelation[h].split(".")
                                    if (arrayAtributosToRelationSingle[arrayAtributosToRelationSingle.length - 1] === array[j]) {
                                        find = true
                                        RelationAtributos = req.body.attributos[arrayAtributosToRelation[h]]
                                    }
                                }

                                if (j === array.length - 1) {
                                    if (arrayIshasMany[j].isHasOne || (!arrayIshasMany[j].isHasOne && !arrayIshasMany[j].isHasMany)) {
                                        relation = {
                                            association: array[j],
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            rigth: true,
                                            separate: arrayIshasMany[j].isHasMany
                                        };
                                    } else {
                                        relation = {
                                            association: array[j],
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            required: true,
                                            separate: arrayIshasMany[j].isHasMany
                                        };
                                    }
                                } else {
                                    if (arrayIshasMany[j].isHasOne || (!arrayIshasMany[j].isHasOne && !arrayIshasMany[j].isHasMany)) {
                                        relation = {
                                            association: array[j],
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            rigth: true,
                                            separate: arrayIshasMany[j].isHasMany,
                                            include: [relation]
                                        };
                                    } else {
                                        relation = {
                                            association: array[j],
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            required: true,
                                            separate: arrayIshasMany[j].isHasMany,
                                            include: [relation]
                                        };
                                    }
                                }
                            }
                            relations.push(relation);
                        }
                    } else {
                        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations
                        var isSeparate = false
                        var RelationAtributos = ""
                        if (req.body.hasOwnProperty("attributos")) {
                            for (let j in req.body.attributos) {
                                if (j === obj) {
                                    RelationAtributos = req.body.attributos[j]
                                }
                            }
                        }

                        for (let h = 0; h < ArrayRelationsModel.length; h++) {
                            if (ArrayRelationsModel[h].nameRelation === obj) {
                                var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[h].nameModel, nameFolderModule, req.loggedUser.roleId);
                                if (RolePermissionAuthenticationNested.error !== "") {
                                    errorPermission = true
                                    relations = "Forbidden"
                                } else {
                                    if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                        isSeparate = true
                                        relations.push({
                                            association: obj,
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            required: true,
                                            separate: isSeparate
                                        });
                                    } else if (ArrayRelationsModel[h].typeRelation === 'belongsTo') {
                                        relations.push({
                                            association: obj,
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            rigth: true,
                                            separate: isSeparate
                                        });
                                    } else if (ArrayRelationsModel[h].typeRelation === 'hasOne') {
                                        relations.push({
                                            association: obj,
                                            attributes: RelationAtributos,
                                            subQuery: false,
                                            rigth: true,
                                            separate: isSeparate
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return relations;
};

async function relationsFirstRequest(req, nameFolderModule, tableName) {
    let relations = [];
    var errorPermission = false
    if (req.body.relations) {
        if (req.body.relations === "all") {
            var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations
            for (let u = 0; u < ArrayRelationsModel.length; u++){
                if (!errorPermission) {
                    var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[u].nameModel, nameFolderModule, req.loggedUser.roleId);
                    if (RolePermissionAuthenticationNested.error !== "") {
                        errorPermission = true
                        relations = "Forbidden"
                    } else {
                        if (ArrayRelationsModel[u].typeRelation === 'hasMany') {
                            relations.push({
                                association: ArrayRelationsModel[u].nameRelation,
                                attributes: [],
                                distinct: true,
                                subQuery: false
                            })
                        } else if (ArrayRelationsModel[u].typeRelation === 'hasOne' || ArrayRelationsModel[u].typeRelation === 'belongsTo') {
                            relations.push({
                                association: ArrayRelationsModel[u].nameRelation,
                                attributes: [],
                                distinct: true,
                                subQuery: false
                            })
                        }
                    }
                }
            }
            // ArrayRelationsModel.forEach(async (element) => {
            //     if (!errorPermission) {
            //         var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(element.nameModel, nameFolderModule, req.loggedUser.roleId);
            //         if (RolePermissionAuthenticationNested.error !== "") {
            //             errorPermission = true
            //             relations = "Forbidden"
            //         } else {
            //             if (element.typeRelation === 'hasMany') {
            //                 relations.push({
            //                     association: element.nameRelation,
            //                     attributes: [],
            //                     distinct: true,
            //                     subQuery: false
            //                 })
            //             } else if (element.typeRelation === 'hasOne' || element.typeRelation === 'belongsTo') {
            //                 relations.push({
            //                     association: element.nameRelation,
            //                     attributes: [],
            //                     distinct: true,
            //                     subQuery: false
            //                 })
            //             }
            //         }
            //     }
            // })
        } else {
            for (let i = 0; i < req.body.relations.length; i++) {
                var obj = req.body.relations[i];
                if (!errorPermission) {
                    if (obj.indexOf(".") !== -1) {
                        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations
                        var array = obj.split(".");
                        var relation = "";
                        var arrayIshasMany = []
                        for (let j = 0; j < array.length; j++) {
                            var find = false
                            for (let h = 0; h < ArrayRelationsModel.length && !find; h++) {
                                if (ArrayRelationsModel[h].nameRelation === array[j]) {
                                    var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[h].nameModel, nameFolderModule, req.loggedUser.roleId);
                                    if (RolePermissionAuthenticationNested.error !== "") {
                                        errorPermission = true
                                        relations = "Forbidden"
                                    } else {
                                        find = true
                                        if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                            arrayIshasMany.push({isHasMany: true, isHasOne: false})
                                        } else if (ArrayRelationsModel[h].typeRelation === 'hasOne') {
                                            arrayIshasMany.push({isHasMany: false, isHasOne: true})
                                        } else {
                                            arrayIshasMany.push({isHasMany: false, isHasOne: false})
                                        }
                                        ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + ArrayRelationsModel[h].nameModel).arrayRelations
                                    }
                                }
                            }
                        }
                        if (!errorPermission) {
                            for (let j = array.length - 1; j >= 0; j--) {
                                if (j === array.length - 1) {
                                    if (arrayIshasMany[j].isHasOne || (!arrayIshasMany[j].isHasOne && !arrayIshasMany[j].isHasMany)) {
                                        relation = {
                                            association: array[j],
                                            attributes: [],
                                            distinct: true,
                                            subQuery: false
                                        };
                                    } else {
                                        relation = {
                                            association: array[j],
                                            attributes: [],
                                            distinct: true,
                                            subQuery: false
                                        };
                                    }
                                } else {
                                    if (arrayIshasMany[j].isHasOne || (!arrayIshasMany[j].isHasOne && !arrayIshasMany[j].isHasMany)) {
                                        relation = {
                                            association: array[j],
                                            attributes: [],
                                            subQuery: false,
                                            distinct: true,
                                            include: [relation]
                                        };
                                    } else {
                                        relation = {
                                            association: array[j],
                                            attributes: [],
                                            subQuery: false,
                                            distinct: true,
                                            include: [relation]
                                        };
                                    }
                                }
                            }
                            relations.push(relation);
                        }
                    } else {
                        var ArrayRelationsModel = require('../../modules/' + nameFolderModule + '/models/' + tableName).arrayRelations

                        for (let h = 0; h < ArrayRelationsModel.length; h++) {
                            if (ArrayRelationsModel[h].nameRelation === obj) {
                                var RolePermissionAuthenticationNested = await global.app.security.RolePermissionAuthenticationNested(ArrayRelationsModel[h].nameModel, nameFolderModule, req.loggedUser.roleId);
                                if (RolePermissionAuthenticationNested.error !== "") {
                                    errorPermission = true
                                    relations = "Forbidden"
                                } else {
                                    if (ArrayRelationsModel[h].typeRelation === 'hasMany') {
                                        relations.push({
                                            association: obj,
                                            attributes: [],
                                            distinct: true,
                                            subQuery: false
                                        });
                                    } else if (ArrayRelationsModel[h].typeRelation === 'belongsTo') {
                                        relations.push({
                                            association: obj,
                                            attributes: [],
                                            distinct: true,
                                            subQuery: false
                                        });
                                    } else if (ArrayRelationsModel[h].typeRelation === 'hasOne') {
                                        relations.push({
                                            association: obj,
                                            attributes: [],
                                            distinct: true,
                                            subQuery: false
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return relations;
};

function atributos(req) {
    var atributos = "";
    if (req.body.hasOwnProperty("attributos")) {
        if (req.body.attributos.hasOwnProperty("LocalsAttributes")) {
            if (req.body.attributos.LocalsAttributes.length > 0) {
                atributos = [];
                req.body.attributos.LocalsAttributes.forEach(element => {
                    atributos.push(element);
                });
            }
        }
    }
    return {atributos: atributos};
};

function attrLocales(req) {
    var attrlocales = {};
    var nested_relation = "";
    if (req.body.hasOwnProperty("attr")) {
        for (let i in req.body.attr) {
            if (!(req.body.attr[i] instanceof Object) &&
                !(req.body.attr[i] instanceof Array)
            ) {
                attrlocales[i] = this.processOperator(req.body.attr[i]);
            } else if (req.body.attr[i] instanceof Array) {
                for (let j = 0; j < req.body.attr[i].length; j++) {
                    req.body.attr[i][j] = this.processOperator(req.body.attr[i][j]);
                }
                req.body.attr[i] = {
                    [Op.or]: req.body.attr[i]
                };
                attrlocales[i] = req.body.attr[i];
            } else if (req.body.attr[i] instanceof Object) {
                nested_relation = "$" + i;
                for (let j in req.body.attr[i]) {
                    if (req.body.attr[i][j] instanceof Array) {
                        for (let k = 0; k < req.body.attr[i][j].length; k++) {
                            req.body.attr[i][j][k] = this.processOperator(
                                req.body.attr[i][j][k]
                            );
                        }
                        req.body.attr[i][j] = {
                            [Op.or]: req.body.attr[i][j]
                        };
                    } else {
                        req.body.attr[i][j] = this.processOperator(req.body.attr[i][j]);
                    }
                    attrlocales[nested_relation + "." + j + "$"] = req.body.attr[i][j];
                }
            }
        }
    }

    if (req.body.hasOwnProperty("oper")) {
        if (req.body.oper instanceof Array) {
            var attrOper = {};
            attrlocales = {
                [Op.or]: [attrlocales]
            };
            for (let i = 0; i < req.body.oper.length; i++) {
                attrOper = {};
                if (req.body.oper[i] instanceof Object) {
                    for (let j in req.body.oper[i]) {
                        if (!(req.body.oper[i][j] instanceof Object) &&
                            !(req.body.oper[i][j] instanceof Array)
                        ) {
                            attrOper[j] = this.processOperator(req.body.oper[i][j]);
                        } else if (req.body.oper[i][j] instanceof Array) {
                            for (let k = 0; k < req.body.oper[i][j].length; k++) {
                                req.body.oper[i][j][k] = this.processOperator(
                                    req.body.oper[i][j][k]
                                );
                            }
                            req.body.oper[i][j] = {
                                [Op.or]: req.body.oper[i][j]
                            };
                            attrOper[j] = req.body.oper[i][j];
                        } else if (req.body.oper[i][j] instanceof Object) {
                            nested_relation = "$" + j;
                            for (let k in req.body.oper[i][j]) {
                                if (req.body.oper[i][j][k] instanceof Array) {
                                    for (let h = 0; h < req.body.oper[i][j][k].length; h++) {
                                        req.body.oper[i][j][k][h] = this.processOperator(
                                            req.body.oper[i][j][k][h]
                                        );
                                    }
                                    req.body.oper[i][j][k] = {
                                        [Op.or]: req.body.oper[i][j][k]
                                    };
                                } else {
                                    req.body.oper[i][j][k] = this.processOperator(
                                        req.body.oper[i][j][k]
                                    );
                                }
                                attrOper[nested_relation + "." + k + "$"] =
                                    req.body.oper[i][j][k];
                            }
                        }
                    }
                    attrlocales[Op.or].push(attrOper);
                }
            }
        }
    }
    return attrlocales;
};

function order(req) {
    var order = null;
    if (req.body.hasOwnProperty("orderBy")) {
        if (
            req.body.orderBy.hasOwnProperty("mode") &&
            req.body.orderBy.hasOwnProperty("attr")
        ) {
            if (req.body.orderBy.attr.indexOf(".") === -1) {
                order = [
                    [req.body.orderBy.attr, req.body.orderBy.mode]
                ];
            } else {
                var array = req.body.orderBy.attr.split(".");
                order = [
                    []
                ];
                array.forEach(element => {
                    order[0].push(element);
                });
                order[0].push(req.body.orderBy.mode);
            }
        }
    }
    return {order: order};
};

function pagination(req) {
    var currentPage = 0;
    var perPage = 20;
    var limit = 20;
    if (
        req.body.hasOwnProperty("pagination") &&
        req.body.hasOwnProperty("currentPage")
    ) {
        currentPage = req.body.currentPage;
        perPage = req.body.pagination;
        var offset = currentPage * perPage;
        limit = perPage;
    } else if (req.body.hasOwnProperty("pagination")) {
        perPage = req.body.pagination;
        limit = perPage;
    } else if (req.body.hasOwnProperty("currentPage")) {
        currentPage = req.body.currentPage;
        var offset = currentPage * perPage;
    }
    return {
        currentPage: currentPage,
        perPage: perPage,
        limit: limit,
        offset: offset
    };
};

module.exports = {
    processOperator: processOperator,
    relations: relations,
    atributos: atributos,
    attrLocales: attrLocales,
    order: order,
    pagination: pagination,
    buildQueryFromReq: buildQueryFromReq,
    buildQueryFromReqFirstRequest: buildQueryFromReqFirstRequest,
    buildQueryFromReqSecondRequest: buildQueryFromReqSecondRequest,
    buildQueryFromReqSingleCollection: buildQueryFromReqSingleCollection,
    processErrorsQuery: processErrorsQuery,
    processErrorsQuerySingleCollection: processErrorsQuerySingleCollection,
    proccessOneRequestOrTwoRequest: proccessOneRequestOrTwoRequest,
    processErrors: processErrors,
    devNotification: devNotification,
}