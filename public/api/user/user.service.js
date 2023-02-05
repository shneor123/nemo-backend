
const ObjectId = require('mongodb').ObjectId
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const bcrypt = require('bcrypt')

const COLLECTION_NAME = 'user'

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        let users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        console.log(`ERROR: cannot find users (user.service - query)`)
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne({ _id: ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        const lastModified = Date.now()
        const updatedUser = {
            _id: ObjectId(user._id), // needed for the returnd obj
            username: user.username,
            fullname: user.fullname,
            lastModified
        }

        if (user.newPassword) {
            const saltRounds = 10
            const hash = await bcrypt.hash(user.newPassword, saltRounds)
            updatedUser.password = hash
        }

        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.updateOne({ _id: updatedUser._id }, { $set: updatedUser })
        delete user.password
        return { ...user, lastModified }
    } catch (err) {
        console.log(`ERROR: cannot update user (user.service - update)`)
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            googleId: user.googleId,
            mentions: ''
        }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.insertOne(userToAdd)
        console.log("@@@@ userToAdd", userToAdd);
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}



module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add
}
