const userController = require('./modelControllers/userController');
const documentController = require('./modelControllers/documentCotroller');

const userProfileGET = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const userDocuments = await documentController.getUserDocuments(userId);

        res.render('profile', {documents: userDocuments})
    } catch (e) {
        next(e);
    }
}

const userProfileDELETE = async (req, res, next) => {
    try {
        const userId = req.params.id;

        if (await userController.deleteUser(userId) === true) {
            res.send('Konto usuniete.')
        } else {
            const error = new Error('Cannot remove account.')
            error.userMsg = 'Problem podczas usuwania konta.'
            throw error;
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {userProfileGET, userProfileDELETE};