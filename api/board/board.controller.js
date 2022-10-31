const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const boardService = require('./board.service')
const utilService = require('../../services/util.service')

async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get reviews', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

async function removeBoard(req, res) {
    const {boardId} = req.params
    try {
        const deletedCount = await boardService.remove(boardId)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove board' })
        }
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}


async function addBoard(req, res) {
    loggedinUser = !req.cookies.loginToken ? {
            fullname:'guest',
            username:'guest',
            imgUrl:'https://www.computerhope.com/jargon/g/guest-user.jpg'
        } : authService.validateToken(req.cookies.loginToken)

    try {
        var board = req.body
        boardFromDB = await boardService.add(board, loggedinUser)
        
        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)


        // socketService.broadcast({ type: 'review-added', data: review, userId: review.byUserId })
        // socketService.emitToUser({ type: 'review-about-you', data: review, userId: review.aboutUserId })

        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(boardFromDB)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}


async function updateBoard(req, res) {
    try {
      const board = req.body;
      const updatedBoard = await boardService.update(board)
      res.json(updatedBoard)
    } catch (err) {
      logger.error('Failed to update board', err)
      res.status(500).send({ err: 'Failed to update board' })
  
    }
  }


  async function getBoardById(req, res) {
    try {
      const {boardId} = req.params
      const board = await boardService.getBoardById(boardId)
      res.json(board)
    } catch (err) {
      logger.error('Failed to get board', err)
      res.status(500).send({ err: 'Failed to get board' })
    }
  }


module.exports = {
    getBoards,
    addBoard,
    removeBoard,
    updateBoard,
    getBoardById
}