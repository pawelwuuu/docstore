const express = require('express');
const mainRouter = express.Router();
const mainController = require('../controllers/mainController');

mainRouter.get('/', mainController.homeGET);

mainRouter.get('/document/:id', mainController.documentGET);

mainRouter.get('/add-document', mainController.addDocumentGET);

mainRouter.post('/add-document', mainController.addDocumentPOST);

module.exports = mainRouter;