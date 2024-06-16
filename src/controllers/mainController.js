const documentController = require('./modelControllers/documentCotroller');
const categoryController = require('./modelControllers/categoryController');
const documentCategoryController = require('./modelControllers/documentsCategoryController');
const path = require('node:path');
const _uniqueString = import('unique-string');
const validation = require('../utils/validation');
const filleOperations = require('../utils/fileOperations');

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

        res.render('document/document', {doc: doc[0]});
    } catch (e) {
        next(e)
    }
};

const addDocumentGET = async (req, res, next) => {
    try {
        const categories = await categoryController.findAllCategories();

        res.render('document/add_document', {categories})
    } catch (e) {
        next(e);
    }
}

const addDocumentPOST = async (req, res, next) => {
    try {
        let {title, description, author, category} = req.body
        category = category ? [...category] : [];

        let uploadedFile = null
        if (req.files) {
            uploadedFile = req.files.documentFile;
        } else {
            res.status(422).json(
                {validationResult: "Nie udało się odebrać przesłanego pliku."}
            );
            return;
        }

        const validationResult = await validation.validateAddDocData(title, description, author, category, uploadedFile.data)
        if (validationResult.isValid === true) {
            const uniqueString = await _uniqueString;
            const uniqueFilename = `${uniqueString.default()}.${validationResult.fileExtension}`;
            await uploadedFile.mv(path.join(__dirname, '..', '..', 'public', 'uploads', uniqueFilename));

            const document = {
                user_id: res.locals.user.id,
                title,
                description,
                author,
                filename: uniqueFilename,
                file_ext: validationResult.fileExtension
            }
            await documentController.createDocument(document, category);

            res.json(validationResult);
        } else {
            res.status(422).json(validationResult)
        }
    } catch (e) {
        next(e);
    }
}

const documentDELETE = async (req,res,next) => {
    try {
        const documentId = req.params.id;
        const originalDocument = await documentController.findDocumentByID(documentId);

        const result = await documentController.deleteDocument(documentId);
        if (result === true) {
            res.send('Dokument został usunięty.')

            await filleOperations.moveFile(
                path.join(__dirname, '..', '..', 'public', 'uploads', originalDocument.filename),
                path.join(__dirname, '..', '..', 'data', 'archives', originalDocument.filename)
            );
        }
    } catch (e) {
        next(e)
    }
}

const editDocumentGET = async (req,res,next) => {
    try {
        const categories = await categoryController.findAllCategories();
        const documentId = req.params.id;
        const document = await documentController.findDocumentByID(documentId);
        const documentCategories = await documentCategoryController.findDocumentCategory(documentId);
        const documentCategoriesValues = [];
        documentCategories.forEach(docCategory => {
            documentCategoriesValues.push(docCategory.category_id);
        });

        res.render('document/edit_document', {categories, document, documentCategories: documentCategoriesValues})
    } catch (e) {
        next(e);
    }
}

const editDocumentPOST = async (req,res,next) => {
    try {
        const {title, description, author, category} = req.body
        const documentId = req.params.id;
        const originalDocument = await documentController.findDocumentByID(documentId);

        let uploadedFile = req.files?.documentFile || null;

        const validationResult = await validation.validateEditDocData(title, description, author, category, uploadedFile?.data)
        if (validationResult.isValid === true) {
            let uniqueFilename
            if (req.files?.documentFile) {
                const uniqueString = await _uniqueString;
                const uniqueFilename = `${uniqueString.default()}.${validationResult.fileExtension}`;
                await uploadedFile.mv(path.join(__dirname, '..', '..', 'public', 'uploads', uniqueFilename));

                await filleOperations.moveFile(
                    path.join(__dirname, '..', '..', 'public', 'uploads', originalDocument.filename),
                    path.join(__dirname, '..', '..', 'data', 'archives', originalDocument.filename)
                );
            }

            const document = {
                title,
                description,
                author,
                filename: uniqueFilename || originalDocument.filename,
                file_ext: validationResult.fileExtension || originalDocument.file_ext,
            }
            await documentController.updateDocument(document, documentId);

            res.json(validationResult);
        } else {
            res.status(422).json(validationResult)
        }
    } catch (e) {
        next(e);
    }
}


module.exports = {homeGET, documentGET, addDocumentGET, addDocumentPOST, documentDELETE, editDocumentGET, editDocumentPOST}