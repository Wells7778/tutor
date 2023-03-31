const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/', (req, res) => res.redirect('/tutors'))
router.use((req, res, next) => {
  res.status(404).end()
})
router.use('/', generalErrorHandler)

module.exports = router
