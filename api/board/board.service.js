const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const utilService = require('../../services/util.service')

const COLLECTION_NAME = 'board'

async function query(filterBy) {
    try {
                const criteria = _buildCriteria(filterBy)
        console.log('🔍 criteria:', criteria)
        
        console.log('🔄 Getting collection...');
        const collection = await dbService.getCollection(COLLECTION_NAME)
        console.log('✅ collection found:', collection.collectionName)



        let { sortBy } = filterBy
        let sortType = 1
        if (!sortBy || sortBy === 'created') {
            sortBy = 'createdAt'
            sortType = -1
        }
        let boards = await collection.find(criteria).sort({ [sortBy]: sortType }).toArray()

        // const boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
                console.error('❌ Error in query function:', err);
        logger.error('cannot find boards', err)
        throw err
    }
}

async function remove(boardId) {
    try {
        // use after auth works
        // const store = asyncLocalStorage.getStore()
        // const { loggedinUser } = store

        const collection = await dbService.getCollection(COLLECTION_NAME)
        // remove only if user is owner/admin
        const criteria = { _id: new ObjectId(boardId) }
        // if (!loggedinUser.isAdmin) criteria.byUserId = new ObjectId(loggedinUser._id)
        const { deletedCount } = await collection.deleteOne(criteria)
        // console.log('@@',deletedCount);
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function update(board) {
    try {
        var id = new ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection(COLLECTION_NAME)
        await collection.updateOne({ _id: id }, { $set: { ...board } })
        board._id = id
        return board
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(board, loggedinUser) {
    const userObjectToAdd = {
        _id: new ObjectId(loggedinUser._id),
        username: loggedinUser.username,
        fullname: loggedinUser.fullname,
        imgUrl: loggedinUser.imgUrl
    }
    try {
        const boardToAdd = {
            // byUserId:new ObjectId(review.byUserId),
            // aboutUserId:new ObjectId(review.aboutUserId),
            title: board.title,
            isStar: false,
            isPublic: false,
            createdBy: userObjectToAdd,
            members: [userObjectToAdd],
            archivedAt: null,
            createdAt: Date.now(),
            // later will be either image or color
            labelOpenState: false,
            style: board.style,
            labels: [
                {
                    "id": utilService.makeId(),// localID
                    "color": "#61bd4f"
                },
                {
                    "id": utilService.makeId(), // localID
                    "color": "#f2d600"
                },
                {
                    "id": utilService.makeId(),// localID
                    "color": "#ff9f1a",
                },
                {
                    "id": utilService.makeId(),// localID
                    "color": "#eb5a46"
                },
                {
                    "id": utilService.makeId(),// localID
                    "color": "#c377e0"
                },
                {
                    "id": utilService.makeId(),// localID
                    "color": "#0079bf",
                }
            ],
            groups: [],
            activities: [],
            lastViewedAt: null,

        }
        const collection = await dbService.getCollection(COLLECTION_NAME)
        boardToAdd.lastViewedAt = Date.now();
        await collection.insertOne(boardToAdd);
        return boardToAdd
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

async function getBoardById(boardId) {
    try {
        const collection = await dbService.getCollection(COLLECTION_NAME)
        const board = collection.findOne({ _id: new ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
    } else {
        // Later, owner is set by the backend
        board.owner = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
        boardChannel.postMessage(getActionAddBoard(savedBoard))
    }
    return savedBoard
}

function _buildCriteria(filterBy) {
    const criteria = {}

    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }

    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    remove,
    add,
    update,
    getBoardById
}


