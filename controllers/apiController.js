const documentController = require('./documentCotroller')

const documentsApi = async (req, res, next) => {
    try {
        const filters = {
            title: req.query.title,
            description: req.query.description,
            author: req.query.author,
            uploadedBy: req.query.uploadedBy,
            orderBy: req.query.orderBy,
            orderType: req.query.orderType,
            perPage: req.query.perPage,
            page: req.query.page
        };

        res.json(await documentController.findDocumentByFiler(filters))
    } catch (e) {
        next(e)
    }

}

const documentByIdApi = async (req, res, next) => {
    try {
        const doc = await documentController.findDocumentByID(req.params.id);

        if (doc) {
            res.json(doc);
        } else{
            res.status(404).send('Document not found.');
        }
    } catch (e) {
        next(e)
    }

}

module.exports = {documentsApi, documentByIdApi}