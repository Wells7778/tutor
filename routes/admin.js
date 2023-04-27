const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')

router.get('/', adminController.indexPage)
router.get('/courses', adminController.coursesPage)

module.exports = router