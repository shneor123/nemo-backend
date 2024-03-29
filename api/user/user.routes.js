const express = require('express')
const { getUser, getUsers, deleteUser, updateUser } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)
router.put('/', updateUser)
router.delete('/:id', deleteUser)

module.exports = router