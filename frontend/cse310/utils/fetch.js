import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_BASE_URL

export const fetchUser = async (userId) => {
    try {
        const respone = await fetch(`${API_URL}/api/users/${userId}`)

        if (!respone.ok) {
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }
        const json = await respone.json()
        return json
    } catch (err) {
        console.log('Fail to get user data in review section', err)
    }
}

export const fetchCourse = async ({
    universityId,
    subjectId,
    title,
    authorId,
}) => {
    const params = new URLSearchParams()

    if (universityId) params.append('universityId', universityId)
    if (subjectId) params.append('subjectId', subjectId)
    if (title) params.append('courseTitle', title)
    if (authorId) params.append('authorId', authorId)

    try {
        const respone = await fetch(
            `${API_URL}/api/documents?${params.toString()}`
        )
        if (!respone.ok) {
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }
        const json = await respone.json()
        return json
    } catch (err) {
        console.log('Fail to get document data', err)
        return []
    }
}
