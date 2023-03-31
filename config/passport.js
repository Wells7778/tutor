const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20')
const bcrypt = require('bcrypt')
const db = require('../models')
const { User, Tutor, Course } = db

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (req, email, password, done) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
        const compareRes = bcrypt.compareSync(password, user.password)
        if (!compareRes) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))

        return done(null, user)
      })
  }
))

passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const state = JSON.parse(req.query.state)
      const { country } = state || {}
      const { id: googleId } = profile
      const { email, name, picture: avatar } = profile._json
      const randomPassword = Math.random().toString(36).slice(-8)
      const password = bcrypt.hashSync(randomPassword, 10)
      const [student] = await User.findOrCreate({
        where: { googleId, email },
        defaults: {
          name,
          avatar,
          password,
          country,
        }
      })
      done(null, student)
    } catch (error) {
      done(error, null)
    }
  })
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findOne({
    where: { id },
    include: [
      {
        model: Tutor,
        include: [Course],
      },
      {
        model: Course
      }
    ],
  }).then(user => {
    return done(null, user)
  })
})
module.exports = passport