const express = require('express');

const Publication = require('../models/publication');
const Comment = require('../models/comment');
const jwtMiddleware = require('../middlewares/JwtMiddleware');

const app = express.Router();

app.get('/publications/:id/comments', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    const comments = await Comment.findAll({
      where: { publicationId: id },
    });
    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post('/publications/:id/comments', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    const comment = await Comment.create({
      body: body.body,
      userId: req.auth.id,
      publicationId: id,
    });
    res.status(200).json({ comment });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.put('/publications/:id/comments/:commentId', jwtMiddleware, async (req, res) => {
  const { id, commentId } = req.params;
  const { body } = req;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    const comment = await Comment.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      return res.status(400).json({ message: 'Comentario no encontrado' });
    }

    if (comment.userId !== req.auth.id) {
      return res.status(401).json({ message: 'Este comentario no es tuyo' });
    }

    comment.body = body.body;
    const updatedComment = await comment.save();
    res.status(200).json({ comment: updatedComment });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.delete('/publications/:id/comments/:commentId', jwtMiddleware, async (req, res) => {
  const { id, commentId } = req.params;
  try {
    const publication = await Publication.findOne({
      where: { id },
    });
    if (!publication) {
      return res.status(400).json({ message: 'Publicación no encontrada' });
    }

    const comment = await Comment.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      return res.status(400).json({ message: 'Comentario no encontrado' });
    }

    if (comment.userId !== req.auth.id) {
      return res.status(401).json({ message: 'Este comentario no es tuyo' });
    }

    comment.destroy();
    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = app;
