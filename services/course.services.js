const db = require('../models')
const format = require('date-fns/format')
const startOfTomorrow = require('date-fns/startOfTomorrow')
const addWeeks = require('date-fns/addWeeks')
const isEqual = require('date-fns/isEqual')
const eachMinuteOfInterval = require('date-fns/eachMinuteOfInterval')
const getDay = require('date-fns/getDay')
const getWeek = require('date-fns/getWeek')
const isAfter = require('date-fns/isAfter')
const { COURSE_SUBMIT, COURSE_COMPLETE } = require('../constants/course.status')
const { Course, User, Tutor, Record, sequelize } = db
const { Op } = require('sequelize')

const _durationToInterval = (duration) => {
  const STEP = 30
  if (duration % STEP === 0) return duration + STEP
  const times = Math.ceil(duration / STEP)
  return STEP * times
}

const create = async (user, tutor, { startTime }) => {
  let course = await Course.findOne({
    where: {
      UserId: user.id,
      TutorId: tutor.id,
      startTime
    }
  })
  if (course) throw new Error('already has same time course')
  return Course.create({
    UserId: user.id,
    TutorId: tutor.id,
    status: COURSE_SUBMIT,
    startTime,
  })
}

const getAvailTimes = (tutor, { startTime = startOfTomorrow() }) => {
  const { duration, serviceAvailability } = tutor
  const existLessons = tutor.Courses.map(course => course.startTime)
  const step = _durationToInterval(duration)
  const start = startTime
  const end = addWeeks(start, 2)
  const availTimes = eachMinuteOfInterval({ start, end }, { step })
  return availTimes.filter((time) => {
    const weekday = getDay(time)
    const isExist = existLessons.some(lesson => isEqual(lesson, time))
    if (isExist) return false
    if (serviceAvailability.includes(weekday)) return true
    return false
  }).map(time => format(time, 'yyyy-MM-dd HH:mm'))
}

const checkCourses = async () => {
  const courses = await Course.findAll({
    attributes: [
      'id',
      'status',
      'startTime'
    ],
    where: {
      startTime: {
        [Op.lte]: new Date(),
      },
      status: {
        [Op.lt]: COURSE_COMPLETE,
      },
    },
    include: [
      {
        model: User,
        attributes: ['id'],
      },
      {
        model: Tutor,
        attributes: ['duration'],
      },
    ]
  })
  return Promise.all(
    courses
      .map(course => checkOut(course))
      .filter(Boolean)
  )
}

const checkOut = (course) => {
  if (isAfter(course.startTime, new Date())) return

  course.status = COURSE_COMPLETE
  return attend(course)
}

const findAllByStudent = async (student) => {
  await checkCourses()
  return Course.findAll({
    attributes: [
      'id',
      'status',
      'startTime',
      'comment',
    ],
    where: {
      UserId: student.id,
      comment: {
        [Op.is]: null,
      }
    },
    include: [
      {
        model: Tutor,
        attributes: [
          'link',
          [
            sequelize.literal(`(
              SELECT Users.name
              FROM Users
              WHERE Users.id = Tutor.user_id
            )`),
            'teacherName',
          ],
          [
            sequelize.literal(`(
              SELECT Users.avatar
              FROM Users
              WHERE Users.id = Tutor.user_id
            )`),
            'teacherAvatar',
          ]
        ]
      },
    ],
  })
}

const findAllByTutor = async (tutor) => {
  await checkCourses()
  return Course.findAll({
    attributes: [
      'id',
      'status',
      'startTime',
      'comment',
      'score',
    ],
    where: {
      TutorId: tutor.id,
    },
    include: [
      {
        model: User,
        attributes: [
          'name',
          'avatar',
        ],
      },
    ],
  })
}

const findById = (id) => {
  return Course.findOne({
    where: { id },
    include: [
      User,
      {
        model: Tutor,
        include: [User],
      },
    ],
  })
}

const attend = async (course) => {
  const t = await sequelize.transaction()
  try {
    const student = course.User
    const duration = course.Tutor.duration
    student.totalMinutes += duration
    const year = course.startTime.getFullYear()
    const week = getWeek(course.startTime)
    const condition = {
      UserId: student.id,
      year,
      week,
    }
    // eslint-disable-next-line no-unused-vars
    const [weekRecord, _] = await Record.findOrCreate({
      where: condition,
      defaults: condition,
      transaction: t
    })
    weekRecord.learnedMinutes += duration
    course.status = COURSE_COMPLETE
    await student.save({ transaction: t })
    await weekRecord.save({ transaction: t })
    await course.save({ transaction: t })
    await t.commit()
  } catch (error) {
    await t.rollback()
    throw error
  }
}

const complete = async (course, { score, comment }) => {
  const t = await sequelize.transaction()
  try {
    const teacher = course.Tutor.User
    let totalScore = teacher.score * teacher.tutorCoursesCount

    course.score = score
    course.comment = comment
    course.status = COURSE_COMPLETE

    teacher.tutorCoursesCount += 1
    teacher.score = (totalScore + score) / teacher.tutorCoursesCount

    await teacher.save({ transaction: t })
    await course.save({ transaction: t })
    await t.commit()
  } catch (error) {
    await t.rollback()
    throw error
  }
}

module.exports = {
  create,
  getAvailTimes,
  findAllByTutor,
  findAllByStudent,
  findById,
  attend,
  complete,
}
