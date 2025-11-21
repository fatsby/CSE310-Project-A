import { fetchUser } from './fetch.js'

export const saveToken = (data, remember) => {
    const storage = remember ? localStorage : sessionStorage
    const now = new Date().getTime()

    const expirationTime = now + data.expiresIn * 1000 - 60000

    storage.setItem('accessToken', data.accessToken)
    storage.setItem('tokenExpiry', expirationTime.toString())
}

export const getToken = () => {
    return (
        localStorage.getItem('accessToken') ||
        sessionStorage.getItem('accessToken')
    )
}

export const checkAuth = () => {
    const accessToken = getToken()
    const userInStorage = getUser()

    if (!accessToken || !userInStorage) return false

    const expiryLocal = localStorage.getItem('tokenExpiry')
    const expirySession = sessionStorage.getItem('tokenExpiry')
    const expiryTime = expiryLocal || expirySession

    if (!expiryTime) return false

    const now = new Date().getTime()

    if (now > parseInt(expiryTime)) {
        removeToken()
        return false
    }

    return true
}

export const removeToken = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('tokenExpiry')
    localStorage.removeItem('currentUser')

    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('tokenExpiry')
    sessionStorage.removeItem('currentUser')
}

export const getUser = () => {
    const userStr =
        localStorage.getItem('currentUser') ||
        sessionStorage.getItem('currentUser')
    return userStr ? JSON.parse(userStr) : null
}

export const isUserAdmin = () => {
    const user = getUser()
    if (!user) return false
    // matches the C# DTO
    return user.isAdmin === true
}

export const saveUser = (user, remember) => {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem('currentUser', JSON.stringify(user))

    window.dispatchEvent(new Event('user-update'))
}

export const refreshUserProfile = async (userId) => {
    if (!userId) return

    const latestUserData = await fetchUser(userId)

    if (latestUserData) {
        const isRemembered = localStorage.getItem('accessToken') !== null

        saveUser(latestUserData, isRemembered)
    }
}

export const checkPurchased = async (getToken, documentId) => {
    const API_URL = import.meta.env.VITE_API_BASE_URL
    try {
        const token = getToken()
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
        const respone = await fetch(`${API_URL}/api/purchases/${documentId}`, {
            method: 'GET',
            headers: headers,
        })

        if (respone.ok) {
            const data = await respone.json()
            return data ? true : false
        }
        return false
    } catch (error) {
        console.log('Error checking purchase status:', error)
        return false
    }
}
