/**
 * Created by yartiles on 26/03/18.
 */
'use strict';
var jwt = require('jsonwebtoken');
var lodash = require('lodash');
const {DateTimeZoneWithOutDate} = require("../../../../common/utils/helpers-method");
module.exports = function(req, res) {
  var error = ""
  var jsonAPI = global.app.utils.jsonAPI;
  var models = global.app.orm.sequelize.models;
  req.body.lastLogout = new Date(); //DateTimeZoneWithOutDate()
  if (req.body instanceof Array) {
    error = new Error("El body de la peticion debe ser un objeto");
    return res.status(400)
        .json(jsonAPI.processErrors(error, req, { file: __filename }));
  } else {
    var date_to_generated_code = new Date()
    var confirmCode = date_to_generated_code.getTime().toString(36) + (Math.floor(Math.random() * (9999 - 1000)) + 1000)
    var body = req.body
    body.status = 'pendingSignUpVerification'
    body.exist = 1
    body.confirmCode = confirmCode
  }
  return models.role.findOne({
    where: {
      name: "tcp"
    }
  }).then(function (role){
    body.roleId = role.id
    return models.person.create(req.body).then(function(user) {
      var mailerConfig = global.app.config.get('mailer');
      const context = {
        user_identifier: body.username ||= body.email,
        code: confirmCode,
        url: `http://localhost:6541/v1/confirm?code=${confirmCode}`,
      };
      var Sequelize = global.app.orm.Sequelize;
      Sequelize.Promise.all([
        global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/html', context),
        global.app.emailTemplates['newUser'].render('../modules/auth/emails/new-user/text', context)
      ])
          .spread((html, text) => {
            var mail = {
              from: mailerConfig.from,
              bcc: [body.email],
              subject: "Código de verificación",
              text: text,
              html: html
            };
            global.app.utils.mailer.sendMail(mail,
                function(err, info) {
                  if (err) {
                    global.app.utils.logger.error('Dev mailer', {messages: err.message});
                  } else {
                    global.app.utils.logger.info('Dev mailer', {messages: info.response});
                    global.app.utils.mailer.close();
                  }
                }
            );
          })
          .catch(console.error);
      return res.status(201).json({
        data: user
      });
    }).catch(global.app.orm.Sequelize.ValidationError, function(error) {
      global.app.utils.logger.error(error, {
        module: 'auth/sign-up',
        submodule: 'routes',
        stack: error.stack
      });
      return res.status(400)
          .json(jsonAPI.processErrors(error, req, {
            file: __filename
          }));
    }).catch(function(error) {
      global.app.utils.logger.error(error, {
        module: 'auth/sign-up',
        submodule: 'routes',
        stack: error.stack
      });
      return res.status(500)
          .json(jsonAPI.processErrors(error, req, {
            file: __filename
          }));
    });
  });
};