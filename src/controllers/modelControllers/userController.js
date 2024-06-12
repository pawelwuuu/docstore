const db = require('../../config/db')

const createUser = async (user) => {
    try {
        return await db('users').insert(user, 'id').returning('id');
    } catch (e) {
        throw e;
    }
};

const findAllUsers = async () => {
    try {
        return db('users').select('*');
    } catch (e) {
        throw e;
    }
};


const findUserByID = async (id) => {
    try {
        return db('users').where('id', '=', id).first()
    }catch (e) {
        throw e
    }
};

const updateUser = async (user, id) => {
    try {
        const existingUser = await findUserByID(id)

        if (existingUser) {
            await db('users').where('id', '=', id).update(user)
        } else {
            throw new Error(`User not found while updating for id ${id}`)
        }

        return true
    }catch (e) {
        throw e
    }
}

const deleteUser = async (id) => {
    try {
        const existingUser = await findUserByID(id)

        if (existingUser) {
            await db('users').where('id', '=', id).delete()
        } else {
            throw new Error(`User not found while updating for id ${id}`)
        }

        return true
    }catch (e) {
        throw e
    }
}

const findUserByUsername = async (username) => {
    return db('users').select('*').where('username', '=', username).first();
}

const findUserByEmail = async (email) => {
    return db('users').select('*').where('email', '=', email).first();
}

const findUserByLogin = async (login) => {
    return db('users').select('*').where('email', '=', login).orWhere('username', '=', login).first();
}

module.exports = {createUser, findAllUsers, findUserByID, updateUser, deleteUser, findUserByUsername, findUserByEmail, findUserByLogin}
