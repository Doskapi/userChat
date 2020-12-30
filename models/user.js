var md5 = require('md5')

class User {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT)`
    return this.dao.run(sql)
  }

  create(username, password) {
    return this.dao.run(
      'INSERT INTO user (username, password) VALUES (?, ?)',
      [username, md5(password)])
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM user WHERE id = ?`,
      [id]
    )
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM user WHERE id = ?`,
      [id])
  }

  isValidUserId(id) {
    return this.getById(id);
  }

  getAll() {
    return this.dao.all(`SELECT * FROM user`)
  }

  getByUsername(username) {
    return this.dao.get(
      `SELECT * FROM user WHERE username = (?)`,
      [username])
  }

  getByUsernameAndPassword(username, password) {
    return this.dao.get(
      `SELECT * FROM user WHERE username = (?) AND password = (?)`,
      [username, md5(password)])
  }
}

module.exports = User;
