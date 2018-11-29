const express = require('express');
const userRoutes = require('./user');
const publicationRoutes = require('./publication');

const app = express.Router();

app.use(userRoutes);
app.use(publicationRoutes);

module.exports = app;
