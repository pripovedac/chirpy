const Joi = require('joi')

const newUser = Joi.object().keys({
    username: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = newUser