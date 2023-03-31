const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')

router.get('/profile', usersController.profilePage)
module.exports = router