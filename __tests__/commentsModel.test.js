const knexConfig = require('../knexfile');
const db = require('../src/config/db');
const {
    createComment,
    findAllComments,
    findCommentByID,
    updateComment,
    deleteComment,
    countUserDocumentComments,
    getCommentsByDocumentId,
    closeConnection
} = require('../src/controllers/modelControllers/commentsController');

describe('Comment Functions', () => {
    beforeAll(async () => {
        await db.raw('SET foreign_key_checks = 0');
        await db('comments').insert([
            { id: 1, document_id: 1, user_id: 1, content: 'Comment 1' },
            { id: 2, document_id: 1, user_id: 2, content: 'Comment 2' },
        ]);
    });

    afterAll(async () => {
        await db('comments').truncate();
        await closeConnection();
        await knex.raw('SET foreign_key_checks = 1');
    });

    test('getCommentsByDocumentId should fetch comments with associated username', async () => {
        const documentId = 1;
        const result = await getCommentsByDocumentId(documentId);
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('content');
        expect(result[0]).toHaveProperty('username');
    });

    test('countUserDocumentComments should fetch comment count for user and document', async () => {
        const userId = 1;
        const documentId = 1;
        const result = await countUserDocumentComments(userId, documentId);
        expect(result.comments_count).toBe(1);
    });

    test('findAllComments should fetch all comments', async () => {
        const result = await findAllComments();
        expect(result).toHaveLength(2);
    });

    test('createComment should insert into comments table', async () => {
        const comment = { document_id: 1, user_id: 1, content: 'New comment' };
        const result = await createComment(comment);
        expect(result.length).toBe(1);
        const insertedComment = await db('comments').select('*').where('content', '=', comment.content).first();
        expect(insertedComment).toBeTruthy();
    });

    test('findCommentByID should fetch comment by ID', async () => {
        const id = 1;
        const result = await findCommentByID(id);
        expect(result.id).toEqual(id);
    });

    test('updateComment should update existing comment', async () => {
        const id = 1;
        const comment = { content: 'Updated comment' };
        const result = await updateComment(comment, id);
        expect(result).toBe(true);
        const updatedComment = await db('comments').where({ id }).first();
        expect(updatedComment.content).toEqual(comment.content);
    });

    test('deleteComment should delete existing comment', async () => {
        const id = 2;
        const result = await deleteComment(id);
        expect(result).toBe(true);
        const deletedComment = await db('comments').where({ id }).first();
        expect(deletedComment).toBeUndefined();
    });


});
