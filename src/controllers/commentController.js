const commentsController = require('./modelControllers/commentsController');
const validator = require('../utils/validation');

const commentsPOST = async (req, res, next) => {
    try {
        const {documentId, userId, content} = req.body;

        const validationResult = await validator.validateComment(userId, documentId, content);

        if ((await validationResult).isValid === true) {
            await commentsController.createComment({user_id: userId, document_id: documentId, content: content.trim()});
            res.json(validationResult);
        } else {
            res.status(422).json(validationResult);
        }
    } catch (e) {
        next(e);
    }
}

module.exports = {commentsPOST}