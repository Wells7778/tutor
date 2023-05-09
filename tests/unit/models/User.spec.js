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
const bcrypt = require('bcrypt')
const { randEmail } = require('@ngneat/falso')

describe('User', () => {
  context('properties', () => {
    const user = new db.User()
    ;[
      'googleId',
      'name',
      'email',
      'password',
      'avatar',
      'description',
      'isTeacher',
      'isAdmin'
    ].forEach(checkPropertyExists(user))
  })

  context('associations', () => {
    const { DataTypes } = Sequelize
    const UserFactory = proxyquire('../../../models/user.js', {
      sequelize: Sequelize
    })
    let User
    const Tutor = 'Tutor'
    const Course = 'Course'
    before(() => {
      User = UserFactory(sequelize, DataTypes)
      User.associate({ Tutor })
      User.associate({ Course })
    })

    it('defined a hasOne association with Tutor', (done) => {
      expect(User.hasOne).to.have.been.calledWith(Tutor)
      done()
    })

    it('defined a hasMany association with Course', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Course)
      done()
    })
  })

  // 檢查 model 的新增、修改、刪除、更新
  context('action', () => {
    let data = null
    it('create', done => {
      db.User.create({ email: randEmail(), password: bcrypt.hashSync('12345678', 10) }).then(user => {
        data = user
        done()
      }).catch(console.log)
    })
    // 檢查 db.Token 是否真的可以讀取一筆資料
    it('read', done => {
      db.User.findByPk(data.id).then(user => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    // 檢查 db.Token 是否真的可以更新一筆資料
    it('update', done => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    // 檢查 db.Token 是否真的可以刪除一筆資料
    it('delete', done => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then(user => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
    after(async () => {
      // 清除測試資料庫資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
      await db.User.destroy({ where: {}, truncate: true, force: true })
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
    })
  })
})