const Router = require('koa-router')
const controller = require('../Controller/user.js')
const Joi = require('joi')
const newUserSchema = require('../ValidationSchemas/newUser')
const updatedUserSchema = require('../ValidationSchemas/updatedUser')
const validator = require('../CustomValidators/user.js')

const router = new Router({
    prefix: '/users'
})

router.post('/register', async (ctx) => {
    let newUser = ctx.request.body
    const {error} = Joi.validate(newUser, newUserSchema, {abortEarly: false})
    const username = ctx.request.body.username

    if (!error) {
        const isUnique = await validator.checkUsername(username)
        const hasWhiteSpaces = validator.checkForSpaces(username)
        if (isUnique && !hasWhiteSpaces) {
            ctx.body = await controller.createUser(newUser)
            ctx.status = 201
        } else {
            ctx.body = ['Username cannot contain white spaces and must be unique.']
            ctx.status = 400
        }
    } else {
        ctx.body = error.details.map(e => e.message)
        ctx.status = 400
    }
})

router.post('/login', async (ctx) => {
    let user = ctx.request.body
    if (validator.checkLoginData(user)) {
        const {username} = user
        const id = await controller.getIdByUsername(username)
        if (id && await controller.checkCredentials(id, user)) {
            ctx.body = await controller.getUserWithId(id)
            ctx.status = 202
        } else {
            ctx.body = "Invalid credentials."
            ctx.status = 404
        }
    } else {
        ctx.status = 400;
    }
})

router.get('/all', async (ctx) => {
    ctx.body = await controller.getAllUsers()
    ctx.status = 200
})

router.get('/:id', async (ctx) => {
    ctx.body = await controller.getUser(ctx.params.id)
    ctx.status = 200
})


router.put('/', async (ctx) => {
    const {error} = Joi.validate(ctx.request.body, updatedUserSchema, {abortEarly: false})
    if (!error) {
        await controller.updateUser(ctx.request.body)
        ctx.status = 202
    } else {
        ctx.body = error.details.map(e => e.message)
        ctx.status = 400
    }
})

module.exports = router