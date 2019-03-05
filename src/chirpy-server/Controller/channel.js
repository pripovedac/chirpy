let redis = require('redis')
let bluebird = require('bluebird')
let client = redis.createClient()

bluebird.promisifyAll(redis)

exports.getChannelId = async (senderId, receiverId) => {
    const firstKey = createUserChannelKey(senderId, receiverId)
    const secondKey = createUserChannelKey(receiverId, senderId)
    let channelId = await client.getAsync(firstKey)
    if (channelId == null) {
        const channelCounter = await client.incrAsync('channelCounter')
        await client.multi()
            .set(firstKey, channelCounter)
            .set(secondKey, channelCounter)
            .execAsync()
        channelId = channelCounter
    }
    return channelId
}

// Helper functions
createUserChannelKey = (senderId, receiverId) => `user:${senderId}#${receiverId}:channel`