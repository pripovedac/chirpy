<template>
    <div class="entry-form">
        <p>{{message}}</p>
        <form @submit.prevent="addEntry($event)">
            <div class="text-span">
            <textarea rows="10"
                      spellcheck="false"
                      maxlength="240"
                      @keyup.enter="addEntry($event)"
                      v-model="value"
            ></textarea>
                <span>{{charNum}}</span>
            </div>
            <Button type="submit">
                Chirp
                <feather-icon class="icon"></feather-icon>
            </Button>
        </form>
    </div>
</template>

<script>
    import Button from './Button'
    import {FeatherIcon} from 'vue-feather-icons'

    export default {
        name: "EntryInput",
        props: {
          message: {
              type:String
          }
        },
        components: {
            Button,
            FeatherIcon
        },
        data() {
            return {
                value: "",
            }
        },
        methods: {
            addEntry: function() {
                this.$emit('formSubmit', this.value)
                this.value = ""
            }
        },
        computed: {
            charNum: function () {
                return 240 - this.value.length
            }
        }
    }
</script>

<style scoped>
    .entry-form {
        padding-left: 1em;
        padding-right: 1em;
    }

    .text-span {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    span {
        align-self: flex-end;
        padding-right: 0.5em;
    }

    textarea {
        width: 95%;
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 1em;
        outline: none;
        font-family: inherit;
        border-radius: 8px;
        border: 1px solid rgb(145, 8, 137);
        resize: none;
    }


    .primary-button {
        display: flex;
        margin: auto;
        flex-direction: column;
        align-items: center
    }

    .icon {
        width: 1.4em;
    }


</style>