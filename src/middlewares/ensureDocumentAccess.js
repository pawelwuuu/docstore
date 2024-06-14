const documentController = require('../controllers/modelControllers/documentCotroller');
const ensureDocumentAccess = async (req, res, next) => {
    try {
        const documentId = req.params.id;
        const document = await documentController.findDocumentByID(documentId);
        if (res.locals.user && res.locals.user.id === document.user_id) {
            next()
        } else {
            const err = new Error("Brak dostępu.");
            err.userMsg = "Brak dostępu, zaloguj się aby rozwiązać ten problem."

            throw err;
        }
    } catch (e) {
        next(e);
    }
}

module.exports = ensureDocumentAccess;