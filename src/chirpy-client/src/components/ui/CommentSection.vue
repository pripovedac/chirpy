<template>
    <div class="comment-section">

        <span>Comment section</span>

        <Entry :username='username'
               :post="post"
               :date="date"
               :time="time"
               :id="id"
               @deletePost="deletePost($event)"
        ></Entry>

        <div class="comments">
            <Entry v-for="comment in comments"
                   :key="comment.id"
                   :username=comment.username
                   :post=comment.comment
                   :date=comment.date
                   :time=comment.time
                   :id="comment.id"
                   @deletePost="deleteComment($event)">
            </Entry>
        </div>

        <EntryForm
                :message="'Hmm, maybe you have a comment:'"
                @formSubmit="addComment($event)"
        ></EntryForm>


    </div>
</template>

<script>
    import Entry from './Entry'
    import EntryForm from './EntryForm'
    import {getId} from '../../services/utilities'

    export default {
        name: "CommentSection",
        components: {
            Entry,
            EntryForm
        },
        props: {
            username: {
                type: String
            },
            post: {
                type: String
            },
            date: {
                type: String
            },
            time: {
                type: String
            },
            id: {

            },
            comments: {
                type: Array
            },
        },
        methods: {
            addComment: function (comment) {
                const commentObject = {
                    id: getId(),
                    postId: this.id,
                    comment: comment
                }
                this.$emit('addComment', commentObject)
            },
            deletePost: function () {
              this.$emit('deletePost', this.id)
            },
            deleteComment: function (commentId) {
                const commentObject = {
                    postId: this.id,
                    commentId
                }
                this.$emit('deleteComment', commentObject)
            }
        },
    }
</script>

<style scoped>

    span {
        margin-bottom: 1em;
        margin-right: 1em;
        text-align: right;
    }

    .comment-section {
        /*border: 10px solid purple;*/
        display: flex;
        flex-direction: column;
        /*float:right;*/
        justify-content: flex-end;
    }

    .comments {
        /*border: 1px solid green;*/
        display: flex;
        flex-direction: column;
        /*padding-left: 2em;*/
        width: 90%;
    }

    .entry {
        /*border: 2px solid black;*/
    }
</style>