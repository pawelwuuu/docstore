const express = require('express');
const mainRouter = express.Router();
const renderController = require('../controllers/renderController')

mainRouter.get('/', renderController.renderHomePage)

mainRouter.get('/document/:id', renderController.renderDocumentPage)

module.exports = mainRouter