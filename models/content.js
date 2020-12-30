
const TEXT_TYPE = "text";
const IMAGE_TYPE = "image";
const VIDEO_TYPE = "video";

class MessageContent {

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
      metadata TEXT,
      FOREIGN KEY(contentId) REFERENCES content(id)
    )`;

    let createImageMessageTable = `CREATE TABLE IF NOT EXISTS imageMessage (
      contentId ID,
      data TEXT,
      metadata TEXT,
      FOREIGN KEY(contentId) REFERENCES content(id)
    )`;

    this.dao.run(createContentTable)
      .then(() => this.dao.run(createTextMessageTable))
      .then(() => this.dao.run(createVideoMessageTable))
      .then(() => this.dao.run(createImageMessageTable));
  }

  create(type, text) {
    return this.dao.run('INSERT INTO content VALUES (NULL)')
      .then(data => {
        if (data && data.id) {
          return this.dao.run('INSERT INTO textMessage (contentId, data) VALUES (?,?)',
          [data.id, text])
        }
      });
  }

  isValidType(type) {
    return this.validTypes.includes(type);
  }
}

module.exports = MessageContent;
