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


                if (user?.is_banned === 0) {
                    res.locals.user = user;
                    next();
                } else if (user?.is_banned === 1){
                    const error = new Error();
                    error.userMsg = 'Twoje konto jest zablokowane.';
                    next(error)
                } else {
                    console.log('Token is broken, user logged out');
                    res.cookie('jwt', 'logoutValue', {maxAge: 1});
                    res.redirect('/login');
                }
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
        if (res.locals.user && res.locals.user.id === document.user_id || res.locals.user.is_admin === 1) {
            next()
        } else {
            const err = new Error("Brak dostępu.");
            err.userMsg = "Brak dostępu, zaloguj się aby rozwiązać ten problem.";

            throw err;
        }
    } catch (e) {
        next(e);
    }
}

const ensureAdminAccess = async  (req, res, next) => {
    try {
        const loggedUser = res.locals.user
        if (loggedUser?.is_admin === 1) {
            next();
        } else {
            const err = new Error("Brak dostępu.");
            err.userMsg = "Brak dostępu, zaloguj się aby rozwiązać ten problem.";

            throw err;
        }
    } catch (e) {
        next(e);
    }
}

const requireLogin = async  (req, res, next) => {
    try {
        const loggedUser = res.locals.user
        if (loggedUser) {
            next();
        } else {
            const err = new Error("Brak dostępu.");
            err.userMsg = "Brak dostępu, zaloguj się aby rozwiązać ten problem.";

            throw err;
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {signInUser, ensureDocumentAccess, ensureAdminAccess, requireLogin}