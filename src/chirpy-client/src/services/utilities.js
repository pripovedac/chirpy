import router from '../routes/route'

export function getId() {
    return  localStorage.getItem('userId')
}

export function setId(id) {
    return  localStorage.setItem('userId', id)
}

export function setUsername(username) {
    return  localStorage.setItem('username', username)
}

export function getUsername() {
    return  localStorage.getItem('username')
}

export function cleanLS() {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
}

export function saveUser(user) {
    localStorage.setItem('userId', user.id)
    localStorage.setItem('username', user.username)

}

export async function getAllEntries() {
    const response = await apiFetch('GET', process.env.VUE_APP_BE_URL + '/posts')
    return await response.json()
}

export function apiFetchFactory({fetch}) {
    return async function apiFetch(method, url, body, {
        contentType = 'application/json',
        responseType = 'json',
    } = {}) {
        if (getId()) {
            const res = await fetch(url, {
                method,
                body: JSON.stringify(body),
                headers: {
                    'content-type': contentType,
                },
            })
            if (responseType == 'json') {
                return res
            }
        } else {
            router.push('login')
        }
    }
}

export const apiFetch = apiFetchFactory({fetch})

