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
const isAfter = require('date-fns/isAfter')
const startOfTomorrow = require('date-fns/startOfTomorrow')
const subWeeks = require('date-fns/subWeeks')
const { getAvailTimes } = require('../services/course.services')
const { COURSE_SUBMIT, COURSE_COMPLETE } = require('../constants/course.status')
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
      const times = await getAvailTimes(tutor, { startTime: subWeeks(startOfTomorrow(), 1) })
      times.forEach(time => {
        const startTime = new Date(time)
        const year = startTime.getFullYear()
        const week = getWeek(startTime)
        const item = {
          user_id: users[randNumber({ min: 0, max: users.length - 1 })].id,
          tutor_id: tutor.id,
          status: COURSE_SUBMIT,
          start_time: startTime,
          created_at: new Date(),
          updated_at: new Date(),
        }
        if (isAfter(startTime, new Date()) && (randNumber({ min: 0, max: 10 }) >= 5)) {
          item.status = COURSE_COMPLETE
          item.score = randNumber({ min: 1, max: 5, fraction: 1 })
          item.comment = randText({ charCount: 100 })
        }
        courses.push(item)
        if (item.status === COURSE_COMPLETE) {
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
        }
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
    await queryInterface.bulkDelete('Courses', {})
    await queryInterface.bulkDelete('Records', {})
  }
}
