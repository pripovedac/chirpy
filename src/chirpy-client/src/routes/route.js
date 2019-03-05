import Vue from 'vue'
import Router from 'vue-router'
import aPage from '../components/pages/a'
import bPage from '../components/pages/b'
import Register from '../components/pages/Register'
import Login from '../components/pages/Login'
import Home from '../components/pages/Home'
import Chat from '../components/pages/Chat'
import Profile from '../components/pages/Profile'
import {getId, getUsername} from "../services/utilities";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/a',
            name: 'name-a',
            component: aPage,
            meta: {
                title: 'a page'
            },
        },
        {
            path: '/b',
            name: 'name-b',
            component: bPage,
            meta: {
                title: 'b page'
            },
        },
        {
            path: '/register',
            name: 'Register',
            component: Register,
            meta: {
                title: 'Register'
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: 'Login'
            }
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                title: 'Home'
            }
        },
        {
            path: '/chat',
            name: 'Chat',
            component: Chat,
            meta: {
                title: 'Chat'
            }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
            meta: {
                title: 'Profile'
            }
        }

    ]
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = getId() != null && getUsername() != null
    const publicPages = ['/register', '/login']
    const isPagePrivate = publicPages.indexOf(to.path) == -1

    if (isLoggedIn && !isPagePrivate) {
        next('/home')
    } else if (!isLoggedIn && isPagePrivate) {
        next('/login')
    } else {
        next()
    }
})

router.afterEach((to) => {
    const {title} = to.meta
    document.title = title != null ? title : `Time Cruncher`
})

export default router