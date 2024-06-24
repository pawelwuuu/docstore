const db = require('../../config/db')

const createComment = async (comment) => {
    try {
        return await db('comments').insert(comment);
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

const countUserDocumentComments = async (userId, documentId) => {
    try {
        return await db('comments').count('* as comments_count').where('document_id', documentId).andWhere('user_id', userId).first();
    } catch (e) {
        throw e;
    }
}

const getCommentsByDocumentId = async (documentId) => {
    try {
        return await db('comments')
            .where('comments.document_id', documentId)
            .leftJoin('users', 'comments.user_id', 'users.id')
            .select(
                'comments.*',
                'users.username'
            );
    } catch (error) {
        throw error;
    }
}

const closeConnection =async () => {
    await db.destroy();
}

module.exports = {closeConnection, createComment, findAllComments, findCommentByID, updateComment, deleteComment, countUserDocumentComments, getCommentsByDocumentId};
