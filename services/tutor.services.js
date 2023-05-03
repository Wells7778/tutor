const db = require('../models')
const { Tutor, User, Course, Sequelize } = db
const { Op, literal } = Sequelize
const PaginationService = require('./pagination.services')


const index = ({ page = 1, limit = 6, search }) => {
  const paginationService = new PaginationService(Tutor)
  const condition = {
    attributes: [
      'id',
      'introduction',
      'teachingStyle',
    ],
    include: [
      {
        model: User,
        attributes: [
          'name',
          'avatar',
          'country',
          'score',
        ]
      }
    ],
    raw: true,
    nest: true
  }
  if (search) {
    // search by user name and tutor introduction
    condition['where'] = {
      [Op.or]: [
        {
          '$User.name$': {
            [Op.like]: `%${search}%`
          }
        },
        {
          introduction: {
            [Op.like]: `%${search}%`
          }
        }
      ]
    }
  }
  // order by user score
  const order = [
    [literal('User.score'), 'DESC']
  ]
  return paginationService.getPaginatedData({ page, limit, order, condition })
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
    include: [
      {
        model: User,
        attributes: [
          'email',
          'name',
          'avatar',
          'description',
          'score',
          'tutorCoursesCount',
          'country',
        ],
      },
      {
        model: Course,
        attributes: [
          'startTime',
          'score',
          'comment',
        ],
      },
    ]
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