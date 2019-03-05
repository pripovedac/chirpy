<template>
    <div class="chat-form">
        <div class="messages" v-if="hasReceiver">
            <ChatMessage v-for="message in messages"
                         :key="message.id"
                         :username="message.username"
                         :message="message.message"
                         :isLeft="message.username != username"
                         :isRight="message.username == username"
            ></ChatMessage>
        </div>
        <p v-else class="messages">Looks like you have to pick a chirper in order to start chatting</p>
        <form @submit.prevent="sendMessage($event)">
            <textarea rows="5"
                      @keyup.enter="sendMessage($event)"
                      placeholder="Chirp a message..."
                      :disabled="!hasReceiver"
                      v-model="message"></textarea>
            <button :disabled="message.length == 0"
                    type="submit">
                <SendIcon></SendIcon>
            </button>
        </form>
    </div>
</template>

<script>
    import ChatMessage from './ChatMessage'
    import {SendIcon} from 'vue-feather-icons'
    import {getUsername} from '../../services/utilities';

    export default {
        name: "ChatForm",
        components: {
            ChatMessage,
            SendIcon,
        },
        props: {
            messages: {
                Type: Array
            },
            hasReceiver: {
                Type: Boolean
            },
            newMessage: {
                Type: Boolean
            },
        },
        data() {
            return {
                username: getUsername(),
                message: "",
                messageList: this.messages
            }
        },
        methods: {
            sendMessage: function () {
                this.$emit('sendMessage', this.message)
                this.message = ""
            },
            scrollToBottom: function () {
                let messages = this.$el.querySelector(".messages");
                messages.scrollTop = messages.scrollHeight;
            }
        },
        updated() {
            this.scrollToBottom()
        },
    }
</script>

<style scoped>
    .chat-form {
        display: flex;
        flex-direction: column;
        border: 1px solid purple;
        border-radius: 8px;
    }

    .messages {
        display: flex;
        padding-top: 1em;
        flex-direction: column;
        height: 40vh;
        overflow: scroll;
        overflow-x: hidden;
        /*todo: change this vh for percentage*/
    }

    p {
        text-align: center;
    }

    form {
        display: flex;
        padding-top: 1em;
        justify-content: center;
        align-content: center;
        counter-increment: center;
        border-top: 1px solid #eee;
    }

    textarea {
        width: 90%;
        height: 50%;
        resize: none;
        border: none;
        box-shadow: 0 0 0 0;
        font-family: 'Poppins', 'sans-serif';
        outline: none;
        /*border: 1px solid black;*/
    }

    button {
        background-color: #fff;
        color: purple;
        border: 0;
        cursor: pointer;
        outline: none;
    }

    button[disabled], textarea[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: white;
    }

</style>