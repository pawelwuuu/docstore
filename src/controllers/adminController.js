const documentController = require('./modelControllers/documentCotroller');
const userController = require('./modelControllers/userController');
const categoriesController = require('./modelControllers/categoryController');

const adminDocumentsGET = async (req, res, next) => {
    try {
        const documents = await documentController.findAllDocuments()

        res.render('admin/documents', {documents})
    } catch (e) {
        next(e);
    }
}

const adminUsersGET = async (req, res, next) => {
    try {
        const users = await userController.findAllUsers();

        res.render('admin/users', {users})
    } catch (e) {
        next(e);
    }
}

const adminCategoriesGET = async (req, res, next) => {
    try {
        const categories = await categoriesController.findAllCategories();

        res.render('admin/categories', {categories})
    } catch (e) {
        next(e);
    }
}

const adminBanUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const banUser = {is_banned: 1}

        const result = await userController.updateUser(banUser, userId);
        if (result === true) {
            res.redirect('/admin/users');
        } else {
            const err = new Error();
            err.userMsg = "Nie można zablokować tego użytkownika.";
            throw err;
        }
    } catch (e) {
        next(e);
    }
}

const adminUnbanUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const banUser = {is_banned: 0}

        const result = await userController.updateUser(banUser, userId);
        if (result === true) {
            res.redirect('/admin/users');
        } else {
            const err = new Error();
            err.userMsg = "Nie można odblokować tego użytkownika.";
            throw err;
        }
    } catch (e) {
        next(e);
    }
}

const grantAdmin = async (req,res,next) => {
    try {
        const userId = req.params.id;

        if(await userController.updateUser({is_admin: 1}, userId)) {
            res.redirect('/admin/users');
        } else {
            const err = new Error();
            err.userMsg = "Nie można nadać uprawnienia.";
            throw err;
        }

    } catch (e) {
        next(e)
    }
}

const revokeAdmin = async (req,res,next) => {
    try {
        const userId = req.params.id;

        if(await userController.updateUser({is_admin: 0}, userId)) {
            res.redirect('/admin/users');
        } else {
            const err = new Error();
            err.userMsg = "Nie można odebrać uprawnienia.";
            throw err;
        }

    } catch (e) {
        next(e)
    }
}

const categoryPOST = async (req,res,next) => {
    try {
        const {category_name} = req.body;

        if (await categoriesController.createCategory({category_name})) {
            res.redirect('/admin/categories');
        } else {
            const err = new Error();
            err.userMsg = 'Nie można dodać kategorii.'
            throw err;
        }
    } catch (e) {
        next(e)
    }
}

const categoryDELETE = async (req,res,next) => {
    try {
        const categoryId = req.params.id;

        if (await categoriesController.deleteCategory(categoryId)) {
            res.redirect('/admin/categories');
        } else {
            const err = new Error();
            err.userMsg = 'Nie można usunąć kategorii.'
            throw err;
        }
    } catch (e) {
        next(e)
    }
}



module.exports = {adminDocumentsGET, adminUsersGET, adminCategoriesGET,
    adminBanUser, adminUnbanUser, grantAdmin, revokeAdmin, categoryPOST, categoryDELETE};