'use strict';
            const bank_dataRoutes = require('./routes/bank_dataroute')
            const bank_dataController = require('./controllers/bank_datacontroller')
            const cityRoutes = require('./routes/cityroute')
            const cityController = require('./controllers/citycontroller')
            const countryRoutes = require('./routes/countryroute')
            const countryController = require('./controllers/countrycontroller')
            const documentRoutes = require('./routes/documentroute')
            const documentController = require('./controllers/documentcontroller')
            const logRoutes = require('./routes/logroute')
            const logController = require('./controllers/logcontroller')
            const mipymeRoutes = require('./routes/mipymeroute')
            const mipymeController = require('./controllers/mipymecontroller')
            const personRoutes = require('./routes/personroute')
            const personController = require('./controllers/personcontroller')
            const roleRoutes = require('./routes/roleroute')
            const roleController = require('./controllers/rolecontroller')
            const rolepersonRoutes = require('./routes/rolepersonroute')
            const rolepersonController = require('./controllers/rolepersoncontroller')
            const roleserverfunctionRoutes = require('./routes/roleserverfunctionroute')
            const roleserverfunctionController = require('./controllers/roleserverfunctioncontroller')
            const serverfunctionRoutes = require('./routes/serverfunctionroute')
            const serverfunctionController = require('./controllers/serverfunctioncontroller')
            const stateRoutes = require('./routes/stateroute')
            const stateController = require('./controllers/statecontroller')
        exports.loadModels = function loadModels() {
            require('./models/bank_data').loadModel();
            require('./models/city').loadModel();
            require('./models/country').loadModel();
            require('./models/document').loadModel();
            require('./models/log').loadModel();
            require('./models/mipyme').loadModel();
            require('./models/person').loadModel();
            require('./models/role').loadModel();
            require('./models/roleperson').loadModel();
            require('./models/roleserverfunction').loadModel();
            require('./models/serverfunction').loadModel();
            require('./models/state').loadModel();
        };
        exports.loadTasks = function loadTasks() {};
        exports.setRoutes = function setRoutes() {
            var models = global.app.orm.sequelize.models;
            new bank_dataRoutes(bank_dataController, models.bank_data).router
            new cityRoutes(cityController, models.city).router
            new countryRoutes(countryController, models.country).router
            new documentRoutes(documentController, models.document).router
            new logRoutes(logController, models.log).router
            new mipymeRoutes(mipymeController, models.mipyme).router
            new personRoutes(personController, models.person).router
            new roleRoutes(roleController, models.role).router
            new rolepersonRoutes(rolepersonController, models.roleperson).router
            new roleserverfunctionRoutes(roleserverfunctionController, models.roleserverfunction).router
            new serverfunctionRoutes(serverfunctionController, models.serverfunction).router
            new stateRoutes(stateController, models.state).router};