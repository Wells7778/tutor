const db = require('../models')
const { User, Record, Course, Tutor, sequelize, Sequelize } = db
const { Op } = Sequelize
const PaginationService = require('./pagination.service')
const getWeek = require('date-fns/getWeek')

const changeRole = (user, { role }) => {
  if (role === 'teacher') {
    user.isTeacher = true
  } else {
    user.isTeacher = false
  }
  return user.save()
}

const rankStudents = (limit = 10) => {
  return User.findAll({
    attributes: [
      'name',
      'avatar',
      'totalMinutes',
      'isTeacher',
    ],
    where: { isTeacher: false },
    order: [['totalMinutes', 'DESC']],
    limit
  })
}

const index = ({ page = 1, limit = 6, search }) => {
  const paginationService = new PaginationService(User)
  const condition = {
    attributes: [
      'id',
      'name',
      'avatar',
      'country',
      'description',
      'score',
      'isTeacher',
    ],
    where: {
      isAdmin: false
    },
    raw: true,
  }
  if (search) {
    condition['where'] = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`
          }
        },
        {
          description: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  }
  const order = [['isTeacher', 'DESC'], ['score', 'DESC'], ['totalMinutes', 'DESC']]
  return paginationService.getPaginatedData({ page, limit, order, condition })
}

const rankStudentsByWeek = (limit = 10) => {
  const now = new Date()
  const year = now.getFullYear()
  const week = getWeek(now)
  return Record.findAll({
    where: {
      year,
      week,
    },
    include: [
      {
        model: User,
        attributes: [
          'name',
          'avatar',
          'isTeacher',
        ],
        where: {
          isTeacher: false
        }
      }
    ],
    order: [['learnedMinutes', 'DESC']],
    limit,
  })
}

const calculateRank = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Course,
        attributes: {
          include: [
            [
              sequelize.literal(`
                (SELECT SUM(Tutors.duration) FROM Tutors WHERE Tutors.id = Courses.tutor_id)
              `),
              'tutorMinutes'
            ]
          ]
        }
      }
    ]
  })
  user.totalMinutes = user.Courses.reduce((acc, course) => {
    return acc + Number(course.dataValues.tutorMinutes)
  }, 0)
  user.tutorCoursesCount = user.Courses.length

  await user.save()
}

// calculate user tutor avg scores
const calculateTutorAvgScores = async (id) => {
  const user = await User.findOne({
    where: { id },
    include: [
      {
        model: Tutor,
        attributes: {
          include: [
            [
              sequelize.literal(`
                (SELECT AVG(Courses.score) FROM Courses WHERE Courses.tutor_id = Tutor.id)
              `),
              'avgScore'
            ]
          ]
        }
      }
    ]
  })
  user.score = Number(user.Tutor.dataValues.avgScore).toFixed(2) || 0
  await user.save()
}

const getRank = async (id) => {
  const user = await User.findOne({
    where: { id },
    attributes: [
      'totalMinutes',
    ],
  })
  const rank = await User.count({
    where: {
      totalMinutes: {
        [Op.gt]: user.totalMinutes
      }
    }
  })
  return rank + 1
}

const getRankByWeek = async (id) => {
  const now = new Date()
  const year = now.getFullYear()
  const week = getWeek(now)
  const userMinutes = await Record.findOne({
    where: {
      user_id: id,
      year,
      week
    },
    attributes: [
      'learnedMinutes',
    ],
  })

  const rank = await Record.count({
    where: {
      learnedMinutes: {
        [Op.gt]: userMinutes.learnedMinutes
      }
    }
  })

  return rank + 1
}

module.exports = {
  index,
  changeRole,
  rankStudents,
  rankStudentsByWeek,
  calculateRank,
  calculateTutorAvgScores,
  getRank,
  getRankByWeek,
}
