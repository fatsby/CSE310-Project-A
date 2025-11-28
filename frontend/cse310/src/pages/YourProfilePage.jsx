import { Tabs, Loader, LoadingOverlay, ScrollArea } from '@mantine/core'
import {
    CloudUpload,
    BanknoteArrowDown,
    BanknoteArrowUp,
    History,
    Star,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import UploadedItemCard from '../components/UserProfilePage_components/UploadedItemCard'
import BalanceHistoryItem from '../components/UserProfilePage_components/BalanceHistoryItem'
import { fetchCourse, fetchPurchaseLog } from './../../utils/fetch'
import avatarIMG from '../assets/dog.jpg'

export default function YourProfilePage({ userData }) {
    const [isLoading, setIsLoading] = useState(true)

    const [uploadCourse, setUploadCourse] = useState([])

    const [enrichedHistory, setEnrichedHistory] = useState([])

    const [purchaseLog, setPurchaseLog] = useState(0)

    useEffect(() => {
        setIsLoading(true)

        if (!userData || !userData.id) return

        const fetchData = async () => {
            try {
                const uploaded = await fetchCourse({ authorId: userData.id })
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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            <h1 className="text-3xl font-bold mb-4">User Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-4 bg-[#fff] shadow-md rounded-2xl p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={userData?.avatarUrl || avatarIMG}
                            alt="Profile"
                            className="w-24 h-24 rounded-full mb-4"
                        />
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
