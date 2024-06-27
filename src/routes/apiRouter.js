const express = require('express');
const apiRouter = express.Router();
const path = require('node:path');
const apiController = require(path.join(__dirname, '..', 'controllers', 'apiController'))


apiRouter.get('/api/documents', apiController.documentsApi);

apiRouter.get('/api/document/:id', apiController.documentByIdApi);

apiRouter.get('/api/categories', apiController.categoriesApi);

apiRouter.get('/api/categories/:id', apiController.categoryByIdApi);

module.exports = apiRouter