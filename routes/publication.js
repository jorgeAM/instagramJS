const express = require('express');
const multipart = require('connect-multiparty');

const Publication = require('../models/publication');
const deleteImage = require('../services/deleteImage');
const jwtMiddleware = require('../middlewares/JwtMiddleware');

const app = express.Router();
const multipartMiddleware = multipart({
  uploadDir: './upload/publications',
});

app.get('/publications', jwtMiddleware, async (req, res) => {
  try {
    const publications = await Publication.findAll();
    res.status(200).json({ publications });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.get('/publications/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    res.status(200).json({ publication });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post('/publications', jwtMiddleware, async (req, res) => {
  const { body } = req;
  try {
    const publication = await Publication.create({
      body: body.body,
      userId: req.auth.id,
    });

    res.status(201).json({ publication });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.put('/publications/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    if (publication.userId !== req.auth.id) {
      return res.status(401).json({ message: 'Esta publicación no es tuya' });
    }

    publication.body = body.body;
    const updatedPublication = await publication.save();
    res.status(200).json({ publication: updatedPublication });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.delete('/publications/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    if (publication.userId !== req.auth.id) {
      return res.status(401).json({ message: 'Esta publicación no es tuya' });
    }

    publication.destroy();
    res.status(200).json({ message: 'Publicación eliminada' });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = app;
