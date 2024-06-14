const passwordOperations = require('../utils/passwordOperations');
const userController = require('./modelControllers/userController');
const jwt = require('jsonwebtoken');
const validation = require('../utils/validation');

const createToken = async (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRE_TIME) || 86400
    });
}

const registerGet = async (req, res, next) => {
    try {
        res.render('auth/register');
    } catch (e) {
        next(e);
    }
}

const registerPost = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const validateResult = await validation.validateRegisterData(username, email, password);
        if (validateResult === true) {
            const userId = await userController.createUser(
                {
                    username: username,
                    email: email,
                    password: await passwordOperations.hashPassword(password)
                });

            res.cookie('jwt', await createToken(userId[0]), {httpOnly:true, maxAge: parseInt(process.env.JWT_EXPIRE_TIME) * 1000 || 86400000});
            res.status(201).json({
                user: userId[0],
            })
        } else {
            res.status(422).json({
                validateResult
            })
        }
    } catch (e) {
        next(e);
    }
}

const loginGet = async (req, res, next) => {
    try {
        res.render('auth/login');
    } catch (e) {
        next(e);
    }
}

const loginPost = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const validateResult = await validation.validateLoginData(email, password);
        if (validateResult === true) {
            const user = await userController.findUserByLogin(email);

            res.cookie('jwt', await createToken(user.id), {httpOnly:true, maxAge: parseInt(process.env.JWT_EXPIRE_TIME) * 1000 || 86400000});
            res.status(201).json({
                user: user.id,
            })
        } else {
            res.status(422).json({
                validateResult
            });
        }
    } catch (e) {
        next(e);
    }
}

const logoutGet = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (token) {
            res.cookie('jwt', 'logoutValue', {maxAge: 1});

            res.status(200).redirect('/');
        } else {
            throw new Error("cannot logout user, no jwt token found");
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {loginGet, loginPost, registerGet, registerPost, logoutGet};