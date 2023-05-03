'use strict'
const bcrypt = require('bcrypt')
const {
  randFirstName,
  randEmail,
  randCountry,
  randNumber,
  randParagraph,
  randUrl,
  randSentence
} = require('@ngneat/falso')

const SERVICE_MAP = {
  '0': [0, 1, 2, 3, 4, 5, 6],
  '1': [0, 2, 4, 6],
  '2': [1, 3, 5],
  '3': [1, 2, 3, 4, 5],
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users',
      [
        ...Array.from({ length: 12 }).map(() => ({
          name: randFirstName({ gender: 'female' }),
          email: randEmail({ suffix: 'com' }),
          password: bcrypt.hashSync('12345678', 10),
          avatar: `https://loremflickr.com/400/400/girl?lock=${randNumber({ min: 1, max: 30000 })}`,
          description: randParagraph(),
          country: randCountry(),
          is_teacher: true,
          created_at: new Date(),
          updated_at: new Date(),
        })),
        {
          name: 'Admin',
          email: 'root@email',
          password: '12345678',
          avatar: `https://loremflickr.com/400/400/girl?lock=${randNumber({ min: 1, max: 30000 })}`,
          description: randParagraph(),
          country: randCountry(),
          is_teacher: false,
          is_admin: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
    )
    await queryInterface.bulkInsert('Tutors',
      Array.from({ length: 12 }).map((_, i) => ({
        user_id: i + 1,
        introduction: randSentence(),
        teaching_style: randParagraph(),
        duration: randNumber({ min: 3, max: 9 }) * 10,
        link: randUrl(),
        service_availability: JSON.stringify(SERVICE_MAP[`${randNumber({ min: 0, max: 3 })}`]),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
    await queryInterface.bulkDelete('Tutors', {})
  }
}
