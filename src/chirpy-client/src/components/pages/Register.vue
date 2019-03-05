<template>
    <Paper>
        <h1>Chirpy Register</h1>
        <p>Hello and welcome to this superb social network which purpose we do not even know -
            but who cares, just have fun!</p>
        <form @submit.prevent="register">
            <div class="input-container">
                <Input :placeholder="'My fenomenal username'" v-model="user.username"/>
                <user-icon></user-icon>
            </div>
            <div class="input-container">
                <Input :placeholder="'Incredible email'" :type="'email'" v-model="user.email"/>
                <mail-icon></mail-icon>
            </div>
            <div class="input-container">
                <Input :placeholder="'The secretest password'" :type="'password'" v-model="user.password"/>
                <unlock-icon></unlock-icon>
            </div>
            <Button type="submit" >Register</Button>
        </form>
        <p>You say you have already registered, please check out our <router-link :to="{name: 'Login'}">Login page</router-link>!</p>
    </Paper>
</template>

<script>
    import Paper from '../ui/Paper'
    import Input from '../ui/Input'
    import Button from '../ui/Button'
    import {MailIcon} from 'vue-feather-icons'
    import {UserIcon} from 'vue-feather-icons'
    import {UnlockIcon} from 'vue-feather-icons'
    import router from '../../routes/route'
    import {saveUser} from '../../services/utilities'

    export default {
        components: {
            Paper,
            Input,
            Button,
            MailIcon,
            UserIcon,
            UnlockIcon
        },
        data() {
            return {
                user: {
                    username: "",
                    email: "",
                    password: ""
                }
            }
        },
        name: "Register",
        methods: {
            register: async function () {
                const response = await fetch(process.env.VUE_APP_BE_URL + '/users/register', {
                    method: 'POST',
                    body: JSON.stringify(this.user),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    alert('Whoa! Successful registration!')
                    const responseBody = await response.json()
                    saveUser(responseBody)
                    router.push('home')
                } else {
                    const errors = await response.json()
                    alert(errors)
                }
            }
        }
    }
</script>

<style scoped>
    .main-container, .cao {
        margin-bottom: 1em;
    }

    h1 {
        text-align: center;
        color: rgb(145, 8, 137);
    }

    p {
        /*display: block;*/
        margin: auto;
        font-size: 0.9em;
        width: 80%;
        padding-bottom: 1.2em;
    }

    form {
        /*border: 1px solid red;*/
        margin-bottom: 1em;
    }

    .paper {
        margin: 0 auto;
        margin-top: 10vh;
        width: 30%;
        display: block;
        padding: 0.5em;
        font-family: 'Poppins', sans-serif;
    }

    .input-container {
        /*border: 1px solid red;*/
        border-bottom: 1px solid #eee;
        width: 80%;
        margin: auto;
        margin-bottom: 2em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-content: center;
    }

    .input {
        width: 100%;
        font-family: inherit;
        padding-bottom: 0.5em;
        /*border: 1px solid green;*/
    }

    .primary-button{
        display: block;
        margin: auto;
    }

    a {
        text-decoration: none;
        color: purple;
    }


</style>