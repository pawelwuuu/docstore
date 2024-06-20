const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentController');

commentRouter.post('/add-comment', commentController.commentsPOST);


module.exports = commentRouter;