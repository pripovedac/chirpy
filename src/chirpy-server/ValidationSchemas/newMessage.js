const Joi = require('joi')

const newPost = Joi.object().keys({
    senderId: Joi.required(),
    receiverId: Joi.required(),
    message: Joi.string().required(),
    channel: Joi.string().required()
})

module.exports = newPost