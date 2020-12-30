
const TEXT_TYPE = "text";
const IMAGE_TYPE = "image";
const VIDEO_TYPE = "video";

class MessageContent {
  // eventually we can create different childs of this class for each of the types presented
  // this childs will handle the different values or metadata

  constructor(dao) {
    this.dao = dao;
    this.validTypes = [TEXT_TYPE, IMAGE_TYPE, VIDEO_TYPE];
  }

  createTables() {
    let createContentTable = `CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY AUTOINCREMENT
      )`;
      
    let createTextMessageTable = `CREATE TABLE IF NOT EXISTS textMessage (
      contentId ID,
      data TEXT,
      FOREIGN KEY(contentId) REFERENCES content(id)
    )`;

    let createVideoMessageTable = `CREATE TABLE IF NOT EXISTS videoMessage (
      contentId ID,
      data TEXT,
      FOREIGN KEY(contentId) REFERENCES content(id)
    )`;

    let createImageMessageTable = `CREATE TABLE IF NOT EXISTS imageMessage (
      contentId ID,
      data TEXT,
      FOREIGN KEY(contentId) REFERENCES content(id)
    )`;

    this.dao.run(createContentTable)
      .then(() => this.dao.run(createTextMessageTable))
      .then(() => this.dao.run(createVideoMessageTable))
      .then(() => this.dao.run(createImageMessageTable));
  }

  create(type, data) {
    return this.dao.run('INSERT INTO content VALUES (NULL)')
      .then(() => this.dao.get('SELECT * FROM content ORDER BY id DESC LIMIT 1'))
      .then(content => {
        if (content && content.id) {
          let sql = 'INSERT INTO ' + this._getTableNameByType(type) + ' (contentId, data) VALUES (?,?)';
          return this.dao.run(sql, [content.id, data])
            .then(() => { return content.id })
        }
      });
  }

  _getTableNameByType(type) {
    switch (type) {
      case IMAGE_TYPE:
        return 'imageMessage';
      case VIDEO_TYPE:
        return 'videoMessage';
      default: // TEXT_TYPE
        return 'textMessage';
      }
  }

  getById(id, type) {
    return this.dao.get(
      'SELECT * FROM ' + this._getTableNameByType(type)  + ' WHERE contentId = ?',
      [id])
  }

  isValidType(type) {
    return this.validTypes.includes(type);
  }
}

module.exports = MessageContent;
