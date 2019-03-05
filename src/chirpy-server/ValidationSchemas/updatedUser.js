const Joi = require('joi')

const updatedUser = Joi.object().keys({
    username: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    name: Joi.optional(),
    lastname: Joi.optional(),
    password: Joi.optional(),
    id: Joi.optional(),
    town: Joi.optional()
})

module.exports = updatedUser