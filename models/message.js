const Content = require('./content');

class Message {

  constructor(dao) {
    this.dao = dao;
    this.content = new Content(dao);
    this.createTables
  }

  createTables() {
    this.content.createTables();
    this._createMessageTable();
  }

  _createMessageTable() {
    const sql = `CREATE TABLE IF NOT EXISTS message (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      senderUserId ID,
      recipientUserId ID,
      contentTypeId TEXT,
      contentId ID,
      FOREIGN KEY(senderUserId) REFERENCES user(id),
      FOREIGN KEY(recipientUserId) REFERENCES user(id),
      FOREIGN KEY(contentId) REFERENCES content(id),
      FOREIGN KEY(contentTypeId) REFERENCES contentType(id)
      )`;
    return this.dao.run(sql);
  }


  getById(id) {
    return this.dao.get(
      `SELECT * FROM message WHERE id = ?`,
      [id])
  }
  getAll() {
    return this.dao.all(`SELECT * FROM message`)
  }
}

module.exports = Message;
