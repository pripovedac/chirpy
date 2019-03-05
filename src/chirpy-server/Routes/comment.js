const Router = require('koa-router')
const controller = require('../Controller/comment.js')
const Joi = require('joi')
const newCommentSchema = require('../ValidationSchemas/newComment')
const pusher = require('../pusher')

const router = new Router({
    prefix: '/comments'
})

router.post('/', async (ctx) => {
    let comment = ctx.request.body
    let newComment = {}

    const {error} = Joi.validate(comment, newCommentSchema, {abortEarly: false})
    if (!error) {
        newComment = await controller.createComment(comment)
        ctx.status = 201
    } else {
        ctx.body = error.details.map(e => e.message)
        ctx.status = 400
        return
    }

    pusher.trigger('comments', 'new-comment', newComment)
})

router.get('/:id', async (ctx) => {
    const comments = await controller.getComments()
    ctx.body = comments
    ctx.status = 200
})

router.delete('/', async (ctx) => {
    let {postId, commentId} = ctx.request.body
    await controller.deleteComment(postId, commentId)
    ctx.status = 200
})

module.exports = router