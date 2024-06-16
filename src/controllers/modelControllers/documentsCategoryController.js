const db = require('../../config/db');

const createDocumentCategory = async (documentCategory) => {
    try {
        await db('documents_category').insert(documentCategory);
        return true;
    } catch (e) {
        throw e;
    }
};

const findAllDocumentCategories = async () => {
    try {
        return db('documents_category').select('*');
    } catch (e) {
        throw e;
    }
};

const findDocumentCategory = async (documentId) => {
    try {
        return db('document_category')
            .where('document_id', '=', documentId);
    } catch (e) {
        throw e;
    }
};

const updateDocumentCategory = async (documentCategory, documentId, categoryId) => {
    try {
        const existingDocumentCategory = await findDocumentCategory(documentId, categoryId);
        if (existingDocumentCategory) {
            await db('documents_category')
                .where('document_id', '=', documentId)
                .andWhere('category_id', '=', categoryId)
                .update(documentCategory);
        } else {
            throw new Error(`Document-Category relationship not found while updating for document_id ${documentId} and category_id ${categoryId}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

const deleteDocumentCategory = async (documentId, categoryId) => {
    try {
        const existingDocumentCategory = await findDocumentCategory(documentId, categoryId);
        if (existingDocumentCategory) {
            await db('documents_category')
                .where('document_id', '=', documentId)
                .andWhere('category_id', '=', categoryId)
                .delete();
        } else {
            throw new Error(`Document-Category relationship not found while deleting for document_id ${documentId} and category_id ${categoryId}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

module.exports = {createDocumentCategory, findAllDocumentCategories, findDocumentCategory, updateDocumentCategory, deleteDocumentCategory};
