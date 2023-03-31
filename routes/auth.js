const usersController = require('../controllers/users.controller')
module.exports = (app, passport) => {
  app.get('/signup', usersController.signUpPage)
  app.post('/signup', usersController.signUp)
  app.get('/signin', usersController.signInPage)
  app.post('/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true,
    }),
    usersController.signIn
  )
  app.get('/logout', usersController.logout)
  app.get('/auth/google', (req, res, next) => {
    passport.authenticate('google', {
      scope: ['email', 'profile'],
      state: JSON.stringify({
        redirectUrl: req.query.redirectUrl,
        country: req.query.country,
      })
    })(req, res, next)
  })

  app.get('/auth/google/callback', (req, res, next) => {
    passport.authenticate('google',
      {
        successRedirect: JSON.parse(req.query.state)?.redirectUrl ? JSON.parse(req.query.state)?.redirectUrl : '/tutors',
        failureRedirect: '/signup'
      })(req, res, next)
  })
}