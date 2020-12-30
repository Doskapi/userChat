const User = require('../models/user');
const DbDao = require('../db/dao');

const dao = new DbDao();
const userDao = new User(dao);

/**
 * Creates a user.
 */
module.exports.createUser = async (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    userDao.getByUsername(req.body.username)
      .then(data => {
        if(!data) {
          userDao.create(req.body.username, req.body.password)
            .then(data => {
              res.status(200).json(data);
            });
        } else {
          res.status(404).send("Username already exists");
        }
      })
  } else {
    res.status(404);
  }
}
