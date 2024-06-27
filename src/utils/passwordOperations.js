const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS))
    } catch (e) {
        throw e;
    }
}

const checkPassword = async (passwordPlain, passwordHash) => {
    try {
        return await bcrypt.compare(passwordPlain, passwordHash)
    } catch (e) {
        throw e;
    }
}

const validatePassword = async (p) => {
    if (p.length < 8) {
        return false;
    }
    if (p.length > 40) {
        return false;
    }

    if (p.search(/[a-z]/i) < 0) {
        return false;
    }
    if (p.search(/[0-9]/) < 0) {
        return false;
    }
    if (p.search(/[A-Z]/) < 0) {
        return false;
    }

    return true;
}

module.exports = {hashPassword, checkPassword, validatePassword}