const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const app = express.Router();

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post('/sign-in', async (req, res) => {
  const { body } = req;
  if (body.password.length <= 0 || body.password.length < 6) {
    res.status(400).json({ err: 'Tu contraseña debe tener como minimo 6 caracteres' });
    return;
  }

  try {
    const user = await User.create({
      name: body.name,
      lastname: body.lastname,
      nickname: body.nickname,
      birthday: body.birthday,
      email: body.email,
      password: bcrypt.hashSync(body.password, 10),
    });

    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    user.name = body.name;
    user.lastname = body.lastname;
    user.email = body.email;
    user.nickname = body.nickname;
    const updatedUser = await user.save();
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    user.destroy();
    res.status(200).json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = app;
