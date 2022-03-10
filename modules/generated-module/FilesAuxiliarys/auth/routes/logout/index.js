'use strict';
const {DateTimeZoneWithOutDate} = require("../../../../common/utils/helpers-method");
module.exports = function (req, res) {
  /**
   dato el token,
   actualizar lastLogout del user en now()

   * */
  ;
  return req.loggedUser.update({
    lastLogout: new Date() //DateTimeZoneWithOutDate(),
  }).then(function () {
    return res.sendStatus(204);
  }).catch(global.app.orm.Sequelize.ValidationError, function (error) {
    global.app.utils.logger.error(error, {
      module   : 'auth/logout',
      submodule: 'routes',
      stack    : error.stack
    });
    return res.sendStatus(204);
  }).catch(function (error) {
    global.app.utils.logger.error(error, {
      module   : 'auth/logout',
      submodule: 'routes',
      stack    : error.stack
    });
    return res.sendStatus(204);
  });
};
