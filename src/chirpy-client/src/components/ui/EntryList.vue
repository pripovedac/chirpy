<template>
    <div class="entries">
        <Entry v-for="entry in entries"
               :key="entry.id"
               :username=entry.username
               :post=entry.post
               :date=entry.date
               :time=entry.time
               :id="entry.id"
               @click="openCommentSection($event)"
               @deletePost="deletePost($event)">
        </Entry>
    </div>
</template>

<script>
    import Entry from './Entry'

    export default {
        props: {
            entries: {
                type: Array
            }
        },
        name: "EntryList",
        components: {
            Entry,
        },
        data() {
            return {
                entryList: []
            }
        },
        methods: {
            openCommentSection: function (entry) {
                this.$emit('openComments', entry)
            },
            deletePost(id) {
                this.$emit('deletePost', id)
            }
        },
    }
</script>

<style scoped>
    .chirp-button {
        /*border: 1px solid red;*/
        display: flex;
        /*flex-direction: column;*/
        justify-content: center;
        align-items: center;
        padding-bottom: 1em;
        box-shadow: 0 0 0 0;
        border: none;
    }

</style>