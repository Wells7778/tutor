const service = require('../services/tutor.services')
const userService = require('../services/user.services')
const courseService = require('../services/course.services')
const helpers = require('../helpers/auth.helper')
const tutorsController = {
  async indexPage(req, res, next) {
    try {
      const query = req.query
      const { page = 1, perPage = 6, search = '' } = query
      const { data: tutors, pagination } = await service.index({ page, limit: perPage, search })
      const rankStudents = await userService.rankStudents()
      const rankStudentsByWeek = await userService.rankStudentsByWeek()
      const rankStudentsData = rankStudents.map((student, index) => {
        return {
          rank: index + 1,
          name: student.name,
          avatar: student.avatar,
          minutes: student.totalMinutes,
        }
      })
      const rankStudentsByWeekData = rankStudentsByWeek.map((record, index) => {
        return {
          rank: index + 1,
          name: record.User.name,
          avatar: record.User.avatar,
          minutes: record.learnedMinutes,
        }
      })
      return res.render('tutors', {
        pagination,
        tutors,
        page,
        perPage,
        search,
        rankStudents: rankStudentsData,
        rankStudentsByWeek: rankStudentsByWeekData,
      })
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
      const courseOptions = courseService.getAvailTimes(tutor)
      const courses = tutor.Courses.sort((a, b) => a.score - b.score)
      const filterCourses = [...courses.slice(0, 2), ...courses.slice(-2)].map(c => c.toJSON())
      return res.render('tutor', { tutor: tutor.toJSON(), courseOptions, filterCourses })
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
      if (Number(req.params.id) !== helpers.getUser(req).Tutor.id) throw new Error('只能修改自己的課程哦！')
      const tutor = await service.update(req.params.id, req.validBody)
      res.json({ tutor })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tutorsController
