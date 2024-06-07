const express = require('express');
const generalRouter = express.Router();
const renderController = require('../controllers/renderController')

generalRouter.get('/', renderController.renderHomePage)

generalRouter.get('/document/:id', renderController.renderDocumentPage)

module.exports = generalRouter