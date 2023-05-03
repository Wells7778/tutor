const Joi = require('joi')
const schemas = {
  update: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
  }),
}

module.exports = schemas