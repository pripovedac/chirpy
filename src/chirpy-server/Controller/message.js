let redis = require('redis')
let bluebird = require('bluebird')
let client = redis.createClient()

bluebird.promisifyAll(redis)

exports.createMessage = async (message) => {
    const sender = await client.hgetAsync(createUserKey(message.senderId), 'username')
    const messageCount = await client.incrAsync('messageCount')
    const messageKey = createMessageKey(messageCount)

    const messageObject = {
        username: sender,
        id: messageCount,
        message: message.message,
    }

    const senderReceiverList = createMessageListKey(message.senderId, message.receiverId)
    const srListLenght = await client.llenAsync(senderReceiverList)

    if (srListLenght > 0) {
        await client.multi()
            .rpush(senderReceiverList, messageKey)
            .hmset(messageKey, messageObject)
            .execAsync()
    } else {
        const receiverSenderList = createMessageListKey(message.receiverId, message.senderId)
        await client.multi()
            .rpush(receiverSenderList, messageKey)
            .hmset(messageKey, messageObject)
            .execAsync()
    }

    return messageObject
}

exports.getAllMessages = async (senderId, receiverId) => {
    const senderReceiverList = createMessageListKey(senderId, receiverId)
    const srlistLength = await client.llenAsync(senderReceiverList)
    if (srlistLength > 0) {
        const messageKeyList = await client.lrangeAsync(senderReceiverList, 0, srlistLength)
        return await Promise.all(messageKeyList.map(key => client.hgetallAsync(key)))
    } else {
        const receiverSenderList = createMessageListKey(receiverId, senderId)
        const rslistLength = await client.llenAsync(receiverSenderList)
        const messageKeyList = await client.lrangeAsync(receiverSenderList, 0, rslistLength)
        return await Promise.all(messageKeyList.map(key => client.hgetallAsync(key)))
    }

}

// Helper functions
createUserKey = id => `user:${id}:id`

createMessageKey = id => `message:${id}:id`

createMessageListKey = (sender, receiver) => `message:${sender}#${receiver}:list`
