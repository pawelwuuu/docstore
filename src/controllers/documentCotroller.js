const db = require('../config/db')

const getOffset = (perPage, page) => {
    if (page <= 1) {
        return 0;
    } else {
        return perPage * (page - 1);
    }
}

const createDocument = async (document) => {
    try {
        await db('documents').insert(document);
        return true;
    } catch (e) {
        throw e;
    }
};

const findAllDocuments = async () => {
    try {
        return db('documents').select('*');
    } catch (e) {
        throw e;
    }
};

const findDocumentByID = async (id) => {
    try {
        return db('documents').where('id', '=', id).first();
    } catch (e) {
        throw e;
    }
};

const findDocumentByFiler = async (_filter) => {
    try {
         const filter = {
            title: _filter.title ? `%${req.query.title}%` : '%',
            description: _filter.description ? `%${req.query.description}%` : '%',
            author: _filter.author ? `${req.query.author}%` : '%',
            uploadedBy: _filter.uploadedBy ? `${req.query.uploadedBy}%` : '%',
            orderBy: _filter.orderBy || 'uploaded_at',
            orderType: _filter.orderType || 'asc',
            perPage: parseInt(_filter.perPage) || -1,
            page: parseInt(_filter.page) || 1
        }

        let filteredDocs;
        if (filter.perPage === -1) {
            filteredDocs = await db('documents').select('documents.id','title', 'description', 'author', 'uploaded_at', 'users.username')
                .join('users', 'users.id', 'documents.user_id')
                .whereILike('title', filter.title)
                .whereILike('description', filter.description)
                .whereILike('author', filter.author)
                .whereILike('users.username', filter.uploadedBy)
                .orderBy(filter.orderBy, filter.orderType);
        } else if (filter.perPage > 0) {
            filteredDocs = await db('documents').select('documents.id','title', 'description', 'author', 'uploaded_at', 'users.username')
                .join('users', 'users.id', 'documents.user_id')
                .whereILike('title', filter.title)
                .whereILike('description', filter.description)
                .whereILike('author', filter.author)
                .whereILike('users.username', filter.uploadedBy)
                .orderBy(filter.orderBy, filter.orderType)
                .offset(getOffset(filter.perPage, filter.page))
                .limit(filter.perPage);
        } else {
            throw new Error("API error, per.page less than 0 or other incorrect data.")
        }

        return filteredDocs;
    } catch (e) {
        throw e;
    }
}

const updateDocument = async (document, id) => {
    try {
        const existingDocument = await findDocumentByID(id);
        if (existingDocument) {
            await db('documents').where('id', '=', id).update(document);
        } else {
            throw new Error(`Document not found while updating for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

const deleteDocument = async (id) => {
    try {
        const existingDocument = await findDocumentByID(id);
        if (existingDocument) {
            await db('documents').where('id', '=', id).delete();
        } else {
            throw new Error(`Document not found while deleting for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

module.exports = {createDocument, findAllDocuments, findDocumentByID, updateDocument, deleteDocument, findDocumentByFiler};
