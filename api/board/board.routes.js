const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
// const {log} = require('../../middlewares/logger.middleware')
// const {addReview, getReviews, deleteReview} = require('./review.controller')
const {getBoards, addBoard, removeBoard, updateBoard, getBoardById} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/' ,getBoards)
router.get('/:boardId', getBoardById)
router.put('/', updateBoard)
router.post('/', addBoard)
router.delete('/:boardId', removeBoard)

module.exports = router