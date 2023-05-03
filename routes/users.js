const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')
const bodyValidation = require('../middleware/body.validation.js')
const schemas = require('../validations/users.validation.js')

router.get('/profile', usersController.profilePage)
router.get('/profile/edit', usersController.editProfilePage)
router.patch('/profile', bodyValidation(schemas.update), usersController.update)
module.exports = router