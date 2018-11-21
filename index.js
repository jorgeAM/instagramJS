const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));

db.authenticate()
.then(() => {
  console.log('Conexión exitosa.');
  app.listen(port, () => console.log(`App corriendo en localhost en el ${port}!`));
})
.catch(err => {
  console.error('Hubo un error al conectar:', err);
});
