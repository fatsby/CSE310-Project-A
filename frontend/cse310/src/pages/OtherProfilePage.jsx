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
import {
    getUserById,
    getItemsList,
    getUniversityNames,
    getCoursesByUniversity,
} from '../data/SampleData'

import ItemCard from '../components/OtherProfilePage_components/OtherProfileItemCard'

function parseDMY(dmy) {
    if (!dmy) return new Date(0)
    const [d, m, y] = dmy.split('/').map(Number)
    return new Date(y, (m || 1) - 1, d || 1)
}

function calcSummary(items) {
    if (!items.length) return { uploads: 0, avgRating: 0, totalPurchases: 0 }
    const uploads = items.length
    const avgRating =
        Math.round(
            (items.reduce((s, it) => s + (it.avgRating || 0), 0) / uploads) * 10
        ) / 10
    const totalPurchases = items.reduce(
        (s, it) => s + (it.purchaseCount || 0),
        0
    )
    return { uploads, avgRating, totalPurchases }
}

export default function OtherUserProfile() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)

    const user = useMemo(() => getUserById(Number(id)), [id])

    // All items → then just this user's uploads
    const allItems = useMemo(() => getItemsList(), [])
    const userItems = useMemo(
        () => allItems.filter((it) => String(it.authorId) === String(id)),
        [allItems, id]
    )

    // Search & sort
    const [query, setQuery] = useState('')

    // “Smart” selectors like HomePage
    const universityOptions = useMemo(
        () => [
            { value: 'all', label: 'All universities' },
            ...getUniversityNames().map((n) => ({ value: n, label: n })),
        ],
        []
    )

    const [selectedUniversity, setSelectedUniversity] = useState('all')
    const [selectedCourse, setSelectedCourse] = useState('all')

    // Courses shown = (courses for that university) ∩ (courses this user uploaded at that university)
    const courseOptions = useMemo(() => {
        if (selectedUniversity === 'all') return []
        const baseCourses = getCoursesByUniversity(selectedUniversity) // [{value: 'CSE201', label: 'CSE201 - ...'}]
        const userCourseCodes = new Set(
            userItems
                .filter((it) => it.university === selectedUniversity)
                .map((it) => it.subject)
                .filter(Boolean)
        )
        const filtered = baseCourses.filter((c) => userCourseCodes.has(c.value))
        return [{ value: 'all', label: 'All courses' }, ...filtered]
    }, [selectedUniversity, userItems])

    // Sorting
    const [sort, setSort] = useState('recent') // recent | priceAsc | priceDesc | ratingDesc | purchasedDesc

    // Pagination
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 8

    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 200)
        return () => clearTimeout(t)
    }, [])

    // Filtering pipeline
    const filtered = useMemo(
        ({ userData }) => {
            let res = [...userItems]

            if (query.trim()) {
                const q = query.trim().toLowerCase()
                res = res.filter((it) => it.name.toLowerCase().includes(q))
            }

            if (selectedUniversity !== 'all') {
                res = res.filter((it) => it.university === selectedUniversity)
            }

            if (selectedCourse !== 'all') {
                res = res.filter((it) => it.subject === selectedCourse)
            }

            switch (sort) {
                case 'priceAsc':
                    res.sort((a, b) => Number(a.price) - Number(b.price))
                    break
                case 'priceDesc':
                    res.sort((a, b) => Number(b.price) - Number(a.price))
                    break
                case 'ratingDesc':
                    res.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
                    break
                case 'purchasedDesc':
                    res.sort(
                        (a, b) =>
                            (b.purchaseCount || 0) - (a.purchaseCount || 0)
                    )
                    break
                case 'recent':
                default:
                    res.sort(
                        (a, b) =>
                            parseDMY(b.lastUpdated) - parseDMY(a.lastUpdated)
                    )
                    break
            }
            return res
        },
        [userItems, query, selectedUniversity, selectedCourse, sort]
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE
        return filtered.slice(start, start + PAGE_SIZE)
    }, [filtered, page])

    useEffect(() => {
        setPage(1)
    }, [query, selectedUniversity, selectedCourse, sort])

    const summary = useMemo(() => calcSummary(userItems), [userItems])

    if (!user) {
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
                            src={user.profilePicture}
                            alt={user.name}
                            className="w-24 h-24 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-center">
                            {user.name}
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
                                {summary.uploads}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <Star className="text-yellow-500" /> Avg Rating
                            </h3>
                            <p className="text-2xl font-bold">
                                {summary.avgRating.toFixed(1)}
                            </p>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                                <ShoppingBag /> Total Purchases
                            </h3>
                            <p className="text-2xl font-bold">
                                {summary.totalPurchases}
                            </p>
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
                                <ItemCard key={item.id} item={item} />
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
