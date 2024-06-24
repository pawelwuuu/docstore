const faker = require('faker');
const bcrypt = require('bcrypt')


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

        users.push ({
            id: 999,
            username: 'admin',
            email: 'admin@test.pl',
            password: bcrypt.hashSync('admin', 11),
            is_admin: true,
        })

          users.push ({
              id: 1000,
              username: 'test',
              email: 'test@test.pl',
              password: bcrypt.hashSync('test', 11),
              is_admin: false,
          })

        return knex('users').insert(users);
      });
};
