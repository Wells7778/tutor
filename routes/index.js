const pageRouter = require('./page.js')
const tutorRouter = require('./tutors.js')
const courseRouter = require('./courses.js')
const authRouter = require('./auth.js')
const errorRouter = require('./error.js')
const { authenticated } = require('../middleware/auth.js')

module.exports = (app, passport) => {
  authRouter(app, passport)
  app.use('/tutors', tutorRouter)
  app.use(courseRouter)
  app.use(authenticated, pageRouter)
  app.use(errorRouter)
}