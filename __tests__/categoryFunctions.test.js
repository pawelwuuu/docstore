const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.test);
const {
    createCategory,
    findAllCategories,
    findCategoryByID,
    updateCategory,
    deleteCategory,
    getCategoriesDocCount,
    closeConnection
} = require('../src/controllers/modelControllers/categoryController');

describe('Category Functions', () => {
    beforeAll(async () => {
        // Przygotowanie danych testowych, np. wypełnienie tabeli kategorii
        await knex('categories').insert([
            { id: 1, category_name: 'Category 1' },
            { id: 2, category_name: 'Category 2' },
        ]);
    });

    afterAll(async () => {
        await knex.raw('SET foreign_key_checks = 0');
        await knex('categories').truncate();
        await knex.raw('SET foreign_key_checks = 1');
        await closeConnection();
        await knex.destroy();
    });

    test('findAllCategories should fetch all categories', async () => {
        const result = await findAllCategories();
        expect(result).toHaveLength(2); // Oczekujemy dwóch kategorii z wypełnionego testowo testu beforeAll
    });

    test('createCategory should insert into categories table', async () => {
        const category = { category_name: 'test' };

        const result = await createCategory(category);
        expect(result).toBe(true);


        // Sprawdź czy dodanie do bazy danych zostało wykonane poprawnie
        const insertedCategory = await knex('categories').select('*').where('category_name', '=', category.category_name).first();
        expect(insertedCategory).toBeTruthy();
    });

    test('findCategoryByID should fetch category by ID', async () => {
        const id = 1;
        const result = await findCategoryByID(id);
        expect(result.id).toEqual(id);
    });

    test('updateCategory should update category if it exists', async () => {
        const id = 1;
        const category = { category_name: 'Updated Category' };

        const result = await updateCategory(category, id);
        expect(result).toBe(true);

        // Sprawdź czy kategoria została zaktualizowana w bazie danych
        const updatedCategory = await knex('categories').where({ id }).first();
        expect(updatedCategory.category_name).toEqual(category.category_name);
    });

    test('deleteCategory should delete category if it exists', async () => {
        const id = 2;

        const result = await deleteCategory(id);
        expect(result).toBe(true);

        // Sprawdź czy kategoria została usunięta z baz danych
        const deletedCategory = await knex('categories').where({ id }).first();
        expect(deletedCategory).toBeUndefined();
    });

    test('getCategoriesDocCount should fetch category document count', async () => {
        const result = await getCategoriesDocCount();
        expect(result).toHaveLength(2); // Oczekujemy dwóch kategorii z wypełnionego testowo testu beforeAll
        // Dodatkowe sprawdzenie, że dane są zgodne z oczekiwaniami
        expect(result[0]).toHaveProperty('id');
        expect(result[0]).toHaveProperty('category_name');
        expect(result[0]).toHaveProperty('doc_count');
    });
});
