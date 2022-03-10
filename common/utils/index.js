/**
 * Created by yartiles on 2/03/18.
 */

module.exports = {
    logger: require("./logger").logger,
    initOnModules: require('./init-on-modules'),
    jsonAPI: require('./json-api'),
    RestJson: require('./rest-json'),
    mailer: require('../mailer').mailer,
    paths: require('./paths')
};