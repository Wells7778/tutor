const Joi = require('joi')
const schemas = {
  create: Joi.object().keys({
    startTime: Joi.date().greater('now').required(),
  }),
  score: Joi.object().keys({
    score: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(100).required(),
  }),
}

module.exports = schemas