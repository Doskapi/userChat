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

  create(senderId, recipientId, type, text) {
    if (!this.content.isValidType(type)) return "error";
    return this.content.create(type, text)
      .then(data => {
        return this.dao.run(
          'INSERT INTO message (senderUserId, recipientUserId, contentTypeId, contentId) VALUES (?, ?, ?, ?)',
          [senderId, recipientId, type, data.id])
          .then(data => {
            return this.getById(data.id)
            .then(data => {
              return {'id': data.id, 'timestamp': data.Timestamp };
            })
          })
      });
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM message WHERE id = ?`,
      [id])
  }

  getByReciepentId(id, start = 0, limit = 100) {
    let sql = `SELECT * FROM message
     LEFT JOIN textMessage ON textMessage.contentId = message.contentId
     WHERE recipientUserId = ?
     AND id >= ?
     ORDER BY message.id
     LIMIT ?
    `;
    return this.dao.all(sql, [id, start, limit])
      .then(data => {
        return this._getMessage(data);
      });
  }

  _getMessage(data) {
    let messages = [];
    data.forEach(msg => {
      messages.push({
        "id": msg.id,
        "timestamp": msg.Timestamp,
        "sender": msg.senderUserId,
        "recipient": msg.recipientUserId,
        "content": {
          "type": msg.contentTypeId,
          "text": msg.data
        }
      });
    });
    return messages
  }

  getAll() {
    return this.dao.all(`SELECT * FROM message`)
  }
}

module.exports = Message;
