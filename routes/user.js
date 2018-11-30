const express = require('express');
const bcrypt = require('bcrypt');
const multipart = require('connect-multiparty');

const User = require('../models/user');
const Publication = require('../models/publication');
const deleteImage = require('../services/deleteImage');
const jwt = require('../services/jwt');
const jwtMiddleware = require('../middlewares/JwtMiddleware');

const app = express.Router();
const multipartMiddleware = multipart({
  uploadDir: './upload/users',
});

app.get('/users', jwtMiddleware, async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.get('/users/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: { id },
    });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    const publications = await Publication.findAll({
      where: { userId: id },
    });

    if (publications.length <= 0) {
      res.status(200).json({ user });
    } else {
      res.status(200).json({ user, publications });
    }
  } catch (err) {
    res.status(500).json({ err });
  }
});

app.post('/sign-in', async (req, res) => {
  const { body } = req;
  try {
    if (body.password.length <= 0 || body.password.length < 6) {
      res.status(400).json({ err: 'Tu contraseña debe tener como minimo 6 caracteres' });
      return;
    }

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

app.put('/users/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  if (req.auth.id != id) {
    return res.status(401).json({ message: 'solo puedes actualizar tus propios datos' });
  }

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

app.post('/users/:id/upload', [jwtMiddleware, multipartMiddleware], async (req, res) => {
  const { id } = req.params;
  if (req.files) {
    const type = req.files.avatar.type;
    const file = req.files.avatar.path.split('/')[2];
    if (req.auth.id != id) {
      deleteImage('users', file);
      return res.status(401).json({ message: 'solo puedes actualizar tus propios datos' });
    }

    if (type == 'image/jpeg' || type == 'image/png') {
      try {
        const user = await User.findOne({
          where: { id },
        });
        if (!user) {
          deleteImage('users', file);
          return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if (user.avatar) {
          deleteImage('users', user.avatar);
        }

        user.avatar = file;
        const updatedUser = await user.save();
        res.status(200).json({ user: updatedUser });
      } catch (err) {
        deleteImage('users', file);
        res.status(500).json({ err });
      }
    } else {
      deleteImage('users', file);
      res.status(400).json({ message: 'Solo puede subir archivos JPG o PNG' });
    }
  } else {
    res.status(400).json({ message: 'Sube una imagen' });
  }
});

app.post('/login', async (req, res) => {
  const { body } = req;
  try {
    const user = await User.findOne({
      where: { email: body.email },
    });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no esta registrado' });
    }

    let check = bcrypt.compareSync(body.password, user.password);
    if (check) {
      let token = jwt.getToken(user);
      return res.status(200).json({ token, user });
    } else return res.status(400).json({ message: 'Contraseña incorrecta' });

  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = app;
