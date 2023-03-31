const env = process.env.NODE_ENV || 'development'
if (env !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const session = require('express-session')
const { engine } = require('express-handlebars')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('./config/passport')
const helpers = require('./helpers/auth.helper')
const handlebarsHelpers = require('./helpers/handlebars.helpers')
const app = express()
const port = Number(process.env.PORT) || 3000
const SESSION_SECRET = process.env.SECRET || 'secret'

// view engine setup
app.engine('hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.set('views', path.join('views'))
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('public'))
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)?.toJSON()
  next()
})

require('./routes')(app, passport)

app.listen(port, () => {
  console.info(`Express Listening on port ${port}`)
})

module.exports = app