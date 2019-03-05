<template>
    <div class="chat-message" :class="{isLeft: isLeft, isRight: !isLeft}">
        <router-link :to="{name: 'name-a'}" :class="{isLeft: isLeft, isRight: !isLeft}">
            <ChevronRightIcon v-if="isLeft" class="icon"></ChevronRightIcon>
            <span>{{username}}</span>
            <ChevronLeftIcon v-if="!isLeft" class="icon"></ChevronLeftIcon>
        </router-link>
        <div>
            {{message}}
        </div>
    </div>
</template>

<script>
    import {ChevronRightIcon, ChevronLeftIcon} from 'vue-feather-icons'

    export default {
        name: "ChatMessage",
        components: {
            ChevronRightIcon,
            ChevronLeftIcon
        },
        props: {
            username: {
                type: String
            },
            message: {
                type: String
            },
            isLeft: {
                type: Boolean
            }
        }
    }
</script>

<style scoped>
    .chat-message {
        display: inline-block;
        max-width: 50%;
        color: purple;
        margin-bottom: 0.5em;
        padding-left: 1em;
        padding-right: 1em;
        margin-left: 1em;
        margin-right: 1em;
        border-radius: 8px;
        box-shadow: 1px 2px 4px 1px rgba(0, 0, 0, 0.16);

    }

    .isLeft {
        text-align: left;
        justify-content: flex-start;
        align-self: flex-start;
        background-color: rgba(255, 208, 25, 1);

    }

    .isRight {
        text-align: right;
        justify-content: flex-end;
        align-self: flex-end;
        background-color: #fff;
    }

    a {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
        color: purple;
        padding-bottom: 0.5em;
    }

</style>