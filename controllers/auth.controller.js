const login = require('../models/login');

/**
 * Login allows the user to authenticate with credentials 
 * and get a token to use on secured endpoints. 
 */
module.exports.login = (req, res) => {
  // TODO: User must login and a token must be generated
  res.status(200).send(login);
};
