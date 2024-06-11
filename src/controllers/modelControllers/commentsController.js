const db = require('../../config/db')

const createComment = async (comment) => {
    try {
        await db('comments').insert(comment);
        return true;
    } catch (e) {
        throw e;
    }
};

const findAllComments = async () => {
    try {
        return db('comments').select('*');
    } catch (e) {
        throw e;
    }
};

const findCommentByID = async (id) => {
    try {
        return db('comments').where('id', '=', id).first();
    } catch (e) {
        throw e;
    }
};

const updateComment = async (comment, id) => {
    try {
        const existingComment = await findCommentByID(id);
        if (existingComment) {
            await db('comments').where('id', '=', id).update(comment);
        } else {
            throw new Error(`Comment not found while updating for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

const deleteComment = async (id) => {
    try {
        const existingComment = await findCommentByID(id);
        if (existingComment) {
            await db('comments').where('id', '=', id).delete();
        } else {
            throw new Error(`Comment not found while deleting for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

module.exports = {createComment, findAllComments, findCommentByID, updateComment, deleteComment};
