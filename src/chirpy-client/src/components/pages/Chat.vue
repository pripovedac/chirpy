<template>
    <Paper>
        <div class="header">
            <div class="titles">
                <router-link :to="{name: 'Home'}">
                    <ChevronsLeftIcon></ChevronsLeftIcon>
                    Back to home page
                </router-link>
                <h1>Sooo chirpy!</h1>
                <router-link :to="{path: `/profile/?id=${senderId}`}">
                    Checkout user profiles
                    <ChevronsRightIcon></ChevronsRightIcon>
                </router-link>
            </div>
            <div class="lower-header">
                <h2>@{{senderUsername}}</h2>
                <TwitterIcon class="icon"></TwitterIcon>
            </div>
        </div>

        <div class="chat-container">
            <ChatForm id="form"
                      :messages="messages"
                      :hasReceiver="activeReceiver.id != undefined"
                      @sendMessage="sendMessage($event)"></ChatForm>
            <div class="username-container">
                <h3>Chirpers</h3>
                <div v-if="users.length > 0" class="user-list">
                    <button
                            v-for="user in users" :key="user.id"
                            @click="selectReceiver(user)">
                        {{user.username}}
                        <MailIcon class="msg-icon" v-if="checkIfExists(user.id, unreadReceivers)"></MailIcon>
                    </button>
                </div>
                <div v-else> Seems you are the very first user!</div>
            </div>
        </div>
    </Paper>
</template>

<script>
    import Paper from '../ui/Paper'
    import ChatForm from '../ui/ChatForm'
    import {TwitterIcon, MailIcon, ChevronsLeftIcon, ChevronsRightIcon} from 'vue-feather-icons'
    import {apiFetch, getId, getUsername} from "../../services/utilities";
    import Pusher from 'pusher-js'

    export default {
        name: "Chat",
        components: {
            Paper,
            ChatForm,
            TwitterIcon,
            MailIcon,
            ChevronsRightIcon,
            ChevronsLeftIcon
        },
        data() {
            return {
                users: [],
                messages: [],
                pusher: {},
                unreadReceivers: [],
                subscribedChannels: [],
                activeReceiver: {},
                activeChannel: "",
                senderId: getId(),
                senderUsername: getUsername(),
            }
        },
        methods: {
            getAllUsers: async function () {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/users/all`)
                const allUsers = await response.json()
                return allUsers.filter(user => this.senderUsername != user.username)
            },

            checkIfExists: function (id, array) {
                const index = array.find(data => data == id)
                return index != undefined
            },

            selectReceiver: async function (user) {
                this.activeReceiver = user
                this.unreadReceivers = this.unreadReceivers.filter(id => id != this.activeReceiver.id)
                const res = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/messages?senderId=${this.senderId}&receiverId=${user.id}`)
                this.messages = await res.json()
                const body = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/channels?senderId=${this.senderId}&receiverId=${user.id}`)
                const channelId = await body.json()
                this.activeChannel = `channel${channelId}`
                if (!this.checkIfExists(channelId, this.subscribedChannels)) {
                    const channel = this.pusher.subscribe(this.activeChannel)
                    channel.bind('new-message', (message) => {
                        if (this.activeReceiver.username == message.username) {
                            this.messages.push(message)
                        }
                    })
                }
            },

            sendMessage: async function (message) {
                const messageObject = {
                    message,
                    senderId: this.senderId,
                    receiverId: this.activeReceiver.id,
                    channel: this.activeChannel
                }

                const response = await apiFetch('POST', process.env.VUE_APP_BE_URL + '/messages', messageObject)
                const responseMessage = await response.json()
                if (response.ok) {
                    this.messages.push(responseMessage)
                } else {
                    // alert('Something went wrong, chirper. ')
                    this.emptyMessage = ""
                }
            },

            setUp: async function () {
                this.users = await this.getAllUsers()
            },

            setUpPusher: function () {
                this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
                    host: process.env.VUE_APP_BE_URL,
                    cluster: process.env.VUE_APP_PUSHER_CLUSTER,
                    encrypted: true
                })
            },

            createRoomChannel: function () {
                const channel = this.pusher.subscribe(`chatroom${this.senderId}`)
                channel.bind('new-notification', (receiverId) => {
                    if (this.activeReceiver.id != receiverId && !this.checkIfExists(receiverId, this.unreadReceivers)) {
                        this.unreadReceivers.push(receiverId)
                    }
                })
            },
        },
        created() {
            this.setUp()
            this.setUpPusher()
            this.createRoomChannel()
        },

    }
</script>

<style scoped>
    * {
        font-family: 'Poppins', 'sans-serif';
    }

    .header {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .titles {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .lower-header {
        margin-top: 0;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    h1 {
        margin-bottom: 0em;
        color: purple;
        text-align: center;
    }

    h2 {
        color: purple;
    }

    h3 {
        color: purple;
        margin-top: 0;
    }

    .icon {
        color: purple;
        margin-left: 1em;
    }

    .paper {
        margin: 0 auto;
        margin-top: 8vh;
        width: 70%;
        height: 100%;
        display: block;
        padding: 0.5em;
    }

    .chat-form {
        width: 80%;
        margin-bottom: 1em;
    }

    .chat-container {
        display: flex;
        justify-content: space-between;
    }

    .username-container {
        width: 20%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-left: 1em;
        margin-right: 1em;
    }

    button {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        border: none;
        outline: none;
    }

    .msg-icon {
        margin-right: 0.6em;
        margin-left: 0.6em;
        width: 1.2em;
        color: purple;
    }

    a {
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: none;
        color: purple;
    }

</style>