const Router = require('koa-router')
const controller = require('../Controller/message.js')
const Joi = require('joi')
const newMessageSchema = require('../ValidationSchemas/newMessage')
const pusher = require('../pusher')

const router = new Router({
    prefix: '/messages'
})

router.post('/', async (ctx) => {
    let message = ctx.request.body
    let newMessage = {}

    const {error} = Joi.validate(message, newMessageSchema, {abortEarly: false})
    if (!error) {
        newMessage = await controller.createMessage(message)
        ctx.body = newMessage
        ctx.status = 201
    } else {
        ctx.body = 'I cannot accept an empty message, sorry, chirper.'
        ctx.status = 400
        return
    }
     pusher.trigger(ctx.request.body.channel, 'new-message', newMessage)
     pusher.trigger(`chatroom${ctx.request.body.receiverId}`, 'new-notification', ctx.request.body.senderId)
})

router.get('/', async (ctx) => {
    const messages = await controller.getAllMessages(ctx.query.senderId, ctx.query.receiverId)
    ctx.body = messages
    ctx.status = 200
})


module.exports = router