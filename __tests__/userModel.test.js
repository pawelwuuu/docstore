const db = require('../src/config/db');
const {
    createUser,
    findAllUsers,
    findUserByID,
    updateUser,
    deleteUser,
    findUserByUsername,
    findUserByEmail,
    findUserByLogin,
    closeConnection
} = require('../src/controllers/modelControllers/userController');

describe('User Functions', () => {
    beforeAll(async () => {
        await db.raw('SET foreign_key_checks = 0');
        await db('users').insert([
            { id: 1, username: 'user1', email: 'user1@example.com' },
            { id: 2, username: 'user2', email: 'user2@example.com' }
        ]);
    });

    afterAll(async () => {
        await db('users').truncate();
        await closeConnection();
        await db.raw('SET foreign_key_checks = 1');
    });

    test('findUserByEmail should fetch user by email', async () => {
        const email = 'user2@example.com';
        const result = await findUserByEmail(email);
        expect(result.email).toEqual(email);
    });

    test('findUserByLogin should fetch user by email or username', async () => {
        const login = 'user1@example.com';
        const result = await findUserByLogin(login);
        expect(result.email).toEqual('user1@example.com');

        const usernameLogin = 'user2';
        const resultByUsername = await findUserByLogin(usernameLogin);
        expect(resultByUsername.username).toEqual('user2');
    });

    test('findAllUsers should fetch all users', async () => {
        const result = await findAllUsers();
        expect(result).toHaveLength(2);
    });

    test('findUserByID should fetch user by ID', async () => {
        const id = 1;
        const result = await findUserByID(id);
        expect(result.id).toEqual(id);
    });

    test('createUser should insert into users table', async () => {
        const user = { username: 'newuser', email: 'newuser@example.com' };
        const result = await createUser(user);
        expect(result).toBeDefined();
        const insertedUser = await db('users').select('*').where('id', '=', result[0]).first();
        expect(insertedUser.username).toEqual(user.username);
        expect(insertedUser.email).toEqual(user.email);
    });

    test('updateUser should update existing user', async () => {
        const id = 1;
        const user = { email: 'updateduser@example.com' };
        const result = await updateUser(user, id);
        expect(result).toBe(true);
        const updatedUser = await db('users').select('*').where('id', '=', id).first();
        expect(updatedUser.email).toEqual(user.email);
    });

    test('deleteUser should delete existing user', async () => {
        const id = 2;
        const result = await deleteUser(id);
        expect(result).toBe(true);
        const deletedUser = await db('users').select('*').where('id', '=', id).first();
        expect(deletedUser).toBeUndefined();
    });

    test('findUserByUsername should fetch user by username', async () => {
        const username = 'user1';
        const result = await findUserByUsername(username);
        expect(result.username).toEqual(username);
    });
});
