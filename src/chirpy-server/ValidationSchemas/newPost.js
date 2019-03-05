const Joi = require('joi')

const newPost = Joi.object().keys({
    id: Joi.required(),
    post: Joi.string().required(),
})

module.exports = newPost