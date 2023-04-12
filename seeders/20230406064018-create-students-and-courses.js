'use strict'
const bcrypt = require('bcrypt')
const {
  randFirstName,
  randCountry,
  randNumber,
  randParagraph,
  randText
} = require('@ngneat/falso')
const { User, Tutor, Course } = require('../models')
const getWeek = require('date-fns/getWeek')
const { getAvailTimes } = require('../services/course.services')
const { COURSE_COMPLETE } = require('../constants/course.status')
const { calculateRank, calculateTutorAvgScores } = require('../services/user.services')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',
      Array.from({ length: 30 }).map((_, index) => ({
        name: randFirstName(),
        email: `user${index + 1}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        avatar: `https://loremflickr.com/400/400/boy?lock=${randNumber({ min: 1, max: 30000 })}`,
        description: randParagraph(),
        country: randCountry(),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
    const users = await User.findAll({
      where: {
        isTeacher: false,
      }
    })
    const tutors = await Tutor.findAll({
      include: [Course]
    })
    const courses = []
    const records = {}
    for(let i in tutors) {
      const tutor = tutors[i]
      const times = await getAvailTimes(tutor)
      times.forEach(time => {
        const startTime = new Date(time)
        const year = startTime.getFullYear()
        const week = getWeek(startTime)
        const item = {
          user_id: users[randNumber({ min: 0, max: users.length - 1 })].id,
          tutor_id: tutor.id,
          status: COURSE_COMPLETE,
          start_time: startTime,
          score: randNumber({ min: 1, max: 5, fraction: 1 }),
          comment: randText({ charCount: 100 }),
          created_at: new Date(),
          updated_at: new Date(),
        }
        courses.push(item)
        const key = [item.user_id, year, week].join('#')
        if (!Object.prototype.hasOwnProperty.call(records, key)) {
          records[key] = {
            user_id: item.user_id,
            year,
            week,
            learned_minutes: 0,
            created_at: new Date(),
            updated_at: new Date(),
          }
        }
        records[key].learned_minutes += tutor.duration
      })
    }
    await queryInterface.bulkInsert('Courses', courses)
    await queryInterface.bulkInsert('Records', Object.values(records))
    for(let i in users) {
      const student = users[i]
      await calculateRank(student.id)
    }
    for (let i in tutors) {
      const tutor = tutors[i]
      await calculateTutorAvgScores(tutor.UserId)
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
}
