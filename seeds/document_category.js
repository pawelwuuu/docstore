const faker = require('faker');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('document_category').del()
        .then(function () {

            const document_categories = [];
            for (let i = 0; i < 15; i++) {
                document_categories.push(
                    {
                        document_id: faker.datatype.number({min: 1, max:10}),
                        category_id:faker.datatype.number({min: 1, max:9}),
                    });
            }
            return knex('document_category').insert(document_categories);
        });
};
