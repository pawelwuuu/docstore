const express = require('express');
const apiRouter = express.Router();
const path = require('node:path');
const apiController = require(path.join(__dirname, '..', 'controllers', 'apiController'))


apiRouter.get('/api/documents', apiController.documentsApi);

apiRouter.get('/api/documents/:id', apiController.documentByIdApi)

module.exports = apiRouter