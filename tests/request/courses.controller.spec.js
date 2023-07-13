const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const sinon = require('sinon');
const coursesController = require('../../controllers/courses.controller');
const helpers = require('../../helpers/auth.helper')
const db = require('../../models');

const expect = chai.expect;

describe('coursesController', () => {
  const clearDB = async () => {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true })
    await db.User.destroy({ where: {}, truncate: true, force: true })
    await db.Tutor.destroy({ where: {}, truncate: true, force: true })
    await db.Course.destroy({ where: {}, truncate: true, force: true })
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true })
  }
  let user, tutor, teacher, course, sandbox
  beforeEach(async () => {
    user = await db.User.create({
      email: 'user@example.com',
      password: '12345678'
    })
    anotherUser = await db.User.create({
      email: 'user@example.com',
      password: '12345678'
    })
    teacher = await db.User.create({
      name: 'John Doe',
      email: 'teacher@example.com',
      password: '12345678',
      isTeacher: true
    })
    anotherTeacher = await db.User.create({
      name: 'John Doe2',
      email: 'teacher2@example.com',
      password: 'XXXXXXXX',
      isTeacher: true
    })
    tutor = await db.Tutor.create({
      UserId: teacher.id,
      link: 'https://example.com'
    })
    anotherTutor = await db.Tutor.create({
      UserId: anotherTeacher.id,
      link: 'https://example.com'
    })
    course = await db.Course.create({
      TutorId: anotherTutor.id,
      UserId: user.id,
      startTime: '2023-07-12 10:00'
    })
    anotherCourse = await db.Course.create({
      TutorId: anotherTutor.id,
      UserId: anotherUser.id,
      startTime: '2023-07-12 10:00'
    })
    sandbox = sinon.createSandbox();
  });

  afterEach(async () => {
    await clearDB();
    sandbox.restore();
  });

  describe('create', () => {
    it('should create a course', async () => {
      const req = {
        params: {
          tutorId: tutor.id
        },
        validBody: {
          startTime: '2023-07-11 10:00'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.stub();
      sandbox.stub(helpers, 'getUser').returns(user);

      await coursesController.create(req, res, next);

      expect(helpers.getUser).to.be.calledWith(req);
      expect(res.json).to.be.calledWith({
        data: {
          tutorName: 'John Doe',
          link: 'https://example.com',
          startTime: '2023-07-11 10:00'
        }
      });
    });

    it('should return 404 if tutor not found', async () => {
      const req = {
        params: {
          tutorId: '123'
        },
        validBody: {
          startTime: '2023-07-11 10:00'
        }
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };
      const next = sinon.stub();
      const user = { id: 'user123' };
      sandbox.stub(helpers, 'getUser').returns(user);

      await coursesController.create(req, res, next);

      expect(helpers.getUser).to.be.calledWith(req);
      expect(res.status).to.be.calledWith(404);
      expect(res.json).to.be.calledWith('tutor not found');
    });

    it('should call next with error', async () => {
      const req = {
        params: {
          tutorId: '123'
        },
        validBody: {}
      };
      const res = {};
      const next = sinon.stub();
      const error = new Error('Some error');
      sandbox.stub(helpers, 'getUser').throws(error);

      await coursesController.create(req, res, next);

      expect(next).to.be.calledWith(error);
    });
  });

  describe('score', () => {
    it('should complete course and return course ID', async () => {
      const req = {
        params: {
          id: course.id
        },
        validBody: {
          score: 3,
          comment: 'Foo Bar'
        }
      };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();
      sandbox.stub(helpers, 'getUser').returns(user);

      await coursesController.score(req, res, next);
      const afterTeacher = await db.User.findOne({ where: { id: anotherTeacher.id } });

      expect(helpers.getUser).to.be.calledWith(req);
      expect(res.json).to.be.calledWith({ id: course.id });
      expect(afterTeacher.score).to.be.equal('3.0');
      expect(afterTeacher.tutorCoursesCount).to.be.equal(1);
    });

    it('should return "不是自己的課程" if course does not belong to user', async () => {
      const req = {
        params: {
          id: anotherCourse.id
        },
        validBody: {
          score: 1,
          comment: 'Foo Bar'
        }
      };
      const res = {
        json: sinon.stub()
      };
      const next = sinon.stub();
      sandbox.stub(helpers, 'getUser').returns(user);

      await coursesController.score(req, res, next);

      expect(helpers.getUser).to.be.calledWith(req);
      expect(res.json).to.be.calledWith({ message: '不是自己的課程' });
    });

    it('should call next with error', async () => {
      const req = {
        params: {
          id: course.id
        },
        validBody: {}
      };
      const res = {};
      const next = sinon.stub();
      const error = new Error('Some error');
      sandbox.stub(helpers, 'getUser').throws(error);

      await coursesController.score(req, res, next);

      expect(next).to.be.calledWith(error);
    });
  });
});