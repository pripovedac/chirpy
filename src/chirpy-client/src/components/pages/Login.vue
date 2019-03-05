<template>
    <Paper>
        <h1>Chirpy Login</h1>
        <p>Whoa! It's great to see you again! Log in and let's continue the ride!</p>
        <form @submit.prevent="login">
            <div class="input-container">
                <Input :placeholder="'That fenomenal username'" v-model="user.username"/>
                <user-icon></user-icon>
            </div>
            <div class="input-container">
                <Input :placeholder="'And that secret password'" :type="'password'" v-model="user.password"/>
                <unlock-icon></unlock-icon>
            </div>
            <Button type="submit" >Login</Button>
        </form>
        <p>Don't have an account? Okay, okay we won't make a problem unless you immediately go to
            <router-link :to="{name: 'Register'}">Register page</router-link> and do the thing.</p>
    </Paper>
</template>

<script>
    import Paper from '../ui/Paper'
    import Input from '../ui/Input'
    import Button from '../ui/Button'
    import {UserIcon, UnlockIcon} from 'vue-feather-icons'
    import router from '../../routes/route'
    import {setId, setUsername} from '../../services/utilities'

    export default {
        components: {
            Paper,
            Input,
            Button,
            UserIcon,
            UnlockIcon,

        },
        data() {
            return {
                user: {
                    username: "",
                    password: ""
                }
            }
        },
        name: "Login",
        methods: {
            login: async function () {
                const response = await fetch(process.env.VUE_APP_BE_URL + '/users/login', {
                    method: 'POST',
                    body: JSON.stringify(this.user),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    alert('Good job! Let\'s move on!')
                    const responseBody = await response.json()
                    setId(responseBody.id)
                    setUsername(responseBody.username)
                    router.push('home')
                } else if (response.status == 404) {
                    alert("Invalid credentials, boi!")
                } else {
                    alert('Houston, we have a problem! Check your entries, please.')
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
        margin: 2em;
        margin-bottom: 0;
        font-size: 0.9em;
        width: 80%;
        padding-bottom: 1.2em;
    }

    form {
        margin-bottom: 1em;
        margin-right: 2em;
        margin-left: 2em;
        display: flex;
        flex-direction: column;
        /*padding-left: 2em;*/
        /*padding-right: 2em;*/
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
        width: 100%;
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