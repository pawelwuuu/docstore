const userController = require('../controllers/modelControllers/userController');
const documentController = require('../controllers/modelControllers/documentCotroller');
const jwt = require('jsonwebtoken');
const signInUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next(err);
            } else {
                let user = await userController.findUserByID(decodedToken.id);
                delete user?.password;

                res.locals.user = user;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};

const ensureDocumentAccess = async (req, res, next) => {
    try {
        const documentId = req.params.id;
        const document = await documentController.findDocumentByID(documentId);
        if (res.locals.user && res.locals.user.id === document.user_id) {
            next()
        } else {
            const err = new Error("Brak dostępu.");
            err.userMsg = "Brak dostępu, zaloguj się aby rozwiązać ten problem."

            throw err;
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {signInUser, ensureDocumentAccess}