import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Loader } from '@mantine/core'

import YourProfilePage from './YourProfilePage'
import OtherProfilePage from './OtherProfilePage'

// IMPORTANT: import the simulated sensitive-user fetch
import { fetchUser } from '../../utils/fetch'
import { getUser } from '../../utils/auth'

function ProfileController() {
    const { id } = useParams()

    const [userData, setUserData] = useState(null)
    const [myData, setMyData] = useState(null)
    const myId = getUser().id
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)

        const getUserData = async () => {
            const respone = await fetchUser(id)
            setUserData(respone)
        }

        const getMyData = async () => {
            const respone = await fetchUser(myId)
            setMyData(respone)
        }

        getMyData()
        getUserData()
        setMyData(getUser())

        setIsLoading(false)
    }, [id])

    //  Loading state
    if (isLoading || !userData) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        )
    }

    var isOwnProfile = false

    if (id == myId) isOwnProfile = true
    else isOwnProfile = false

    return isOwnProfile ? (
        <YourProfilePage userData={myData} />
    ) : (
        <OtherProfilePage userData={userData} />
    )
}

export default ProfileController
