const documentController = require('./modelControllers/documentCotroller');
const categoryController = require('./modelControllers/categoryController');
const documentCategoryController = require('./modelControllers/documentsCategoryController');
const commentsController = require('./modelControllers/commentsController');
const userController = require('./modelControllers/userController');
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
        const doc = await documentController.getDocumentDetails(req.params.id);

        const categoriesIds = doc.categories.map((category) => {
            return category.category_id;
        });

        const sameUserDocs = await documentController.getUserDocuments(doc.user_id);
        const sameCategoryDocs = await documentController.getDocumentsByCategoryIds(categoriesIds);
        const comments = await commentsController.getCommentsByDocumentId(doc.id);

        const sameUserDocsWoutThis = sameUserDocs.filter((document) => {
            return document.id !== doc.id;
        })
        const sameCategoryDocsWoutThis = sameCategoryDocs.filter((document) => {
            return document.id !== doc.id;
        })

        res.render('document/document', {doc, sameUserDocs: sameUserDocsWoutThis, sameCategoryDocs: sameCategoryDocsWoutThis, comments});
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
        let {title, description, author, category} = req.body
        category = category ? [...category] : [];
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
            await documentController.updateDocument(document, documentId, category);

            res.json(validationResult);
        } else {
            res.status(422).json(validationResult)
        }
    } catch (e) {
        next(e);
    }
}

const userDELETE = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const result = await userController.deleteUser(userId);

        if (result === true) {
            res.json('Użytkownik usunięty');
        } else {
            const err = new Error();
            err.userMsg = "Nie udało się usunąć konta."
            throw err;
        }
    } catch (e) {
        next(e);
    }
}

const filterDocuments = async (req, res, next) => {
    try {
        const filters = {
            id: req.query.id,
            title: req.query.title,
            description: req.query.description,
            author: req.query.author,
            uploadedBy: req.query.uploadedBy,
            uploadedAt: req.query.uploadedAt,
            orderBy: req.query.orderBy,
            orderType: req.query.orderType,
            perPage: req.query.perPage,
            page: req.query.page
        };

        const filteredDocs = await documentController.findDocumentByFiler(filters);

        res.render('document/filtered_documents', {documents: filteredDocs})
    } catch (e) {
        next(e);
    }
}

module.exports = {homeGET, documentGET, addDocumentGET, addDocumentPOST, documentDELETE, editDocumentGET,
    editDocumentPOST, userDELETE, filterDocuments}