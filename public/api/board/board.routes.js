const express = require('express')
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