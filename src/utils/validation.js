const userController = require("../controllers/modelControllers/userController");
const passwordOperations = require("./passwordOperations");
const _fileType = import('file-type');
const allowedDocExt = require("./allowedDocExt");

const validateAddDocData = async (title, description, author, category, fileBuffer) => {
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Tytuł jest wymagany i musi być tekstem.';
    } else if (title.length > 255) {
        errors.title = 'Tytuł nie może być dłuższy niż 255 znaków.';
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.description = 'Opis jest wymagany i musi być tekstem.';
    } else if (description.length > 1000) {
        errors.description = 'Opis nie może być dłuższy niż 1000 znaków.';
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
        errors.author = 'Autor jest wymagany i musi być tekstem.';
    } else if (author.length > 255) {
        errors.author = 'Autor nie może być dłuższy niż 255 znaków.';
    }

    if (!category) {
        errors.category = 'Należy wybrać przynajmniej jedną kategorie';
    }

    const fileType = await _fileType;
    const fileExtension = await fileType.fileTypeFromBuffer(fileBuffer);
    if (! allowedDocExt.includes("." + fileExtension.ext)) {
        errors.file = 'Ten typ pliku jest niedozwolony.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        fileExtension: fileExtension?.ext,
        errors
    };
}

const validateEditDocData = async (title, description, author, category, fileBuffer) => {
    const errors = {};

    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Tytuł jest wymagany i musi być tekstem.';
    } else if (title.length > 255) {
        errors.title = 'Tytuł nie może być dłuższy niż 255 znaków.';
    }

    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.description = 'Opis jest wymagany i musi być tekstem.';
    } else if (description.length > 1000) {
        errors.description = 'Opis nie może być dłuższy niż 1000 znaków.';
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
        errors.author = 'Autor jest wymagany i musi być tekstem.';
    } else if (author.length > 60) {
        errors.author = 'Autor nie może być dłuższy niż 60 znaków.';
    }

    if (!category) {
        errors.category = 'Należy wybrać przynajmniej jedną kategorie';
    }

    let fileExtension;
    if (fileBuffer) {
        const fileType = await _fileType;
        fileExtension = await fileType.fileTypeFromBuffer(fileBuffer);
        if (! allowedDocExt.includes("." + fileExtension.ext)) {
            errors.file = 'Ten typ pliku jest niedozwolony.';
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        fileExtension: fileExtension?.ext || null,
        errors
    };
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

const validateLoginData = async (login, password) => {
    const user = await userController.findUserByLogin(login);

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

module.exports = {validateEditDocData, validateAddDocData, validateLoginData, validateRegisterData};