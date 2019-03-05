<template>
    <div class="entry">
        <div class="outer-container">
            <router-link :to="{path: `/profile/?id=${id}`}">{{username}}</router-link>
            <div class="date-trash">
                <span>{{time}} - {{date}}</span>
                <button v-if="username == myUsername"
                        @click="deletePost">
                    <Trash2Icon></Trash2Icon>
                </button>
            </div>
        </div>
        <p @click="onClick($event)">{{post}}</p>
    </div>
</template>

<script>
    import {getUsername} from "../../services/utilities";
    import {Trash2Icon} from 'vue-feather-icons'

    export default {
        name: "Entry",
        components: {
            Trash2Icon
        },
        props: ['post', 'username', 'date', 'time', 'id'],
        data() {
            return {
                myUsername: getUsername()
            }
        },
        methods: {
            onClick: function () {
                this.$emit('click', {
                    post: this.post,
                    username: this.username,
                    date: this.date,
                    time: this.time,
                    id: this.id
                })
            },
            deletePost: function () {
                this.$emit('deletePost', this.id)
            }
        }
    }
</script>

<style scoped>
    .entry {
        border: 1px solid white;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.16);
        border-radius: 4px;
        margin-bottom: 0.5em;
        margin-left: 0.5em;
        margin-right: 0.5em;
        padding-left: 1em;
        padding-right: 0.5em;
        overflow-wrap: break-word;
    }

    .outer-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    a {
        color: purple;
        text-decoration: none;
    }

    .date-trash {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    p {
        margin-top: 0;
        border-left: 3px solid purple;
        padding-left: 1em;
        cursor: pointer;

    }

    button {
        padding: 0.2em;
        margin-left: 0.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: flex-end;
        background-color: white;
        color: purple;
        border: none;
        cursor: pointer;
    }

</style>