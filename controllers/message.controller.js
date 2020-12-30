const Message = require('../models/message');
const User = require('../models/user');
const DbDao = require('../db/dao');
const jwt = require('jsonwebtoken');
const login = require('../models/login');

const dao = new DbDao();
const userDao = new User(dao);
const messageDao = new Message(dao);

function _tokenValidation(req, res, callback) {
  let token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, login.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    callback(req, res);
  });
}

/**
 * Send a message from one user to another. 
 * We support three types of messages `text`, `image` and `video` 
 */
module.exports.send = async (req, res) => {
  _tokenValidation(req, res, function (req, res) {
    userDao.isValidUserId(req.body.sender)
      .then(isValidSenderUser => {
        if (isValidSenderUser) {
          userDao.isValidUserId(req.body.recipient)
            .then(isValidRecpientUser => {
              if (isValidRecpientUser) {
                messageDao.create(req.body.sender, req.body.recipient, req.body.content.type, req.body.content.text)
                 .then(data => res.status(200).json(data));
              } else {
                res.status(404).send("Recipient user id does not exists");
            }
          });
        } else {
          res.status(404).send("Sender user id does not exists");
        }
      }
    )
  });
}

/**
 * Fetch all existing messages to a given recipient, within a range of message IDs.
 */
module.exports.get = async (req, res) => {
  _tokenValidation(req, res, function (req, res) {
    if (userDao.isValidUserId(req.body.recipient)) {
      messageDao.getByReciepentId(req.query.recipient, req.query.start, req.query.limit)
        .then(data => res.status(200).json({ messages : [data] }));
    } else {
      res.status(404).send("User id does not exists");
    }
    }
  );
};

module.exports.getAll = async (req, res) => {
  messageDao.getAll().then(data => res.status(200).json(data));
};
