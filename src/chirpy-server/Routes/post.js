const Router = require('koa-router')
const controller = require('../Controller/post.js')
const Joi = require('joi')
const newPostSchema = require('../ValidationSchemas/newPost')
const pusher = require('../pusher')

const router = new Router({
    prefix: '/posts'
})

router.post('/', async (ctx) => {
    let post = ctx.request.body
    let newPost = {}
    const {error} = Joi.validate(post, newPostSchema, {abortEarly: false})
    if (!error) {
        newPost = await controller.createPost(post)
        ctx.status = 201
    } else {
        ctx.body = error.details.map(e => e.message)
        ctx.status = 400
        return
    }
    pusher.trigger('postCreation', 'new-post', newPost)
})

router.get('/', async (ctx) => {
    const posts = await controller.getAllPosts()
    ctx.body = posts
    ctx.status = 200
})

router.get('/:id', async (ctx) => {
    const posts = await controller.getUserPosts(ctx.params.id)
    ctx.body = posts
    ctx.status = 200
})

router.get('/comments/:id', async (ctx) => {
    const postId = ctx.params.id
    ctx.body = await controller.getComments(postId)
    ctx.status = 200
})

router.delete('/', async (ctx) => {
    await controller.deletePost(ctx.query.postId, ctx.query.userId)
    pusher.trigger('postDeletion', 'delete-post',
        {
            postId: ctx.query.postId,
            userId: ctx.query.userId
        })
    ctx.status = 200
})

module.exports = router

