const express = require('express');
const profileRouter = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const profileController = require('../controllers/profileController');

profileRouter.get('/profile/:id', authMiddleware.ensureProfileAccess, profileController.userProfileGET);

profileRouter.post('/delete-profile/:id', authMiddleware.ensureProfileAccess, profileController.userProfileDELETE);

module.exports = profileRouter;