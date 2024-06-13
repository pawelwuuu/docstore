const userController = require('../controllers/modelControllers/userController');
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


module.exports = {signInUser}