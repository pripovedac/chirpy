let redis = require('redis')
let bluebird = require('bluebird')
let client = redis.createClient()
bluebird.promisifyAll(redis)

exports.createComment = async (comment) => {
    const username = await client.hgetAsync(createUserKey(comment.id), 'username')
    const commentCount = await client.incrAsync('commentCount')
    const commentKey = createCommentKey(commentCount)
    const postId = comment.postId

    const date = new Date();
    const commentObject = {
        username,
        postId,
        id: commentCount,
        comment: comment.comment,
        date: date.getDate() + '/' + formatMonth(date.getMonth()) + '/' + date.getFullYear(),
        time: formatTime(date.getHours()) + ':' + formatTime(date.getMinutes())
    }

    await client.multi()
        .hmset(commentKey, commentObject)
        .rpush(createPostCommentKey(postId), commentKey)
        .execAsync()

    return commentObject

}
exports.getComments = async (id) => {
    const listName = createPostCommentKey(id)
    const listLength = await client.llenAsync(listName)
    const commentIdList = await client.lrangeAsync(listName, 0, listLength)
    return await Promise.all(commentIdList.map(id => client.hgetallAsync(id)))
}

exports.deleteComment = async (postId, commentId) => {
    const commentKey = createCommentKey(commentId)

    await client.multi()
        .lrem(createPostCommentKey(postId), 0, commentKey)
        .del(commentKey)
        .execAsync()
}


// Helper functions
createCommentKey = id => `comment:${id}:id`

createUserKey = id => `user:${id}:id`

createUserPostKey = id => `user:${id}:post`

createPostCommentKey = id => `post:${id}:comment`

formatTime = time => time < 10 ? '0' + time : time

formatMonth = month => month + 1