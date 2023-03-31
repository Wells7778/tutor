const db = require('../models')
const { User } = db

const changeRole = (user, { role }) => {
  if (role === 'teacher') {
    user.isTeacher = true
  } else {
    user.isTeacher = false
  }
  return user.save()
}

const rankStudents = () => {
  return User.findAll({
    where: { isTeacher: false },
    order: [['score', 'DESC']]
  })
}


module.exports = {
  changeRole,
  rankStudents,
}
