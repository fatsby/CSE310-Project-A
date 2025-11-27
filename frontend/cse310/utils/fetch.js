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

export const fetchCoupon = async (coupon) => {
    try {
        const respone = await fetch(`${API_URL}/api/coupons/${coupon}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })

        if (!respone.ok) {
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }

        const json = await respone.json()
        return json
    } catch (err) {
        console.log('Fail to get coupon data', err)
        return null
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

export const fetchPurchase = async ({ documentIds, couponCode }) => {
    try {
        const response = await fetch(`${API_URL}/api/documents/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
                documentIds: documentIds,
                couponCode: couponCode || '',
            }),
        })

        if (!response.ok) {
            let errorMessage = `Purchase failed! Status: ${response.status}`

            try {
                const errorData = await response.json()

                if (errorData && errorData.message) {
                    errorMessage = errorData.message
                }
            } catch {
                const errorText = await response.text()
                if (errorText) {
                    errorMessage = errorText
                }
            }

            throw new Error(errorMessage)
        }

        const json = await response.json()
        return json
    } catch (err) {
        console.error('Transaction error:', err)
        throw err
    }
}

export const fetchUserPurchase = async () => {
    try {
        const respone = await fetch(`${API_URL}/api/documents/purchased`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })

        if (!respone.ok) {
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }
        const json = await respone.json()
        return json
    } catch (err) {
        console.log('Fail to get your purchased courses data', err)
        return []
    }
}

export const fetchPurchaseLog = async () => {
    try {
        const respone = await fetch(`${API_URL}/api/purchases`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken()}`,
            },
        })

        if (!respone.ok) {
            throw new Error(`HTTP error! Status: ${respone.status}`)
        }

        const json = await respone.json()
        return json
    } catch (err) {
        console.log('Fail to get your purchased courses data', err)
        return []
    }
}

export const fetchChangeCourseActiveStatus = async (documentId, isActive) => {
    try {
        const respone = await fetch(
            `${API_URL}/api/documents/${documentId}/active?isActive=${isActive}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        )

        if (!respone.ok) {
            const errorText = await respone.text()
            throw new Error(
                `HTTP error! Status: ${respone.status} - ${errorText}`
            )
        }

        return true
    } catch (err) {
        console.log('Fail to change Course status', err.message)
        return false
    }
}

export const apiFetchFiles = async (docId, apiUrl) => {
    const res = await fetch(`${apiUrl}/api/documents/${docId}/files`)
    if (!res.ok) throw new Error('Failed to load files')
    return await res.json()
}
