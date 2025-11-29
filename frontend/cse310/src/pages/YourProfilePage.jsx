import {
    Tabs,
    Loader,
    LoadingOverlay,
    ScrollArea,
    Modal,
    TextInput,
    Button,
    Group,
    Image,
    Text,
    Alert,
} from '@mantine/core'
import {
    CloudUpload,
    BanknoteArrowDown,
    BanknoteArrowUp,
    History,
    Star,
    Edit,
    Image as ImageIcon,
    AlertCircle,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import UploadedItemCard from '../components/UserProfilePage_components/UploadedItemCard'
import BalanceHistoryItem from '../components/UserProfilePage_components/BalanceHistoryItem'
import { fetchMyUploadCourse, fetchPurchaseLog } from '../../utils/fetch'
import { getToken, getUser, saveUser } from '../../utils/auth'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import avatarIMG from '../assets/dog.jpg'

export default function YourProfilePage({ userData }) {
    const [isLoading, setIsLoading] = useState(true)

    const [uploadCourse, setUploadCourse] = useState([])

    const [enrichedHistory, setEnrichedHistory] = useState([])

    const [purchaseLog, setPurchaseLog] = useState(0)

    // State for profile picture modal
    const [pfpModalOpened, { open: openPfpModal, close: closePfpModal }] =
        useDisclosure(false)
    const [newAvatarUrl, setNewAvatarUrl] = useState(userData?.avatarUrl || '')
    const [isSavingPfp, setIsSavingPfp] = useState(false)
    const [pfpError, setPfpError] = useState(null)

    const API_URL = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        setIsLoading(true)

        if (!userData || !userData.id) return

        const fetchData = async () => {
            try {
                const uploaded = await fetchMyUploadCourse()
                setUploadCourse(uploaded)

                const logs = await fetchPurchaseLog()
                setPurchaseLog(logs)

                //Fetch course name while fetching History Purchase
                const historyPromises = logs.map(async (logItem) => {
                    try {
                        const res = await fetch(
                            `${
                                import.meta.env.VITE_API_BASE_URL
                            }/api/documents/${logItem.documentId}`
                        )
                        const docData = await res.json()

                        return {
                            ...logItem,
                            documentName: docData.name || 'Unknown Document',
                        }
                    } catch (err) {
                        console.error(
                            `Fail to get the Name of this document id: ${logItem.documentId}`,
                            err
                        )
                        return {
                            ...logItem,
                            documentName: 'Document unavailable',
                        }
                    }
                })

                const fullHistory = await Promise.all(historyPromises)
                setEnrichedHistory(fullHistory)
            } catch (error) {
                console.error('Error fetching profile data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [userData?.id])

    // Calculate totoal Spent
    const totalSpent = () => {
        if (!purchaseLog) return 0
        console.log(purchaseLog)
        return purchaseLog.reduce((sum, item) => sum + item.pricePaid, 0)
    }

    // Calculate totoal Earned
    const totalEarned = () => {
        if (!uploadCourse) return 0
        return uploadCourse.reduce(
            (sum, item) => sum + item.price * item.purchaseCount,
            0
        )
    }

    // Calculate average Rating
    const avgRating = () => {
        if (!uploadCourse) return 0

        const rated = uploadCourse.filter((i) => Number(i.avgRating) > 0)

        if (!rated) return 0

        return (
            rated.reduce((sum, item) => sum + item.averageRating, 0) /
            rated.length
        )
    }

    // ---- Helpers (swap with API-calculated fields later) ----
    const formatVND = (n) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(n || 0)

    // ---- Helpers format Date ----
    const formatDateVN = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN')
    }

    const handlePfpUpdate = async () => {
        if (!newAvatarUrl.trim()) {
            setPfpError('Image URL cannot be empty.')
            return
        }
        setPfpError(null)
        setIsSavingPfp(true)

        try {
            const res = await fetch(`${API_URL}/api/users/pfp`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(newAvatarUrl),
            })

            if (!res.ok) {
                throw new Error(
                    (await res.text()) || 'Failed to update profile picture.'
                )
            }

            // Update user data in local storage
            const currentUser = getUser()
            const updatedUser = { ...currentUser, avatarUrl: newAvatarUrl }
            saveUser(updatedUser, localStorage.getItem('rememberMe') === 'true')

            notifications.show({
                title: 'Success',
                message: 'Your profile picture has been updated!',
                color: 'green',
            })

            closePfpModal()
            // The page will re-render with new userData from ProfileController
        } catch (err) {
            setPfpError(err.message)
        } finally {
            setIsSavingPfp(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            {/* PFP Update Modal */}
            <Modal
                opened={pfpModalOpened}
                onClose={closePfpModal}
                title="Update Profile Picture"
                centered
            >
                <div className="space-y-4">
                    <TextInput
                        label="Image URL"
                        placeholder="https://example.com/image.png"
                        value={newAvatarUrl}
                        onChange={(e) => setNewAvatarUrl(e.currentTarget.value)}
                        leftSection={<ImageIcon size={16} />}
                    />
                    {newAvatarUrl && (
                        <div>
                            <Text size="sm" fw={500} mb="xs">
                                Preview:
                            </Text>
                            <Image
                                src={newAvatarUrl}
                                fallbackSrc="https://placehold.co/400x400?text=Invalid+URL"
                                alt="Avatar Preview"
                                radius="md"
                                h={200}
                                fit="contain"
                                withPlaceholder
                            />
                        </div>
                    )}
                    {pfpError && (
                        <Alert
                            color="red"
                            icon={<AlertCircle size={16} />}
                            title="Error"
                        >
                            {pfpError}
                        </Alert>
                    )}
                    <Group justify="end" mt="md">
                        <Button variant="default" onClick={closePfpModal}>
                            Cancel
                        </Button>
                        <Button onClick={handlePfpUpdate} loading={isSavingPfp}>
                            Save
                        </Button>
                    </Group>
                </div>
            </Modal>

            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-4 bg-[#fff] shadow-md rounded-2xl p-6">
                    <div className="flex flex-col items-center">
                        <div
                            className="relative group cursor-pointer"
                            onClick={openPfpModal}
                        >
                            <img
                                src={userData?.avatarUrl || avatarIMG}
                                alt="Profile"
                                className="w-24 h-24 rounded-full mb-4"
                            />
                            <div className="absolute inset-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all">
                                <Edit
                                    size={24}
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-center">
                                {userData.userName}
                            </h2>
                            <p className="text-center text-gray-600">
                                {userData.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-8 bg-[#fff] shadow-md rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <BanknoteArrowUp color="red" /> Money Spent
                            </h3>
                            <p className="text-2xl font-bold">
                                {formatVND(Number(totalSpent()))}
                            </p>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <BanknoteArrowDown color="green" /> Money Earned
                            </h3>
                            <p className="text-2xl font-bold">
                                {formatVND(totalEarned())}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Sum of your item sales
                            </p>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <Star color="#d6d602" fill="#d6d602" /> Avg
                                Rating
                            </h3>
                            <p className="text-2xl font-bold">
                                {avgRating() > 0 ? (
                                    <>
                                        {avgRating().toFixed(1)}
                                        <span className="text-base text-gray-600">
                                            /5
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-normal text-gray-500">
                                        No reviews
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABS */}
            <div className="mt-6 bg-[#fff] shadow-md rounded-2xl p-6 min-h-[500px] max-h-[500px]">
                <Tabs
                    color="indigo"
                    variant="pills"
                    radius="xl"
                    defaultValue="uploaded"
                >
                    <Tabs.List>
                        <Tabs.Tab
                            value="uploaded"
                            leftSection={<CloudUpload />}
                        >
                            Uploaded Items
                        </Tabs.Tab>
                        <Tabs.Tab value="history" leftSection={<History />}>
                            Purchase History
                        </Tabs.Tab>
                    </Tabs.List>

                    {/* UPLOADED ITEMS */}
                    <Tabs.Panel className="p-6 relative" value="uploaded">
                        <ScrollArea h={400} type="always" offsetScrollbars>
                            <LoadingOverlay
                                visible={isLoading}
                                overlayBlur={2}
                            />
                            {uploadCourse.length > 0
                                ? uploadCourse.map(
                                      (item) =>
                                          item && (
                                              <UploadedItemCard
                                                  key={item.id}
                                                  item={item}
                                              />
                                          )
                                  )
                                : !isLoading && (
                                      <p>
                                          You have not uploaded any items yet.
                                      </p>
                                  )}
                        </ScrollArea>
                    </Tabs.Panel>

                    {/* BALANCE HISTORY */}
                    <Tabs.Panel
                        className="p-6 relative"
                        value="history"
                        offsetScrollbars
                    >
                        {console.log(enrichedHistory)}
                        <ScrollArea h={400} type="always">
                            {enrichedHistory.length > 0 &&
                                enrichedHistory.map((item) => {
                                    return (
                                        <BalanceHistoryItem
                                            item={{
                                                date: formatDateVN(
                                                    item.purchasedAt
                                                ),
                                                description: `Purchased ${item.documentName}`,
                                                amount: -item.pricePaid,
                                            }}
                                        />
                                    )
                                })}
                        </ScrollArea>
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    )
}
