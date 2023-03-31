const bodyValidation = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if (!error) {
      req.validBody = value
      return next()
    }

    const { details } = error
    const message = details.map(i => i.message).join(',')

    req.flash('error_messages', message)
    res.redirect('back')
  }
}

module.exports = bodyValidation