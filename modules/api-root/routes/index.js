
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
        "help": absoluteNewLinkPath + '/help',
          "signup": absoluteNewLinkPath + '/sign-up',
          "login": absoluteNewLinkPath + '/auth/login',
          "login_email": absoluteNewLinkPath + '/auth/login_email',
          "login_email_or_username": absoluteNewLinkPath + '/auth/login_email_or_username',
          "confirm": absoluteNewLinkPath + '/auth/confirm',
          "send_code": absoluteNewLinkPath + '/auth/send_code',
          "change_password": absoluteNewLinkPath + '/auth/change_password',
          "change_account": absoluteNewLinkPath + '/auth/change_account',
          "logout": absoluteNewLinkPath + '/auth/logout',
            "bank_data": absoluteNewLinkPath + "/bank_data",
            "city": absoluteNewLinkPath + "/city",
            "country": absoluteNewLinkPath + "/country",
            "document": absoluteNewLinkPath + "/document",
            "log": absoluteNewLinkPath + "/log",
            "mipyme": absoluteNewLinkPath + "/mipyme",
            "person": absoluteNewLinkPath + "/person",
            "role": absoluteNewLinkPath + "/role",
            "roleperson": absoluteNewLinkPath + "/roleperson",
            "roleserverfunction": absoluteNewLinkPath + "/roleserverfunction",
            "serverfunction": absoluteNewLinkPath + "/serverfunction",
            "state": absoluteNewLinkPath + "/state",
}
};
return res.status(200).json(jsonAPIBody); // OK.
};