const express = require('express')
const router = express.Router()
const { authenticatedStudent, authenticatedTeacher } = require('../middleware/auth.js')
const tutorsController = require('../controllers/tutors.controller')
const bodyValidation = require('../middleware/body.validation.js')
const schemas = require('../validations/tutors.validation.js')

router.get('/', tutorsController.indexPage)
router.get('/new', authenticatedStudent, tutorsController.newPage)
router.get('/:id', tutorsController.showPage)
router.get('/:id/edit', authenticatedTeacher, tutorsController.editPage)
router.post('/', authenticatedStudent, bodyValidation(schemas.create), tutorsController.create)
router.put('/:id', authenticatedTeacher, bodyValidation(schemas.create), tutorsController.update)

module.exports = router