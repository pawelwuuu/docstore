const documentController = require('./modelControllers/documentCotroller');
const path = require('node:path');
const _fileType = import('file-type');
const allowedDocExt = require('../utils/allowedDocExt');
const _uniqueString = import('unique-string');

const validateDocumentData = async (title, description, author, fileBuffer) => {
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

    const fileType = await _fileType;
    const fileExtension = await fileType.fileTypeFromBuffer(fileBuffer);
    if (! allowedDocExt.includes("." + fileExtension.ext)) {
        errors.file = 'Ten typ pliku jest niedozwolony.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        fileExtension: fileExtension.ext,
        errors
    };
}


const homeGET = async (req, res, next) => {
    try {
        const documents = await documentController.findDocumentByFiler({
            perPage: 5,
            page: 1,
            orderType: 'desc'
        })

        res.render('home', {documents: documents});
    } catch (e) {
        next(e)
    }
};

const documentGET = async (req, res, next) => {
    try {
        const doc = await documentController.findDocumentByFiler({
            id: req.params.id,
        });

        res.render('document', {doc: doc[0]});
    } catch (e) {
        next(e)
    }
};

const addDocumentGET = async (req, res, next) => {
    try {
        res.render('add_document')
    } catch (e) {
        next(e);
    }
}

const addDocumentPOST = async (req, res, next) => {
    try {
        const {title, description, author} = req.body

        let uploadedFile = null
        if (req.files) {
            uploadedFile = req.files.documentFile;
        } else {
            res.status(422).json(
                {validationResult: "Nie udało się odebrać przesłanego pliku."}
            );
            return;
        }

        const validationResult = await validateDocumentData(title, description, author, uploadedFile.data)
        if (validationResult.isValid === true) {
            const uniqueString = await _uniqueString;
            const uniqueFilename = uniqueString.default()
            await uploadedFile.mv(path.join(__dirname, '..', '..', 'public', 'uploads', uniqueFilename));

            const document = {
                user_id: res.locals.user.id,
                title,
                description,
                author,
                filename: uniqueFilename,
                file_ext: validationResult.fileExtension
            }
            await documentController.createDocument(document);



            res.json(validationResult);
        } else {
            res.status(422).json(validationResult)
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {homeGET, documentGET, addDocumentGET, addDocumentPOST}