const login = require('../models/login');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DbDao = require('../db/dao');

const dao = new DbDao();
const userDao = new User(dao);

/**
/**
 * Login allows the user to authenticate with credentials 
 * and get a token to use on secured endpoints. 
 */
module.exports.login = (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    userDao.getByUsernameAndPassword(req.body.username, req.body.password)
      .then(data => {
        if (data && data.id) {
          var token = jwt.sign(
            { id: data.id },
            login.secret,
            { expiresIn: 86400 } // 24 hours alive
          );
          res.status(200).json({ id: data.id, token: token });
        } else {
          res.status(500).send("User and password does not match.");
        }
      });
  } else {
    res.status(500).send("There was a problem login in with the user.");
  }
};
