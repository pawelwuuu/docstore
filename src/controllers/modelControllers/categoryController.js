const db = require('../../config/db');

const createCategory = async (category) => {
    try {
        await db('categories').insert(category);
        return true;
    } catch (e) {
        throw e;
    }
};

const findAllCategories = async () => {
    try {
        return db('categories').select('*');
    } catch (e) {
        throw e;
    }
};

const findCategoryByID = async (id) => {
    try {
        return db('categories').where('id', '=', id).first();
    } catch (e) {
        throw e;
    }
};

const updateCategory = async (category, id) => {
    try {
        const existingCategory = await findCategoryByID(id);
        if (existingCategory) {
            await db('categories').where('id', '=', id).update(category);
        } else {
            throw new Error(`Category not found while updating for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

const deleteCategory = async (id) => {
    try {
        const existingCategory = await findCategoryByID(id);
        if (existingCategory) {
            await db('categories').where('id', '=', id).delete();
        } else {
            throw new Error(`Category not found while deleting for id ${id}`);
        }
        return true;
    } catch (e) {
        throw e;
    }
};

const getCategoriesDocCount = async () => {
    try {
        return await db('categories').select('id','category_name').count('document_category.document_id as doc_count')
            .leftJoin('document_category', 'categories.id', 'document_category.category_id')
            .groupBy('category_name').groupBy('id');
    } catch (e) {
        throw e;
    }
}

module.exports = {createCategory, findAllCategories, findCategoryByID, updateCategory, deleteCategory, getCategoriesDocCount};
