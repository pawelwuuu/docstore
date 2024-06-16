const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controllers/adminController')

adminRouter.get('/admin', (req, res) => {
    res.redirect('/admin/documents')
})

adminRouter.get('/admin/documents', adminController.adminDocumentsGET);

adminRouter.get('/admin/users', adminController.adminUsersGET);

adminRouter.get('/admin/categories', adminController.adminCategoriesGET);

adminRouter.get('/admin/ban/:id', adminController.adminBanUser);

adminRouter.get('/admin/unban/:id', adminController.adminUnbanUser);

adminRouter.get('/admin/grant/:id', adminController.grantAdmin);

adminRouter.get('/admin/revoke/:id', adminController.revokeAdmin);

adminRouter.post('/admin/add-category', adminController.categoryPOST);

adminRouter.delete('/admin/delete-category/:id', adminController.categoryDELETE);

module.exports = adminRouter;