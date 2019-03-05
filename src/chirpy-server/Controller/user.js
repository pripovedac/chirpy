let redis = require('redis')
let bluebird = require('bluebird')

bluebird.promisifyAll(redis)
let client = redis.createClient()
let multi = client.multi()

exports.getUserId = async () => {
    const userCount = await client.getAsync('userCount')
    return userCount
}

exports.createUser = async (value) => {
    await client.incrAsync('userCount')
    const userCount = await client.getAsync('userCount')
    const key = createUserKey(userCount)
    value.id = userCount
    const {username} = value

    await client.multi()
        .lpush('users', key)
        .hmset(key, value)
        .set(createUsernameKey(username), key)
        .execAsync()

    return {
        id: userCount,
        username
    }
}

exports.updateUser = async (user) => {
    // HMSET se koristi jer se ne dozvoljava promena password-a i id-ja
    const id = user.id
    const dataArray = [
        'username', user.username,
        'email', user.email,
        'name', user.name,
        'lastname', user.lastname,
        'town', user.town
    ]
    await client.hmsetAsync(createUserKey(id), dataArray)
}

exports.getUser = async (id) => {
    const key = createUserKey(id)
    return await client.hgetallAsync(key)
}

exports.getAllUsers = async () => {
    const listLength = await client.llenAsync('users')
    const keys = await client.lrangeAsync('users', 0, listLength)
    const usernames = await Promise.all(keys.map(key => client.hmgetAsync(key, 'username', 'id')))
    const sortedUsers = usernames.sort()
    return convertToObjects(sortedUsers)
}

exports.getIdByUsername = async (username) => {
    return await client.getAsync(createUsernameKey(username))
}

exports.checkCredentials = async (key, user) => {
    const dbUser = await client.hgetallAsync(key)
    if (dbUser) {
        const userMap = new Map([
            ['username', user.username],
            ['password', user.password]
        ])
        const dbUserMap = new Map([
            ['username', dbUser.username],
            ['password', dbUser.password]
        ])
        let result = true
        userMap.forEach((value, key) => {
            result = result && userMap.get(key) == dbUserMap.get(key)
        })
        return result
    } else {
        return false
    }
}

exports.getUserWithId = async (id) => {
    const user = await client.hgetallAsync(id)
    return {id: stripKey(id), ...user}
}

// Helper functions
createUserKey = id => `user:${id}:id`

stripKey = key => {
    const strip = key.slice(5, key.length)
    return strip.substring(0, strip.indexOf(':'))
}

createUsernameKey = username => `user:${username}:username`

convertToObjects = objArray => {
    const objectArray = objArray.map(data => {
        return {username: data[0], id: data[1]}
    })
    return objectArray
}

