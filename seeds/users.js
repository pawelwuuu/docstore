const faker = require('faker');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
      .then(function () {
        // Inserts seed entries
        const users = [];
        let j = 1;
        for (let i = 0; i < 10; i++) {
          users.push(
              {
                  id: j++,
                  username: faker.internet.userName(),
                  email: faker.internet.email(),
                  password: faker.internet.password(),
              });
        }
        return knex('users').insert(users);
      });
};
