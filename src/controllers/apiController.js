const documentController = require('./modelControllers/documentCotroller');
const categoriesController = require('./modelControllers/categoryController');

const documentsApi = async (req, res, next) => {
    try {
        const filterCategories = Array.isArray(req.query.categories)
            ? req.query.categories
            : typeof req.query.categories === 'string'
                ? [req.query.categories]
                : [];

        const filters = {
            id: req.query.id,
            title: req.query.title,
            description: req.query.description,
            author: req.query.author,
            uploadedBy: req.query.uploadedBy,
            uploadedAt: req.query.uploadedAt,
            categories: filterCategories,
            orderBy: req.query.orderBy,
            orderType: req.query.orderType,
            perPage: req.query.perPage,
            page: req.query.page
        };

        const filteredDocs = await documentController.findDocumentByFilter(filters)
        res.json(filteredDocs)
    } catch (e) {
        next(e)
    }

}

const documentByIdApi = async (req, res, next) => {
    try {
        const doc = await documentController.getDocumentDetails(req.params.id);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).send('Document not found.');
        }
    } catch (e) {
        next(e)
    }
}

const categoriesApi = async (req, res, next) => {
    try {
        const allCategories = await categoriesController.findAllCategories();

        res.json(allCategories);
    } catch (e) {
        next(e);
    }
}

const categoryByIdApi = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await categoriesController.findCategoryByID(categoryId);

        res.json(category);
    } catch (e) {
        next(e);
    }
}

module.exports = {documentsApi, documentByIdApi, categoriesApi, categoryByIdApi}