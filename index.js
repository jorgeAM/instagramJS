const express = require('express');
const bodyParser = require('body-parser');
const program = require('commander');

const db = require('./db/db');
const config = require('./config/config');
const migration = require('./migrations/migration');
const routes = require('./routes');

const app = express();

program
  .version('0.1.0')
  .option('-m, --migrate', 'Realizar migraciones')
  .parse(process.argv);

if (program.migrate) migration();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);
app.get('/', (req, res) => res.send('Hello World!'));

db.authenticate()
.then(() => {
  console.log('Conexión exitosa.');
  app.listen(config.app.port, () => {
    console.log(`App corriendo en localhost en el ${config.app.port}!`);
  });
})
.catch(err => {
  console.error('Hubo un error al conectar:', err);
});
