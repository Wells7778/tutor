const Joi = require('joi')
const schemas = {
  create: Joi.object().keys({
    introduction: Joi.string().required(),
    teachingStyle: Joi.string().required(),
    duration: Joi.number().required(),
    link: Joi.string().required(),
    serviceAvailability: Joi.array().items(Joi.number()).max(7).unique()
  }),
}

module.exports = schemas