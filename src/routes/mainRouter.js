const express = require('express');
const mainRouter = express.Router();
const mainController = require('../controllers/mainController');
const {ensureDocumentAccess, ensureAdminAccess} = require('../middlewares/authMiddleware');

mainRouter.get('/', mainController.homeGET);

mainRouter.get('/document/:id', mainController.documentGET);

mainRouter.get('/add-document', mainController.addDocumentGET);

mainRouter.post('/add-document', mainController.addDocumentPOST);

mainRouter.delete('/delete-document/:id', ensureDocumentAccess, mainController.documentDELETE);

mainRouter.get('/delete-document/:id', ensureDocumentAccess, mainController.documentDELETE);

mainRouter.get('/edit-document/:id', ensureDocumentAccess, mainController.editDocumentGET);

mainRouter.post('/edit-document/:id', ensureDocumentAccess, mainController.editDocumentPOST);

mainRouter.delete('/delete-user/:id', ensureAdminAccess, mainController.userDELETE);

mainRouter.get('/filter-documents', mainController.filterDocuments);

module.exports = mainRouter;