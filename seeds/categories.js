const faker = require('faker');

exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('categories').del()
        .then(function () {
            // Inserts seed entries
            const adjectives = [
                "science fiction", "fantasy", "mystery", "thriller", "romance",
                "historical fiction", "contemporary", "dystopian", "young adult"
            ];
            const categories = [];
            for (let i = 1; i < 10; i++) {
                categories.push(
                    {
                        id: i,
                        category_name: adjectives[i-1]
                    });
            }
            return knex('categories').insert(categories);
        });
};
