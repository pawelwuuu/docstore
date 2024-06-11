const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController')

authRouter.get('/login', authController.loginGet);

authRouter.get('/register', authController.registerGet)

authRouter.post('/login', authController.loginPost);

authRouter.post('/register', authController.registerPost)

authRouter.get('/logout', authController.logoutGet)

module.exports = authRouter