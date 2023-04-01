const Joi = require('joi')
const schemas = {
  create: Joi.object().keys({
    startTime: Joi.date().greater('now').required(),
  }),
}

module.exports = schemas