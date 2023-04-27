const express = require('express')
const router = express.Router()
const { authenticatedStudent, authenticatedTeacher } = require('../middleware/auth.js')
const coursesController = require('../controllers/courses.controller.js')
const bodyValidation = require('../middleware/body.validation.js')
const schemas = require('../validations/courses.validation.js')

router.post('/tutors/:tutorId/courses', authenticatedStudent, bodyValidation(schemas.create), coursesController.create)
router.patch('/tutors/:tutorId/courses/:id', authenticatedTeacher, coursesController.attend)
router.patch('/courses/:id/score', authenticatedStudent, bodyValidation(schemas.score), coursesController.score)
module.exports = router