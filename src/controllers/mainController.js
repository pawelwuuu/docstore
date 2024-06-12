const documentController = require('./modelControllers/documentCotroller')

const homeGET = async (req, res, next) => {
    try {
        const documents = await documentController.findDocumentByFiler({
            perPage: 5,
            page: 1
        })

        res.render('home', {documents: documents});
    } catch (e) {
        next(e)
    }
};

const documentGet = async (req, res, next) => {
    try {
        const doc = await documentController.findDocumentByFiler({
            id: req.params.id,
        });

        res.render('document', {doc: doc[0]});
    } catch (e) {
        next(e)
    }
};

module.exports = {renderHomePage: homeGET, renderDocumentPage: documentGet}