import { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    LoadingOverlay,
    Select,
    SegmentedControl,
    TextInput,
    Pagination,
    Badge,
} from '@mantine/core'
import {
    Star,
    ShoppingBag,
    ArrowUp01,
    ArrowDown01,
    Medal,
    CalendarClock,
    Search,
} from 'lucide-react'

import ItemCard from '../components/ItemCard'
import avatarIMG from '../assets/dog.jpg'
import { fetchCourse } from '../../utils/fetch'

function parseDMY(dmy) {
    if (!dmy) return new Date(0)
    const [d, m, y] = dmy.split('/').map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
}

export default function OtherUserProfile({ userData }) {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [uploadCourse, setUploadCourse] = useState([])

    const [selectedUniversity, setSelectedUniversity] = useState('all')
    const [selectedCourse, setSelectedCourse] = useState('all')

    // Search & sort
    const [query, setQuery] = useState('')

    useEffect(() => {
        setIsLoading(true)
        const getUploadCourse = async () => {
            const uploaded = await fetchCourse({ authorId: userData.id })
            setUploadCourse(uploaded)
            setIsLoading(false)
        }

        getUploadCourse()
    }, [id])

    // “Smart” selectors like HomePage
    const universityOptions = useMemo(() => {
        const unis = [
            ...new Set(
                uploadCourse.map((item) => item.universityName).filter(Boolean)
            ),
        ]
        return [
            { value: 'all', label: 'All Universities' },
            ...unis.map((u) => ({ value: u, label: u })),
        ]
    }, [uploadCourse])

    // Courses shown = (courses for that university) ∩ (courses this user uploaded at that university)
    const courseOptions = useMemo(() => {
        let validItems = uploadCourse

        if (selectedUniversity !== 'all') {
            validItems = uploadCourse.filter(
                (item) => item.universityName === selectedUniversity
            )
        }

        const subjects = [
            ...new Set(
                validItems.map((item) => item.subjectName).filter(Boolean)
            ),
        ]

        return [
            { value: 'all', label: 'All Courses' },
            ...subjects.map((s) => ({ value: s, label: s })),
        ]
    }, [selectedUniversity, uploadCourse])

    // Sorting
    const [sort, setSort] = useState('recent') // recent | priceAsc | priceDesc | ratingDesc | purchasedDesc

    // Pagination
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 8

    // Filtering pipeline
    const filtered = useMemo(() => {
        let res = [...uploadCourse]

        if (query.trim()) {
            const q = query.trim().toLowerCase()
            res = res.filter((it) => it.name.toLowerCase().includes(q))
        }

        if (selectedUniversity !== 'all') {
            res = res.filter((it) => it.universityName === selectedUniversity)
        }

        if (selectedCourse !== 'all') {
            res = res.filter((it) => it.subjectName === selectedCourse)
        }

        switch (sort) {
            case 'priceAsc':
                res.sort((a, b) => Number(a.price) - Number(b.price))
                break
            case 'priceDesc':
                res.sort((a, b) => Number(b.price) - Number(a.price))
                break
            case 'ratingDesc':
                res.sort(
                    (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
                )
                break
            case 'purchasedDesc':
                res.sort(
                    (a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0)
                )
                break
            case 'recent':
            default:
                res.sort(
                    (a, b) => parseDMY(b.updatedAt) - parseDMY(a.updatedAt)
                )
                break
        }
        return res
    }, [uploadCourse, query, selectedUniversity, selectedCourse, sort])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE
        return filtered.slice(start, start + PAGE_SIZE)
    }, [filtered, page])

    useEffect(() => {
        setPage(1)
    }, [query, selectedUniversity, selectedCourse, sort])

    const avgRating = () => {
        if (!uploadCourse) return 0

        const rated = uploadCourse.filter((i) => Number(i.avgRating) > 0)

        if (!rated) return 0

        const total = uploadCourse.reduce(
            (sum, item) => sum + (item.averageRating || 0),
            0
        )

        return total / uploadCourse.length
    }

    const soldCount = () => {
        if (!uploadCourse) return 0

        return uploadCourse.reduce((sum, item) => sum + item.purchaseCount, 0)
    }

    if (!userData) {
        return (
            <div className="container mx-auto px-4 pb-4 pt-[125px]">
                <p className="text-lg">User not found.</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            {/* Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-4 bg-white shadow-md rounded-2xl p-6">
                    <div className="flex flex-col items-center">
                        <img
                            src={userData?.avatarUrl || avatarIMG}
                            alt={userData.userName}
                            className="w-24 h-24 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-center">
                            {userData.userName}
                        </h2>
                        <div className="mt-3 flex gap-2 flex-wrap justify-center">
                            <Badge variant="light" color="blue" radius="md">
                                Uploader
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 bg-white shadow-md rounded-2xl p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <Medal /> Total Uploads
                            </h3>
                            <p className="text-2xl font-bold">
                                {uploadCourse.length}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <Star className="text-yellow-500" /> Avg Rating
                            </h3>
                            <p className="text-2xl font-bold">
                                {avgRating().toFixed(1)}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <ShoppingBag /> Total Purchases
                            </h3>
                            <p className="text-2xl font-bold">{soldCount()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-6 bg-white shadow-md rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-4">
                        <TextInput
                            label="Search"
                            value={query}
                            onChange={(e) => setQuery(e.currentTarget.value)}
                            leftSection={<Search size={16} />}
                            placeholder="Search this user's items..."
                            radius="md"
                        />
                    </div>

                    {/* University (smart) */}
                    <div className="lg:col-span-4">
                        <Select
                            label="University"
                            placeholder="All universities"
                            data={universityOptions}
                            value={selectedUniversity}
                            onChange={(v) => {
                                setSelectedUniversity(v || 'all')
                                setSelectedCourse('all') // reset course when university changes
                            }}
                            radius="md"
                            searchable
                            nothingFoundMessage="No universities"
                        />
                    </div>

                    {/* Course (smart; disabled until a university is chosen) */}
                    <div className="lg:col-span-4">
                        <Select
                            label="Course"
                            placeholder={
                                selectedUniversity === 'all'
                                    ? 'Select a university first'
                                    : 'All courses'
                            }
                            data={courseOptions}
                            value={selectedCourse}
                            onChange={(v) => setSelectedCourse(v || 'all')}
                            radius="md"
                            searchable
                            disabled={selectedUniversity === 'all'}
                            nothingFoundMessage="No courses for this user"
                        />
                    </div>
                </div>

                {/* Sort */}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                        Sort by
                    </label>
                    <SegmentedControl
                        radius="xl"
                        value={sort}
                        onChange={setSort}
                        data={[
                            {
                                label: (
                                    <div className="flex items-center gap-1">
                                        <CalendarClock size={16} />
                                        Recent
                                    </div>
                                ),
                                value: 'recent',
                            },
                            {
                                label: (
                                    <div className="flex items-center gap-1">
                                        <ArrowUp01 size={16} />
                                        Price
                                    </div>
                                ),
                                value: 'priceAsc',
                            },
                            {
                                label: (
                                    <div className="flex items-center gap-1">
                                        <ArrowDown01 size={16} />
                                        Price
                                    </div>
                                ),
                                value: 'priceDesc',
                            },
                            {
                                label: (
                                    <div className="flex items-center gap-1">
                                        <Star size={16} />
                                        Rating
                                    </div>
                                ),
                                value: 'ratingDesc',
                            },
                            {
                                label: (
                                    <div className="flex items-center gap-1">
                                        <ShoppingBag size={16} />
                                        Purchased
                                    </div>
                                ),
                                value: 'purchasedDesc',
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Items grid */}
            <div className="mt-6 bg-white shadow-md rounded-2xl p-6 relative">
                <LoadingOverlay visible={isLoading} overlayBlur={2} />
                {pageItems.length ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            {pageItems.map((item) => (
                                // <ItemCard key={item.id} itemData={item} />
                                <ItemCard key={item.id} itemData={item} />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center">
                                <Pagination
                                    total={totalPages}
                                    value={page}
                                    onChange={setPage}
                                    radius="md"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    !isLoading && (
                        <p className="text-gray-700">
                            No items match your filters.
                        </p>
                    )
                )}
            </div>
        </div>
    )
}
