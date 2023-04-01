const service = require('../services/course.services')
const tutorService = require('../services/tutor.services')
const helpers = require('../helpers/auth.helper')
const format = require('date-fns/format')
const coursesController = {
  async create(req, res, next) {
    try {
      const user = helpers.getUser(req)
      const tutor = await tutorService.findById(req.params.tutorId)
      const course = await service.create(user, tutor, req.validBody)
      if (!tutor) {
        return res.status(404).json('tutor not found')
      }
      if (!course) {
        return res.status(400).json('Create course fail')
      }

      const data = {
        tutorName: tutor.User.name,
        link: tutor.link,
        startTime: format(course.startTime, 'yyyy-MM-dd HH:mm'),
      }
      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  async attend(req, res, next) {
    try {
      const course = await service.findById(req.params.id)
      if (course.TutorId !== helpers.getUser(req).id) throw new Error('不是自己的課程')
      await service.attend(course)
      res.redirect('/profile')
    } catch (error) {
      next(error)
    }
  },
  async complete(req, res, next) {
    try {
      const course = await service.findById(req.params.id)
      if (course.UserId !== helpers.getUser(req).id) throw new Error('不是自己的課程')
      await service.complete(course, req.validBody)
      res.redirect('/profile')
    } catch (error) {
      next(error)
    }
  },
}

module.exports = coursesController
