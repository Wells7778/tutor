const service = require('../services/tutor.services')
const userService = require('../services/user.services')
const helpers = require('../helpers/auth.helper')
const tutorsController = {
  async indexPage(req, res, next) {
    try {
      const tutors = await service.index()
      return res.render('tutors', { tutors })
    } catch (error) {
      next(error)
    }
  },
  newPage(req, res) {
    const tutor = {
      duration: 30,
      serviceAvailability: [0, 1, 2, 3, 4, 5, 6],
    }
    res.render('newTutor', { tutor })
  },
  async showPage(req, res, next) {
    try {
      const tutor = await service.findById(req.params.id)
      return res.render('tutor', { tutor: tutor.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  async editPage(req, res, next) {
    try {
      const tutor = await service.findById(req.params.id)
      return res.render('editTutor', { tutor: tutor.toJSON() })
    } catch (error) {
      next(error)
    }
  },
  async create(req, res, next) {
    try {
      const user = helpers.getUser(req)
      const [tutor] = await Promise.all([
        service.create(user, req.validBody),
        userService.changeRole(user, { role: 'teacher' })
      ])
      if (!tutor) throw new Error('Create tutor fail')

      res.redirect('/profile')
    } catch (error) {
      next(error)
    }
  },
  async update(req, res, next) {
    try {
      if(Number(req.params.id) !== helpers.getUser(req).Tutor.id) throw new Error('只能修改自己的課程哦！')
      const tutor = await service.update(req.params.id, req.validBody)
      res.json({ tutor })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tutorsController
