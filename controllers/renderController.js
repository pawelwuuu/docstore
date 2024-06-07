const documentController = require('./documentCotroller')

const renderHomePage = async (req, res) => {

    const documents = await documentController.findDocumentByFiler({})

    res.render('home', {documents: documents});
};

const renderDocumentPage = async (req, res) => {
    const doc = await documentController.findDocumentByID(req.params.id);

    res.render('document', {doc: doc});
};

module.exports = {renderHomePage, renderDocumentPage}