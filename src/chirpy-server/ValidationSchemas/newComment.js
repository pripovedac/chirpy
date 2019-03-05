const Joi = require('joi')

const newPost = Joi.object().keys({
    id: Joi.required(),
    postId: Joi.required(),
    comment: Joi.string().required(),
})

module.exports = newPost