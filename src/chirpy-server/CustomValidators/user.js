let redis = require('redis')
let bluebird = require('bluebird')
bluebird.promisifyAll(redis)
let client = redis.createClient()

exports.checkRegistrationData = (user) => {
    const res =
        user.password.length > 0 &&
        user.username.length > 0 &&
        user.email.length > 0
    return res
}

exports.checkLoginData = (user) => {
    return user.password.length > 0 &&
        user.username.length > 0
}

exports.checkUsername = async (username) => {
    const listLength = await client.llenAsync('users')
    const keys = await client.lrangeAsync('users', 0, listLength)
    const usernames = await Promise.all(keys.map(key => client.hmgetAsync(key, 'username')))
    return usernames.find(u => u[0] == username) == undefined
}

exports.checkForSpaces = (username) => {
    return username.indexOf(' ') >= 0
}