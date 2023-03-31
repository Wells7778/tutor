const db = require('../models')
const { Tutor, User } = db


const index = () => {
  return Tutor.findAll({
    attributes: [
      'id',
      'introduction'
    ],
    include: [
      {
        model: User,
        attributes: [
          'name',
          'avatar',
          'country'
        ]
      }
    ],
    raw: true,
    nest: true
  })
}
const create = (user, params) => {
  return Tutor.create({
    userId: user.id,
    ...params
  })
}
const update = async (id, { introduction, teachingStyle, duration, link, serviceAvailability }) => {
  const tutor = await findById(id)
  if (!tutor) throw new Error('Tutor not found!')

  tutor.introduction = introduction
  tutor.teachingStyle = teachingStyle
  tutor.duration = duration
  tutor.link = link
  tutor.serviceAvailability = serviceAvailability
  await tutor.save()
  return tutor
}

const findById = (id) => {
  return Tutor.findOne({
    where: { id },
    include: User
  })
}

const findByUser = (userId) => {
  return Tutor.findAll({
    where: { userId },
    raw: true,
  })
}

module.exports = {
  index,
  create,
  update,
  findById,
  findByUser,
}