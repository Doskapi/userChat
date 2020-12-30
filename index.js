const express = require('express');
const bodyParser = require('body-parser');

const userController = require('./controllers/user.controller');
const healthController = require('./controllers/health.controller');
const authController = require('./controllers/auth.controller');
const msgController = require('./controllers/message.controller');

const DbDao = require('./db/dao');
const User = require('./models/user');
const dao = new DbDao();
const user = new User(dao);
user.createTable()
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post('/check', healthController.check);
app.post('/user',  userController.createUser);
app.post('/login', authController.login);

// TODO: these endpoints should be secured
app.post('/messages', msgController.send);
app.get('/messages',  msgController.get);

// extra apis to see data
app.get('/user',  userController.getAll);
app.listen(port, () => {
  console.log(`ASAPP Challenge app running on port http://localhost:${port}`);
});
