const db = require('../src/config/db');
const {
    findAllDocuments,
    findDocumentByID,
    getUserDocuments,
    closeConnection
} = require('../src/controllers/modelControllers/documentCotroller');

describe('Document Functions', () => {
    beforeAll(async () => {
        await db.raw('SET foreign_key_checks = 0');
        await db('documents').insert([
            { id: 1, user_id: 1, title: 'Document 1', description: 'Description 1', uploaded_at: new Date() },
            { id: 2, user_id: 2, title: 'Document 2', description: 'Description 2', uploaded_at: new Date() },
        ]);
        await db('document_category').insert([
            { document_id: 1, category_id: 1 },
            { document_id: 1, category_id: 2 },
            { document_id: 2, category_id: 3 },
        ]);
    });

    afterAll(async () => {
        await db('documents').truncate();
        await db('document_category').truncate();
        await closeConnection();
        await db.raw('SET foreign_key_checks = 1');
    });

    test('findAllDocuments should fetch all documents', async () => {
        const result = await findAllDocuments();
        expect(result).toHaveLength(2);
    });

    test('findDocumentByID should fetch document by ID', async () => {
        const id = 1;
        const result = await findDocumentByID(id);
        expect(result.id).toEqual(id);
    });

    test('getUserDocuments should fetch documents for a specific user', async () => {
        const userId = 1;
        const result = await getUserDocuments(userId);
        expect(result).toHaveLength(1);
        expect(result[0].user_id).toEqual(userId);
    });

});
