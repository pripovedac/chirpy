<template>
    <Paper>
        <div class="top-container">
            <router-link :to="{name: 'Home'}">
                <h1>Chirpy feed</h1>
            </router-link>
            <router-link :to="{name: 'Chat'}">Ready for chat, {{username}}?</router-link>
            <div class="top-right">
                <Button v-if="newPosts"
                        class="icon-button"
                        @click="mergeEntries($event)">
                    <BellIcon></BellIcon>
                </Button>
                <span>@{{username}}</span>
                <Button class="icon-button"
                        @click="logout($event)">
                    <LogOutIcon></LogOutIcon>
                </Button>
            </div>
        </div>

        <div class="flex-container">

            <div class="left-container">
                <UserDetails :user="user"
                             :disabled="$route.query.id != userId"
                             @updateUserInfo="updateUserInfo($event)"></UserDetails>

                <div class="username-container">
                    <h3>Chirpers</h3>
                    <router-link class="router-button"
                                 :to="{path: `/profile/?id=${user.id}`}"
                                 v-for="user in users" :key="user.id"
                                 @click="selectReceiver(user)">
                        {{user.username}}
                    </router-link>
                    <p v-if="users.length == 0">Hm, seems you are the first chirper! Congrats!</p>
                </div>
            </div>

            <div class="middle-container">
            <EntryList v-if="entries.length > 0"
                       :entries="entries"
                       @deletePost="deletePost($event)"
                       @openComments="openCommentSection($event)"
            ></EntryList>
            <p v-else>Hmm, this is one quiet chrper! No posts yet.</p>
            </div>

            <CommentSection v-if="selectedEntry"
                            :username=selectedEntry.username
                            :post=selectedEntry.post
                            :date=selectedEntry.date
                            :time=selectedEntry.time
                            :id=selectedEntry.id
                            :comments=comments
                            @addComment="addComment($event)"
                            @deleteComment="deleteComment($event)"
                            @deletePost="deletePost($event)"
            ></CommentSection>
            <div v-else class="comment-section"></div>
        </div>
    </Paper>
</template>

<script>
    import Paper from '../ui/Paper'
    import EntryList from '../ui/EntryList'
    import CommentSection from "../ui/CommentSection";
    import Button from '../ui/Button'
    import {BellIcon, LogOutIcon} from 'vue-feather-icons'
    import {apiFetch, getId, getUsername, cleanLS} from '../../services/utilities'
    import router from '../../routes/route'
    import Pusher from 'pusher-js'
    import UserDetails from "../ui/UserDetails";

    export default {
        name: "Profile",
        components: {
            Paper,
            EntryList,
            CommentSection,
            Button,
            BellIcon,
            LogOutIcon,
            UserDetails
        },
        data() {
            return {
                entries: [],
                createdEntry: {},
                newEntries: [],
                selectedEntry: null,
                comments: [],
                newPosts: false,
                pusher: {},
                username: getUsername(),
                userId: getId(),
                user: {},
                users: []
            }
        },
        methods: {
            getUserEntries: async function () {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/posts/${this.$route.query.id}`)
                return await response.json()
            },

            getAllUsers: async function () {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/users/all`)
                const allUsers = await response.json()
                return allUsers.filter(user => this.senderUsername != user.username)
            },

            getUser: async function () {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/users/${this.$route.query.id}`)
                const rawUser = await response.json()
                rawUser.name = rawUser.name != "undefined" ? rawUser.name : ''
                rawUser.lastname = rawUser.lastname != "undefined" ? rawUser.lastname : ''
                rawUser.username = rawUser.username != "undefined" ? rawUser.username : ''
                rawUser.email = rawUser.email != "undefined" ? rawUser.email : ''
                rawUser.town = rawUser.town != "undefined" ? rawUser.town : ''
                return rawUser
            },

            updateUserInfo: async function (user) {
                const response = await apiFetch('PUT', process.env.VUE_APP_BE_URL + '/users', user)
                if (response.ok) {
                    alert('Successfully updated chirper infos!')
                } else {
                    const errors = await response.json()
                    alert(errors)
                }
            },

            openCommentSection: async function (entry) {
                this.selectedEntry = entry
                this.comments = await this.getComments(entry.id)
            },

            getComments: async function (id) {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/posts/comments/${id}`)
                return await response.json()
            },

            chirpPost: async function (chirp) {
                const postObject = {
                    id: getId(),
                    post: chirp
                }

                this.createdEntry = postObject

                const response = await apiFetch('POST', process.env.VUE_APP_BE_URL + '/posts', postObject)
                if (response.ok) {
                    this.value = ""
                } else {
                    alert('Something went wrong, chirper. ')
                }
            },


            deletePost: async function (id) {
                if (this.selectedEntry.id == id) {
                    this.selectedEntry = null
                }
                await apiFetch('DELETE', process.env.VUE_APP_BE_URL + `/posts?postId=${id}&userId=${this.userId}`)
            },

            addComment: async function (comment) {
                const response = await apiFetch('POST', process.env.VUE_APP_BE_URL + `/comments`, comment)
                if (response.ok) {
                    this.value = ""
                } else {
                    alert('Something went wrong, chirper. ')
                }
            },

            deleteComment: async function (comment) {
                const response = await apiFetch('DELETE', process.env.VUE_APP_BE_URL + `/comments`, comment)
                if (response.ok) {
                    this.value = ""
                } else {
                    alert('Something went wrong, chirper. ')
                }
                this.comments = await this.getComments(comment.postId)
            },

            mergeEntries: function () {
                this.entries = [...this.newEntries, ...this.entries]
                this.newEntries = []
                this.newPosts = false
            },

            logout: function () {
                cleanLS()
                router.push('login')
            },

            setUpPusher: function () {
                this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
                    host: process.env.VUE_APP_BE_URL,
                    cluster: process.env.VUE_APP_PUSHER_CLUSTER,
                    encrypted: true
                })
            },

            createPostChannels: function () {
                const creationChannel = this.pusher.subscribe('postCreation')
                const deletionChannel = this.pusher.subscribe('postDeletion')

                creationChannel.bind('new-post', (entry) => {
                    if (entry.post == this.createdEntry.post) {
                        this.entries = [entry, ...this.entries]
                    } else {
                        this.newEntries = [entry, ...this.newEntries]
                        this.newPosts = true
                    }
                })

                deletionChannel.bind('delete-post', (ids) => {
                    this.entries = this.entries.filter(entry => entry.id != ids.postId)
                    if (this.newEntries.length > 0) {
                        this.newEntries = this.newEntries.filter(entry => entry.id != ids.postId)
                    }
                    if (this.selectedEntry != null && this.selectedEntry.id == ids.postId && this.userId != ids.userId) {
                        alert('Whoa, chirper! Looks like the boss of this little' +
                            ' post in comment section has deleted it. Don\'t take it personal.')
                        this.selectedEntry = null
                    }
                })
            },

            createCommentChannel: function () {
                const channel = this.pusher.subscribe('comments')
                channel.bind('new-comment', (comment) => {
                    if (comment.postId == this.selectedEntry.id) {
                        this.comments = [...this.comments, comment]
                    }
                })
            },

            setUp: async function (id) {
                this.entries = await this.getUserEntries(id)
                this.users = await this.getAllUsers()
                this.user = await this.getUser()
                if(this.entries.length > 0) {
                    this.openCommentSection(this.entries[0])
                } else {
                    this.selectedEntry = null
                }
            },

        },
        created() {
            this.setUpPusher()
            this.createPostChannels()
            this.createCommentChannel()
            this.setUp(this.$route.query.id)
        },
        watch: {
            $route() {
                this.setUp(this.$route.query.id)
            },
        },
    }
</script>

<style scoped>
    * {
        font-family: 'Poppins', 'sans-serif';
    }

    a {
        color: purple;
        text-decoration: none;
    }

    .top-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 1em;
        padding-right: 1em;
    }

    .top-right {
        display: flex;
        align-items: center;
    }

    .left-container {
        width: 25%;
        align-self: flex-start;
    }

    .user-details {
        display: block;
        max-width: 100%;
        margin-left: 1em;
        padding-top: 1em;
        align-self: flex-start;
        top: 0;
    }

    h3 {
        margin-top: 0;
    }

    .username-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .router-button {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background-color: #fff;
        border: none;
        outline: none;
    }

    /* username */
    .top-right > span {
        margin-left: 1em;
        margin-right: 1em;
    }

    .icon-button {
        padding: 0.4em;
        margin-left: 1em;
        display: flex;
        align-items: center;
    }

    .flex-container {
        /*border: 1px solid black;*/
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    .comment-section {
        max-width: 30%;
        align-self: flex-start;
        top: 0;
    }

    .entry-form {
        position: sticky;
    }

    p, .middle-container {
        width: 40%;
        flex-grow: 0;
        align-self: flex-start;
    }

    /* Hmm, this is one queit chirper!*/
    p {
        margin-left: 1em;
    }

    .paper {
        margin: 0 auto;
        margin-top: 8vh;
        width: 95%;
        display: block;
        padding: 0.5em;
    }

    .chirp-button > span {
        padding-bottom: 1em;
    }

    h1 {
        text-align: center;
        color: rgb(145, 8, 137);
    }

    p {
        margin-left: 1em;
    }

</style>