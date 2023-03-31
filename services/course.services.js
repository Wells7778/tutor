const db = require('../models')
const { Course, Tutor } = db

const create = (user, { role }) => {
  if (role === 'teacher') {
    user.isTeacher = true
  } else {
    user.isTeacher = false
  }
  return user.save()
}

const getAvailTime = (tutor) => {
  const { duration, serviceAvailability } = tutor

}


module.exports = {
  create,
  getAvailTime,
}
