const express = require('express');
const userRoutes = require('./user');
const publicationRoutes = require('./publication');
const commentRoutes = require('./comment');

const app = express.Router();

app.use(userRoutes);
app.use(publicationRoutes);
app.use(commentRoutes);

module.exports = app;
