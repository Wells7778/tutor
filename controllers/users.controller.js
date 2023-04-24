const bcrypt = require('bcrypt')
const db = require('../models')
const helpers = require('../helpers/auth.helper')
const { User } = db
const qs = require('querystring')
const courseService = require('../services/course.services')
const format = require('date-fns/format')
const { COURSE_SUBMIT, COURSE_COMPLETE } = require('../constants/course.status')
const getWeek = require('date-fns/getWeek')
const { isAfter } = require('date-fns')
const generateGoogleAuthUrl = (req) => {
  const redirectUrl = req.query.redirectUrl
  let googleAuthUrl = '/auth/google'
  if (redirectUrl) {
    return `${googleAuthUrl}?${qs.stringify({ redirectUrl })}`
  }
  return googleAuthUrl
}
const usersController = {
  signUpPage: (req, res) => {
    const countryOptions = [
      'Australia',
      'Canada',
      'HongKong',
      'Indonesia',
      'Japan',
      'Korea',
      'Singapore',
      'Taiwan',
      'Thailand',
      'United Kingdom',
      'United States',
    ]
    const googleAuthUrl = generateGoogleAuthUrl(req)
    res.render('signup', { countryOptions, googleAuthUrl })
  },
  signUp: async (req, res, next) => {
    try {
      const { email, name, password, passwordCheck, userType: type } = req.body
      if (password !== passwordCheck) throw new Error('密碼與確認密碼不相同')

      const userCount = await User.count({ where: { email, type } })
      if (userCount) throw new Error('帳號已存在')

      await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10)
      })
      req.flash('success_messages', '註冊帳號成功')
      res.redirect('/signin')
    } catch (error) {
      next(error)
    }
  },
  signInPage: (req, res) => {
    const googleAuthUrl = generateGoogleAuthUrl(req)
    res.render('signin', { googleAuthUrl })
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    if (helpers.getUser(req).isTeacher) return res.redirect('/profile')
    res.redirect('/')
  },
  logout: (req, res, next) => {
    req.flash('success_messages', '登出成功！')
    req.logout(err => {
      if (err) return next(err)
      res.redirect('/')
    })
  },
  profilePage: async (req, res, next) => {
    try {
      const user = helpers.getUser(req)
      const extra = {}
      let page = ''
      if (user.isTeacher) {
        page = 'teacher'
        extra.tutorId = user.Tutor.id
        extra.tutorIntroduction = user.Tutor.introduction
        const courses = await courseService.findAllByTutor(user.Tutor) || []
        const week = getWeek(new Date())
        const formatCourse = (course) => ({
          id: course.id,
          startTime: format(course.startTime, 'yyyy-MM-dd HH::mm'),
          comment: course.comment || '',
          score: course.score || 0,
          userName: course.User.name,
          userAvatar: course.User.avatar,
        })
        extra.newCourses = courses
          .filter(course => course.status === COURSE_SUBMIT && getWeek(course.startTime) === week)
          .map(course => formatCourse(course))
        extra.completeCourses = courses
          .filter(course => course.status === COURSE_COMPLETE)
          .map(course => formatCourse(course))
      } else {
        page = 'student'
        const courses = await courseService.findAllByStudent(user) || []
        const formatCourse = (course) => ({
          id: course.id,
          startTime: format(course.startTime, 'yyyy-MM-dd HH::mm'),
          teacherName: course.Tutor.dataValues.teacherName,
          link: course.Tutor.link,
        })
        extra.newCourses = courses
          .filter(course => isAfter(course.startTime, new Date()))
          .map(course => formatCourse(course))
        extra.completeCourses = courses
          .filter(course => course.status === COURSE_COMPLETE)
          .map(course => formatCourse(course))
      }
      res.render(page, { extra })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = usersController