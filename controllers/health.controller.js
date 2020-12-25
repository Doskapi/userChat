const health = require('../models/health')

/**
 * Checks if the app is running fine.
 */
module.exports.check = async (req, res) => {
  // TODO: Check service health. Feel free to add any check you consider necessary
  res.json(health);
}