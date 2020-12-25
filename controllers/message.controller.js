const message = require('../models/message');

/**
 * Send a message from one user to another. 
 * We support three types of messages `text`, `image` and `video` 
 */
module.exports.send = async (req, res) => {
  // TODO: Send a New Message
  res.status(200).json(message);
}

/**
 * Fetch all existing messages to a given recipient, within a range of message IDs.
 */
module.exports.get = async (req, res) => {
  // TODO: Retrieve list of Messages
  res.status(200).json({ messages : [ message ] });
};