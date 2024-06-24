const documentController = require('./modelControllers/documentCotroller')

const documentsApi = async (req, res, next) => {
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

        const filteredDocs = await documentController.findDocumentByFilter(filters)
        const filteredDocsWoutFilename = filteredDocs.map((doc) => {
            const { filename, ...rest } = doc;
            return rest;
        });

        res.json(filteredDocsWoutFilename)
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