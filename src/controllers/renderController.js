const documentController = require('./modelControllers/documentCotroller')

const renderHomePage = async (req, res, next) => {
    try {
        const documents = await documentController.findDocumentByFiler({})

        res.render('home', {documents: documents});
    } catch (e) {
        next(e)
    }
};

const renderDocumentPage = async (req, res, e) => {
    try {
        const doc = await documentController.findDocumentByID(req.params.id);

        res.render('document', {doc: doc});
    } catch (e) {
        next(e)
    }
};

module.exports = {renderHomePage, renderDocumentPage}