const chai = require('chai')
const proxyquire = require('proxyquire')
chai.use(require('sinon-chai'))
const { expect } = chai
const {
  sequelize,
  Sequelize,
  checkPropertyExists
} = require('sequelize-test-helpers')
const db = require('../../../models')

describe('Course', () => {
  context('properties', () => {
    const course = new db.Course()
    ;[
      'status',
      'startTime',
      'score',
      'comment',
    ].forEach(checkPropertyExists(course))
  })

  context('associations', () => {
    const { DataTypes } = Sequelize
    const CourseFactory = proxyquire('../../../models/course.js', {
      sequelize: Sequelize
    })
    let Course
    const User = 'User'
    const Tutor = 'Tutor'
    before(() => {
      Course = CourseFactory(sequelize, DataTypes)
      Course.associate({ User })
      Course.associate({ Tutor })
    })

    it('defined a belongsTo association with User', (done) => {
      expect(Course.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('defined a belongsTo association with Tutor', (done) => {
      expect(Course.belongsTo).to.have.been.calledWith(Tutor)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null
    it('create', done => {
      db.Course.create({ UserId: 1, TutorId: 1 }).then(course => {
        data = course
        done()
      }).catch(console.log)
    })
    // 檢查 db.Token 是否真的可以讀取一筆資料
    it('read', done => {
      db.Course.findByPk(data.id).then(course => {
        expect(data.id).to.be.equal(course.id)
        done()
      })
    })
    // 檢查 db.Token 是否真的可以更新一筆資料
    it('update', done => {
      db.Course.update({}, { where: { id: data.id } }).then(() => {
        db.Course.findByPk(data.id).then(course => {
          expect(data.updatedAt).to.be.not.equal(course.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.Token 是否真的可以刪除一筆資料
    it('delete', done => {
      db.Course.destroy({ where: { id: data.id } }).then(() => {
        db.Course.findByPk(data.id).then(course => {
          expect(course).to.be.equal(null)
          done()
        })
      })
    })
    after(async () => {
      // 清除測試資料庫資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
      await db.Course.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
    })
  })
})