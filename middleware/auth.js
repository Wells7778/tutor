const helpers = require('../helpers/auth.helper')
const qs = require('querystring')

const generateRedirectPath = (req, path) => {
  const payload = { redirectUrl: req.originalUrl }
  return `${path}?${qs.stringify(payload)}`
}

const authenticated = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) return next()
  const path = generateRedirectPath(req, '/signin')
  res.redirect(path)
}
const authenticatedAdmin = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) return next()

    res.redirect('/')
  } else {
    const path = generateRedirectPath(req, '/signin')
    res.redirect(path)
  }
}

const authenticatedTeacher = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isTeacher) return next()

    res.redirect('/tutors')
  } else {
    const path = generateRedirectPath(req, '/signin')
    res.redirect(path)
  }
}

const authenticatedStudent = (req, res, next) => {
  if (helpers.ensureAuthenticated(req)) {
    if (!helpers.getUser(req).isTeacher) return next()

    res.redirect('/profile')
  } else {
    const path = generateRedirectPath(req, '/signin')
    res.redirect(path)
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedTeacher,
  authenticatedStudent,
}