const db = require('../models')
const { User, Record } = db
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


module.exports = {
  changeRole,
  rankStudents,
  rankStudentsByWeek,
}
