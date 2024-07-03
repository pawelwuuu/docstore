const db = require('../../config/db')

const getOffset = (perPage, page) => {
    if (page <= 1) {
        return 0;
    } else {
        return perPage * (page - 1);
    }
}

const createDocument = async (document, categoriesIds) => {
    try {
        await db.transaction(async (trx) => {
            const documentId = await trx('documents').insert(
                document,
                'id'
            );

            const documentCategories = [];
            categoriesIds.forEach((categoryId) => {
                documentCategories.push({category_id: categoryId, document_id: documentId})
            });

            await trx('document_category').insert(
                documentCategories
            );

            return documentId;
        });
    } catch (error) {
        throw error;
    }
};

const getDocumentsCount = async () => {
    try {
        const dbResult = await db('documents').count('* as documents_count').first();

        return dbResult.documents_count;
    } catch (e) {
        throw e;
    }
}

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

const getUserDocuments = async (userId) => {
    try {
        return await db('documents').where('user_id', userId)
    } catch (e) {
        throw e;
    }
}


async function getDocumentDetails(documentId) {
    try {
        return await db.transaction(async trx => {
            const doc = await trx('documents')
                .where('documents.id', documentId)
                .join('users', 'documents.user_id', 'users.id')
                .select(
                    'documents.*',
                    'users.username'
                )
                .first();

            if (!doc) {
                const err = new Error(`Document ${documentId} not found.`);
                err.userMsg = 'Dokument nie istnieje.'
            }

            const categories = await trx('document_category')
                .where('document_category.document_id', documentId)
                .join('categories', 'document_category.category_id', 'categories.id')
                .select(
                    'categories.id as category_id',
                    'categories.category_name'
                );

            doc.categories = categories.map(cat => ({
                category_id: cat.category_id,
                category_name: cat.category_name
            }));

            return doc;
        });
    } catch (error) {
        throw error;
    }
}

async function getDocumentsByCategoryIds(categoryIds) {
    try {
        const documents = await db.transaction(async trx => {
            const docs = await trx('documents')
                .join('document_category', 'documents.id', 'document_category.document_id')
                .join('categories', 'document_category.category_id', 'categories.id')
                .whereIn('document_category.category_id', categoryIds)
                .select('documents.*')
                .distinct();

            const docIds = docs.map(doc => doc.id);

            const categories = await trx('document_category')
                .whereIn('document_category.document_id', docIds)
                .join('categories', 'document_category.category_id', 'categories.id')
                .select(
                    'document_category.document_id',
                    'categories.id as category_id',
                    'categories.category_name'
                );

            return docs.map(doc => {
                return {
                    ...doc,
                    categories: categories
                        .filter(cat => cat.document_id === doc.id)
                        .map(cat => ({
                            category_id: cat.category_id,
                            category_name: cat.category_name
                        }))
                };
            });
        });

        return documents;
    } catch (error) {
        throw error;
    }
}

const documentExtensionsCount = () => {
    try {
        return db('documents').select('file_ext').count('file_ext as count').groupBy('file_ext').orderBy('count', 'desc');
    } catch (e) {
        throw e;
    }
}

const findDocumentByFilter = async (_filter) => {
    try {
        const filter = {
            id: _filter.id ? `${_filter.id}` : '%',
            title: _filter.title ? `%${_filter.title}%` : '%',
            description: _filter.description ? `%${_filter.description}%` : '%',
            author: _filter.author ? `${_filter.author}%` : '%',
            uploadedBy: _filter.uploadedBy ? `${_filter.uploadedBy}%` : '%',
            uploadedFrom: _filter.uploadedFrom || '2020-06-29 05:30:55',
            uploadedTo: _filter.uploadedTo || '2063-06-29 05:30:55',
            categories: _filter.categories || [],
            orderBy: _filter.orderBy || 'uploaded_at',
            orderType: _filter.orderType || 'asc',
            perPage: parseInt(_filter.perPage) || -1,
            page: parseInt(_filter.page) || 1
        };



        let query = db('documents')
            .select('documents.*', 'users.username')
            .join('users', 'users.id', 'documents.user_id')
            .whereLike('documents.id', filter.id)
            .whereBetween('documents.uploaded_at', [filter.uploadedFrom, filter.uploadedTo])
            // .where('documents.uploaded_at', '>', filter.uploadedFrom)
            // .where('documents.uploaded_at', '<=', filter.uploadedTo)
            .whereILike('title', filter.title)
            .whereILike('description', filter.description)
            .whereILike('author', filter.author)
            .whereILike('users.username', filter.uploadedBy);

        console.log(filter);
        console.log(query.toString());


        if (filter.categories.length > 0) {
            query.whereExists(function() {
                this.select('*')
                    .from('document_category')
                    .whereRaw('documents.id = document_category.document_id')
                    .whereIn('document_category.category_id', filter.categories);
            });
        }

        let totalQuery = query.clone();

        if (filter.perPage === -1) {
            const filteredDocs = await query.orderBy(filter.orderBy, filter.orderType);

            for (let doc of filteredDocs) {
                const categories = await db('document_category')
                    .select('categories.category_name')
                    .join('categories', 'document_category.category_id', 'categories.id')
                    .where('document_category.document_id', doc.id);

                doc.categories = categories.map(cat => cat.category_name);
            }

            filteredDocs.totalDocuments = filteredDocs.length;
            return filteredDocs;
        } else if (filter.perPage > 0) {
            const offset = getOffset(filter.perPage, filter.page);
            const filteredDocs = await query
                .orderBy(filter.orderBy, filter.orderType)
                .offset(offset)
                .limit(filter.perPage);

            for (let doc of filteredDocs) {
                const categories = await db('document_category')
                    .select('categories.category_name')
                    .join('categories', 'document_category.category_id', 'categories.id')
                    .where('document_category.document_id', doc.id);

                doc.categories = categories.map(cat => cat.category_name);
            }

            const totalDocuments = await totalQuery.count('documents.id as total').first();
            filteredDocs.totalDocuments = totalDocuments.total;

            return filteredDocs;
        } else {
            throw new Error("API error, perPage less than 0 or other incorrect data.");
        }
    } catch (e) {
        throw e;
    }
};

const updateDocument = async (document, id, categoriesIds) => {
    try {
        await db.transaction(async (trx) => {
            const existingDocument = await findDocumentByID(id);

            const documentCategories = [];
            categoriesIds.forEach((categoryId) => {
                documentCategories.push({category_id: categoryId, document_id: existingDocument.id})
            });

            if (existingDocument) {
                await trx('documents').where('id', '=', id).update(document);
                await trx('document_category').delete().where('document_id', existingDocument.id);
                await trx('document_category').insert(documentCategories);

            } else {
                throw new Error(`Document not found while updating for id ${id}`);
            }
        });
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

const closeConnection =async () => {
    await db.destroy();
}

module.exports = {closeConnection, createDocument, findAllDocuments, findDocumentByID, updateDocument, deleteDocument, findDocumentByFilter,
    getUserDocuments, getDocumentDetails, getDocumentsByCategoryIds, getDocumentsCount, documentExtensionsCount};
