const Router = require('koa-router')
const controller = require('../Controller/channel.js')
const router = new Router()

router.get('/channels', async (ctx) => {
    // complete route name with query params:
    // channels?senderId=n&receiverId=m
    let channelId = await controller.getChannelId(ctx.query.senderId, ctx.query.receiverId)
    ctx.body = channelId
    ctx.status = 200
})

module.exports = router