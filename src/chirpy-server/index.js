const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-body-parser')
const userRouter = require('./Routes/user')
const postRouter = require('./Routes/post')
const commentRouter = require('./Routes/comment')
const messageRouter = require('./Routes/message')
const channelRouter = require('./Routes/channel')
const combineRouters = require('koa-combine-routers')
const cors = require('@koa/cors')

console.log('It\'s on!')

const mainRouter = combineRouters(
    userRouter,
    postRouter,
    commentRouter,
    messageRouter,
    channelRouter)

const app = new Koa()

app
    .use(cors({origin: 'http://localhost:8080'}))
    .use(bodyParser())
    .use(mainRouter())


app.listen(3030)

console.log('I\'m waiting, boi!')