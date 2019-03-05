let Pusher = require('pusher')

let pusher = new Pusher({
    appId: '677273',
    key: '8c9a80751de41339a2ad',
    secret: 'a61c3b57248339030d62',
    cluster: 'eu',
    encrypted: true
})


module.exports = pusher