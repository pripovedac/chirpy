<template>
    <Paper>
        <div class="top-container">
            <h1>Chirpy feed</h1>
            <router-link :to="{name: 'Chat'}">Ready for chat, {{username}}?</router-link>
            <div class="top-right">
                <Button v-if="newEntries.length > 0"
                        class="icon-button"
                        @click="mergeEntries($event)">
                    <BellIcon></BellIcon>
                </Button>
                <router-link :to="{path: `/profile/?id=${userId}`}">@{{username}}</router-link>
                <Button class="icon-button"
                        @click="logout($event)">
                    <LogOutIcon></LogOutIcon>
                </Button>

            </div>
        </div>
        <div class="flex-container">
            <EntryForm
                    :message="'Have something to say? Not sure if you should? Let us help you - chirp it, bro!'"
                    @formSubmit="chirpPost($event)">
            </EntryForm>

            <EntryList v-if="entries.length > 0"
                       :entries="entries"
                       @deletePost="deletePost($event)"
                       @openComments="openCommentSection($event)"
            ></EntryList>
            <p v-else>Seems there are no chirps, yet! Be the first!</p>

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
        </div>
    </Paper>
</template>

<script>
    import Paper from '../ui/Paper'
    import EntryForm from '../ui/EntryForm'
    import EntryList from '../ui/EntryList'
    import CommentSection from "../ui/CommentSection";
    import Button from '../ui/Button'
    import {BellIcon, LogOutIcon} from 'vue-feather-icons'
    import {getAllEntries, apiFetch, getId, getUsername, cleanLS} from '../../services/utilities'
    import router from '../../routes/route'
    import Pusher from 'pusher-js'

    export default {
        name: "Home",
        components: {
            Paper,
            EntryForm,
            EntryList,
            CommentSection,
            Button,
            BellIcon,
            LogOutIcon
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
                userId: getId()
            }
        },
        methods: {
            openCommentSection: async function (entry) {
                this.selectedEntry = entry
                this.comments = await this.getComments(entry.id)
            },

            getComments: async function (id) {
                const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + `/posts/comments/${id}`)
                const comments = await response.json()
                return comments
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
                    const errors = await response.json()
                    alert(errors)
                }
            },

            deletePost: async function (id) {
                if (this.selectedEntry != null && this.selectedEntry.id == id) {
                    this.selectedEntry = null
                }
                await apiFetch('DELETE', process.env.VUE_APP_BE_URL + `/posts?postId=${id}&userId=${this.userId}`)
            },

            addComment: async function (comment) {
                const response = await apiFetch('POST', process.env.VUE_APP_BE_URL + `/comments`, comment)
                if (response.ok) {
                    this.value = ""
                } else {
                    const errors = await response.json()
                    alert(errors)
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

            setUp: async function () {
                this.entries = await getAllEntries()
                if(this.entries.length > 0) {
                    this.openCommentSection(this.entries[0])
                }
            },

        },
        created() {
            this.setUpPusher()
            this.createPostChannels()
            this.createCommentChannel()
            this.setUp()
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

    /* username */
    .top-right > span {
        margin-left: 1em;
        margin-right: 1em;
    }

    .icon-button {
        padding: 0.4em;
        margin-left: 1em;
        margin-right: 1em;
        display: flex;
        align-items: center;
    }

    .flex-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .entry-form, .comment-section, p {
        max-width: 30%;
        align-self: flex-start;
        top: 0;
    }

    /*No posts*/
    p {
        margin-left: 1em;
    }

    .entry-form {
        position: sticky;
    }

    .entries {
        width: 40%;
        flex-grow: 0;
        align-self: flex-start;
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

</style>