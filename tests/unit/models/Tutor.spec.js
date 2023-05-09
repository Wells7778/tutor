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

describe('Tutor', () => {
  context('properties', () => {
    const tutor = new db.Tutor()
    ;[
      'introduction',
      'teachingStyle',
      'duration',
      'link',
      'serviceAvailability',
    ].forEach(checkPropertyExists(tutor))
  })

  context('associations', () => {
    const { DataTypes } = Sequelize
    const TutorFactory = proxyquire('../../../models/tutor.js', {
      sequelize: Sequelize
    })
    let Tutor
    const User = 'User'
    const Course = 'Course'
    before(() => {
      Tutor = TutorFactory(sequelize, DataTypes)
      Tutor.associate({ User })
      Tutor.associate({ Course })
    })

    it('defined a belongsTo association with Tutor', (done) => {
      expect(Tutor.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('defined a hasMany association with Course', (done) => {
      expect(Tutor.hasMany).to.have.been.calledWith(Course)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null
    it('create', done => {
      db.Tutor.create({ UserId: 1 }).then(tutor => {
        data = tutor
        done()
      }).catch(console.log)
    })
    // 檢查 db.Token 是否真的可以讀取一筆資料
    it('read', done => {
      db.Tutor.findByPk(data.id).then(tutor => {
        expect(data.id).to.be.equal(tutor.id)
        done()
      })
    })
    // 檢查 db.Token 是否真的可以更新一筆資料
    it('update', done => {
      db.Tutor.update({}, { where: { id: data.id } }).then(() => {
        db.Tutor.findByPk(data.id).then(tutor => {
          expect(data.updatedAt).to.be.not.equal(tutor.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.Token 是否真的可以刪除一筆資料
    it('delete', done => {
      db.Tutor.destroy({ where: { id: data.id } }).then(() => {
        db.Tutor.findByPk(data.id).then(tutor => {
          expect(tutor).to.be.equal(null)
          done()
        })
      })
    })
    after(async () => {
      // 清除測試資料庫資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
      await db.Tutor.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
    })
  })
})