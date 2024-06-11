const passwordOperations = require('../utils/passwordOperations');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const {validatePassword, checkPassword} = require("../utils/passwordOperations");

const createToken = async (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: parseInt(process.env.JWT_EXPIRE_TIME) || 86400
    });
}

const validateRegisterData = async (username, email, password) => {
    // walidacja nicku
    if (! (/^[a-zA-Z0-9_]{3,20}$/).test(username)) {
        return "Nazwa jest zbyt krótka lub zawiera niedozwolone znaki.";
    }
    if (await userController.findUserByUsername(username)) {
        return "Ta nazwa użytkownika jest już zajęta.";
    }

    // walidacja maila
    if (! email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
        return "Niepoprawny format email.";
    }
    if (await userController.findUserByEmail(email)) {
        return "Konto o podanym mailu istnieje już w serwisie.";
    }

    // haslo
    if (! await passwordOperations.validatePassword(password)) {
        return "Hasło nie spełnia wymogów";
    }

    return true;
}

const validateLoginData = async (email, password) => {
    const user = await userController.findUserByEmail(email);

    if (user) {
        if(await passwordOperations.checkPassword(password, user.password)) {
            return true;
        } else {
            return 'Hasło niepoprawne.'
        }

    } else {
        return 'Użytkownik o podanym mailu nie istnieje.';
    }
}

const registerGet = async (req, res, next) => {
    try {
        res.render('register');
    } catch (e) {
        next(e);
    }
}

const registerPost = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

        const validateResult = await validateRegisterData(username, email, password);
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
        res.render('login');
    } catch (e) {
        next(e);
    }
}

const loginPost = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const validateResult = await validateLoginData(email, password);
        if (validateResult === true) {
            const user = await userController.findUserByEmail(email);

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