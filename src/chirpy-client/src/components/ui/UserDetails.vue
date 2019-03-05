<template>
    <form @submit.prevent="updateUserInfo" class="user-details">
        <div class="input-container">
            <Input :placeholder="'No name'"
                   :label="'Name'"
                   :disabled="disabled"
                   v-model="user.name"/>
        </div>
        <div class="input-container">
            <Input :placeholder="'No lastname'"
                   :label="'Lastname'"
                   :disabled="disabled"
                   v-model="user.lastname"/>
        </div>
        <div class="input-container">
            <Input :placeholder="'No username'"
                   :label="'Username'"
                   :disabled="disabled"
                   v-model="user.username"/>
        </div>
        <div class="input-container">
            <Input :placeholder="'No email'"
                   :label="'Email'"
                   :type="'email'"
                   :disabled="disabled"
                   v-model="user.email"/>
        </div>
        <div class="input-container">
            <Input :placeholder="'No town'"
                   :label="'Town'"
                   :disabled="disabled"
                   v-model="user.town"/>
        </div>
        <Button v-if="!disabled" type="submit">Update</Button>
    </form>
</template>

<script>
    import Button from './Button.vue'
    import Input from './Input'

    export default {
        components: {
            Button,
            Input,
        },
        name: "UserDetails",
        props: ['user', 'disabled'],
        methods: {
            updateUserInfo() {
                this.$emit('updateUserInfo', this.user)
            }
        }
    }
</script>

<style scoped>
    * {
        font-family: inherit;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 1em;
        padding-bottom: 0.1em;
        width: 100%;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.16);
        border-radius: 4px;
    }

    .pen {
        margin-right: 1em;
        border: none;
        outline: none;
        color: purple;
        background-color: white;
        align-self: flex-end;
    }

    .input-container {
        border-bottom: 1px solid #eee;
        width: 80%;
        margin: auto;
        margin-bottom: 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
    }

    .input {
        width: 100%;
        font-family: inherit;
        padding-bottom: 0.5em;
        outline: none;
    }

    .primary-button {
        display: block;
        margin: auto;
        margin-bottom: 0.4em;
        font-size: 0.7em;
        width: 30%;
    }
</style>