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
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      senderUserId ID,
      recipientUserId ID,
      contentType TEXT,
      contentId ID,
      FOREIGN KEY(senderUserId) REFERENCES user(id),
      FOREIGN KEY(recipientUserId) REFERENCES user(id),
      FOREIGN KEY(contentId) REFERENCES content(id)
      )`;
    return this.dao.run(sql);
  }

  create(senderId, recipientId, type, text) {
    return this.content.create(type, text)
      .then(data => {
        return this.dao.run(
          'INSERT INTO message (senderUserId, recipientUserId, contentType, contentId) VALUES (?, ?, ?, ?)',
          [senderId, recipientId, type, data])
          .then(data => {
            return this.getById(data.id)
            .then(data => {
              return {'id': data.id, 'timestamp': data.timestamp };
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
    // we could improve this query, creating the different childs of content
    let sql = `SELECT message.*, COALESCE(textMessage.data, imageMessage.data, videoMessage.data) AS data FROM message
     LEFT JOIN textMessage ON textMessage.contentId = message.contentId
     LEFT JOIN imageMessage ON imageMessage.contentId = message.contentId
     LEFT JOIN videoMessage ON videoMessage.contentId = message.contentId
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
        "timestamp": msg.timestamp,
        "sender": msg.senderUserId,
        "recipient": msg.recipientUserId,
        "content": {
          "type": msg.contentType,
          "text": msg.data
        }
      });
    });
    return messages
  }

  getAll() {
    return this.dao.all(`
    SELECT 
    message.*,
    textMessage.data as textdata,
    imageMessage.data as imagedata,
    videoMessage.data as videodata
     FROM message
    LEFT JOIN textMessage ON textMessage.contentId = message.contentId
    LEFT JOIN imageMessage ON imageMessage.contentId = message.contentId
    LEFT JOIN videoMessage ON videoMessage.contentId = message.contentId
    `)
  }
}

module.exports = Message;
