const express = require('express');
const apiRouter = express.Router();
const path = require('node:path');
const apiController = require(path.join(__dirname, '..', 'controllers', 'apiController'))


apiRouter.get('/documents', apiController.documentsApi);

apiRouter.get('/documents/:id', apiController.documentByIdApi)

module.exports = apiRouter