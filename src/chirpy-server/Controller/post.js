const redis = require('redis')
const bluebird = require('bluebird')
const client = redis.createClient()

bluebird.promisifyAll(redis)

exports.createPost = async (post) => {
    const username = await client.hgetAsync(`user:${post.id}:id`, 'username')
    const postCount = await client.incrAsync('postCount')
    const postKey = createPostKey(postCount)

    const date = new Date();
    const postObject = {
        username,
        id: postCount,
        post: post.post,
        date: date.getDate() + '/' + formatMonth(date.getMonth()) + '/' + date.getFullYear(),
        time: formatTime(date.getHours()) + ':' + formatTime(date.getMinutes())
    }

    const userId = createUserPostKey(post.id)

    await client.multi()
        .lpush('posts', postKey)
        .hmset(postKey, postObject)
        .lpush(userId, postKey)
        .execAsync()

    return postObject
}

exports.getAllPosts = async () => {
    const listLength = await client.llenAsync('posts')
    const postIdList = await client.lrangeAsync('posts', 0, listLength)
    return await Promise.all(postIdList.map(id => client.hgetallAsync(id)))
}

exports.getUserPosts = async (id) => {
    const listKey = createUserPostKey(id)
    const listLength = await client.llenAsync(listKey)
    const postIdList = await client.lrangeAsync(listKey, 0, listLength)
    return await Promise.all(postIdList.map(id => client.hgetallAsync(id)))
}

exports.getComments = async (id) => {
    const listName = (createPostCommentKey(id))
    const listLength = await client.llenAsync(listName)
    const commentIdList = await client.lrangeAsync(listName, 0, listLength)
    return await Promise.all(commentIdList.map(id => client.hgetallAsync(id)))
}


exports.deletePost = async (postId, userId) => {
    const postKey = createPostKey(postId)
    const commentList = createPostCommentKey(postId)
    const commentListLength = await client.llenAsync(commentList)
    const commentKeys = await client.lrangeAsync(commentList, 0, commentListLength)

    await client.multi()
        .lrem('posts', 0, postKey)
        .lrem(createUserPostKey(userId), 0, postKey)
        .del([postKey, commentList, ...commentKeys])
        .execAsync()
}

// Helper functions
createPostKey = id => `post:${id}:id`

createUserPostKey = id => `user:${id}:post`

createPostCommentKey = id => `post:${id}:comment`

formatTime = time => time < 10 ? '0' + time : time

formatMonth = month => month + 1