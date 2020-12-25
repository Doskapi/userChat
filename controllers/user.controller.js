const user = require('../models/user');

/**
 * Creates a user.
 */
module.exports.createUser = async (req, res) => {
  // TODO: Create a New User
  res.status(200).json(user);
}
