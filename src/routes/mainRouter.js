const express = require('express');
const mainRouter = express.Router();
const mainController = require('../controllers/mainController');
const ensureDocAccess = require('../middlewares/ensureDocumentAccess');

mainRouter.get('/', mainController.homeGET);

mainRouter.get('/document/:id', mainController.documentGET);

mainRouter.get('/add-document', mainController.addDocumentGET);

mainRouter.post('/add-document', mainController.addDocumentPOST);

mainRouter.delete('/delete-document/:id', ensureDocAccess, mainController.documentDELETE)

mainRouter.get('/edit-document/:id', ensureDocAccess, mainController.editDocumentGET)

mainRouter.post('/edit-document/:id', ensureDocAccess, mainController.editDocumentPOST)

module.exports = mainRouter;