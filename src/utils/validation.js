const userController = require("../controllers/modelControllers/userController");
const passwordOperations = require("./passwordOperations");
const _fileType = import('file-type');
const allowedDocExt = require("./allowedDocExt");
const commentsController = require('../controllers/modelControllers/commentsController');

const validateTitle = (title, errors) => {
    if (!title || typeof title !== 'string' || title.trim() === '') {
        errors.title = 'Tytuł jest wymagany i musi być tekstem.';
    } else if (title.length > 255) {
        errors.title = 'Tytuł nie może być dłuższy niż 255 znaków.';
    }
};

const validateDescription = (description, errors) => {
    if (!description || typeof description !== 'string' || description.trim() === '') {
        errors.description = 'Opis jest wymagany i musi być tekstem.';
    } else if (description.length > 1000) {
        errors.description = 'Opis nie może być dłuższy niż 1000 znaków.';
    }
};

const validateAuthor = (author, errors, maxLength = 255) => {
    if (!author || typeof author !== 'string' || author.trim() === '') {
        errors.author = 'Autor jest wymagany i musi być tekstem.';
    } else if (author.length > maxLength) {
        errors.author = `Autor nie może być dłuższy niż ${maxLength} znaków.`;
    }
};

const validateCategory = (category, errors) => {
    if (!category || category.length === 0) {
        errors.category = 'Należy wybrać przynajmniej jedną kategorię.';
    }
};

const validateFile = async (fileBuffer, errors) => {
    const fileType = await _fileType;
    const fileExtension = await fileType.fileTypeFromBuffer(fileBuffer);
    if (!allowedDocExt.includes("." + fileExtension.ext)) {
        errors.file = 'Ten typ pliku jest niedozwolony.';
    }
    return fileExtension?.ext;
};

const validateComment = async (userId, documentId, content) => {
    const errors = {};

    const userCommentsDocCount = await commentsController.countUserDocumentComments(userId, documentId);
    if (userCommentsDocCount.comments_count > 1) {
        errors.alreadyCommented = 'Możesz dodać maksymalnie jeden komentarz do każdego dokumentu.';
    }

    if (content.trim() === '') {
        errors.content = 'Komentarz nie może być pusty.';
    }

    if (content.trim() > 500) {
        errors.content = 'Komentarz nie może mieć więcej niż 500 znaków.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

const validateAddDocData = async (title, description, author, category, fileBuffer) => {
    const errors = {};

    validateTitle(title, errors);
    validateDescription(description, errors);
    validateAuthor(author, errors);
    validateCategory(category, errors);

    const fileExtension = await validateFile(fileBuffer, errors);

    return {
        isValid: Object.keys(errors).length === 0,
        fileExtension,
        errors
    };
};

const validateEditDocData = async (title, description, author, category, fileBuffer) => {
    const errors = {};

    validateTitle(title, errors);
    validateDescription(description, errors);
    validateAuthor(author, errors, 60);
    validateCategory(category, errors);

    let fileExtension = null;
    if (fileBuffer) {
        fileExtension = await validateFile(fileBuffer, errors);
    }

    return {
        isValid: Object.keys(errors).length === 0,
        fileExtension,
        errors
    };
};


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
        return 'Użytkownik o podanym loginie nie istnieje.';
    }
}

module.exports = {validateEditDocData, validateAddDocData, validateLoginData, validateRegisterData, validateComment};