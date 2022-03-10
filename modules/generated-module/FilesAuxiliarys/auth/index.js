
const middleware                             = require('../../common/middleware');
const ensureAuthenticated                    = middleware.auth.ensureAuthenticated();


const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate

exports.loadEmails = function loadEmails() {
      global.app.emailTemplates.newUser = new EmailTemplate(path.join(__dirname, 'emails', 'new-user'));
};


exports.setRoutes = function setRoutes() {
  const authRoute = global.app.config.get('api:prefix') + '/auth';

  const loginRoute = authRoute + '/login';
  global.app.express
        .route(loginRoute)
        .get(require('./routes/login/index'));

  const loginEmailRoute = authRoute + '/login_email';
  global.app.express
      .route(loginEmailRoute)
      .get(require('./routes/login_email/index'));

  const loginEmailUsernameRoute = authRoute + '/login_email';
  global.app.express
      .route(loginEmailUsernameRoute)
      .get(require('./routes/login_email_or_username/index'));

  const signUpRoute = global.app.config.get('api:prefix') + '/sign-up';
  global.app.express
        .route(signUpRoute)
        .post(require('./routes/sign-up/index'));

  const logoutRoute = authRoute + '/logout';
  global.app.express
        .route(logoutRoute)
        .get(ensureAuthenticated, require('./routes/logout/index'));

  const confirmRoute = global.app.config.get('api:prefix') + '/confirm';
  global.app.express
      .route(confirmRoute)
      .get(require('./routes/confirm/index'));

  const send_codeRoute = global.app.config.get('api:prefix') + '/send_code';
  global.app.express
      .route(send_codeRoute)
      .get(require('./routes/send_code/index'));

  const change_passwordRoute = global.app.config.get('api:prefix') + '/change_password';
  global.app.express
      .route(change_passwordRoute)
      .post(require('./routes/change_password/index'));

  const change_accountRoute = global.app.config.get('api:prefix') + '/change_account/:id';
  global.app.express
      .route(change_accountRoute)
      .patch(ensureAuthenticated, require('./routes/change_account/index'));
  
const validateRoute = authRoute + '/validate';

global.app.express
      .route(validateRoute)
      .post(require('./routes/validate/index'));        

};