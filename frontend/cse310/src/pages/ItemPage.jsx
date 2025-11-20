import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getToken, checkPurchased } from '../../utils/auth'
import { fetchUser, fetchCourse } from '../../utils/fetch'
import avatarIMG from '../assets/dog.jpg'
import notFoundImg from '../assets/no-data.png'

// import './css/ItemPageCSS.module.css';

// Mantine Components
import { Carousel } from '@mantine/carousel'
import {
    Breadcrumbs,
    Anchor,
    Textarea,
    Rating,
    Text,
    Loader,
    Modal,
    Button,
    Group,
    Stack,
    Title,
    Card,
    Image,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'

// --- Components ---
import ItemCard from '../components/ItemCard'
import ReviewCard from '../components/ReviewCard'

// --- Icons ---
import { Star, Heart, CheckIcon, XIcon, AlertCircle } from 'lucide-react'

import { Link } from 'react-router-dom'

function ItemPage() {
    const { id } = useParams()
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const [otherCourses, setOtherCourses] = useState([])
    const [reviewsData, setReviewsData] = useState([])

    const [reviewRating, setReviewRating] = useState(5)
    const [comment, setComment] = useState('')
    const [opened, { open, close }] = useDisclosure(false)

    const [isPurchased, setIsPurchased] = useState(false)

    const [errorTitle, setErrorTitle] = useState('Error')
    const [errorContent, setErrorContent] = useState('')

    const API_URL = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        fetchCourseData()

        fetchReview()

        //Check if this Document is purchased or not
        const verifyPurchase = async () => {
            const currentToken = getToken()
            if (!currentToken) {
                setIsPurchased(false)
                return
            }
            const purchased = await checkPurchased(getToken, id)

            setIsPurchased(purchased)
        }

        verifyPurchase()
    }, [id])

    useEffect(() => {
        if (!course) return

        const getOtherCourses = async () => {
            try {
                const data = await fetchCourse({
                    universityId: course.universityId,
                    subjectId: course.subjectId,
                })

                if (Array.isArray(data)) {
                    const filteredData = data.filter(
                        (item) => item.id !== parseInt(id)
                    )
                    setOtherCourses(filteredData)
                } else {
                    setOtherCourses([])
                }
            } catch (error) {
                console.error('Error loading other documents:', error)
                setOtherCourses([])
            }
        }

        getOtherCourses()
    }, [course, id])

    const fetchCourseData = async () => {
        setIsLoading(true)
        const notifId = 'load-item-data'
        notifications.show({
            id: notifId,
            loading: true,
            title: 'Loading data...',
            message: 'Course data is fetching....',
            autoClose: false,
            withCloseButton: false,
            color: 'blue',
        })
        try {
            const res = await fetch(`${API_URL}/api/documents/${id}`)

            if (!res.ok) {
                throw new Error(`Could not fetch data. Status: ${res.status}`)
            }

            const json = await res.json()
            setCourse(json)

            notifications.update({
                id: notifId,
                color: 'teal',
                title: 'Getting data success!!',
                message: 'Course is ready to show',
                icon: <CheckIcon size="1rem" />,
                loading: false,
                autoClose: 2000,
            })
        } catch (err) {
            console.error('Error fetching course:', err)
            setIsLoading(false)
            notifications.update({
                id: notifId,
                color: 'red',
                title: 'Fail to load data',
                message: 'Can not fetch course data',
                icon: <XIcon size="1rem" />,
                loading: false,
                autoClose: 4000,
            })
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReview = async () => {
        setIsLoading(true)
        try {
            const respone = await fetch(
                `${API_URL}/api/reviews?documentId=${id}`
            )
            if (!respone.ok) {
                throw new Error(
                    `Could not reviews data. Status: ${respone.status}`
                )
            }

            const reviews = await respone.json()
            setReviewsData(reviews)
        } catch (err) {
            console.error('Error fetching course:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePostReview = async () => {
        setIsLoading(true)

        try {
            const response = await fetch(`${API_URL}/api/reviews/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    documentId: id,
                    rating: reviewRating,
                    comment: comment,
                }),
            })
            if (!response.ok) {
                showError('Review Failed', response.text())

                open()
                return
            }

            notifications.show({
                title: 'Success',
                message: 'Review posted successfully!',
                color: 'green',
            })

            setComment('')
            setReviewRating(5)
            fetchCourse()
        } catch (error) {
            console.error(error)
            setErrorContent('Network connection error.')
            open()
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        )
    }

    if (!course) {
        return <div className="text-center p-10">Loading item...</div>
    }

    const slides = course.images.map((url) => (
        <Carousel.Slide
            key={url}
            className="bg-gray-100 h-full flex items-center justify-center"
        >
            <img
                src={url}
                alt={course.name}
                className="w-full h-full object-contain rounded-md"
            />
        </Carousel.Slide>
    ))

    const breadcrumbItems = [
        { title: 'Home', href: '/' },
        { title: course.universityName, href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ))

    const ratingConfig = {
        1: { label: 'Terrible', color: 'red' },
        2: { label: 'Bad', color: 'orange' },
        3: { label: 'Average', color: 'yellow' },
        4: { label: 'Good', color: 'lime' },
        5: { label: 'Excellent', color: 'green' },
    }

    const showError = (title, content) => {
        setErrorTitle(title)
        setErrorContent(content)
        open()
    }

    // Get current rating in review
    const currentRatingInfo = ratingConfig[reviewRating] || {
        label: '',
        color: 'gray',
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false} //Disable default close button
                centered
                radius="lg"
                padding="xl"
            >
                <Stack align="center" spacing="md">
                    {/* Icon Lỗi màu đỏ */}
                    <div className="bg-red-100 p-4 rounded-full">
                        <AlertCircle size={48} className="text-red-600" />
                    </div>

                    {/* Tiêu đề và nội dung */}
                    <div className="text-center">
                        <Title order={3} className="mb-2 text-slate-800">
                            {errorTitle}
                        </Title>
                        <Text c="dimmed" size="sm">
                            {errorContent}
                        </Text>
                    </div>

                    {/* Nút đóng */}
                    <Button
                        fullWidth
                        color="red"
                        variant="light"
                        onClick={close}
                        radius="md"
                        size="md"
                        className="mt-4"
                    >
                        Close
                    </Button>
                </Stack>
            </Modal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8">
                    <Carousel
                        withIndicators
                        loop
                        height={500}
                        slideSize="100%"
                        align="start"
                        styles={{
                            indicator: {
                                width: 10,
                                height: 10,
                                borderRadius: '100%',
                                background: 'rgba(0, 0, 0, 0.5)',
                            },
                            viewport: {
                                height: '100%',
                            },
                        }}
                        emblaOptions={{ loop: true }}
                        className="rounded-lg shadow-md bg-gray-50"
                    >
                        {slides}
                    </Carousel>

                    {/* ITEM INFO */}
                    <div className="item-info mt-4 grid lg:grid-cols-12 grid-cols-1 gap-4 ">
                        <div className="item-name lg:col-span-9">
                            <h1 className="text-3xl font-bold">
                                {course.name}
                            </h1>
                        </div>
                        <div className="item-stats lg:col-span-3 flex items-center justify-start lg:justify-end gap-x-2">
                            {course.reviewCount > 0 && (
                                <>
                                    <p className="text-2xl font-bold">
                                        {course.averageRating}
                                    </p>
                                    <Star
                                        fill="#FFCC00"
                                        color="#FFCC00"
                                        size={28}
                                    />
                                </>
                            )}

                            <p className="text-2xl font-light">
                                {course.reviewCount} Reviews
                            </p>
                        </div>
                    </div>

                    {/* AUTHOR INFO */}
                    <div className="author-info mt-2 flex items-center gap-x-4 mb-10">
                        {/* <Link to={`/profile/${authorData.id}`}> */}
                        <Link to={`/profile/1`}>
                            {/* <img
                                src={authorData.profilePicture}
                                alt={authorData.name}
                                className="w-12 h-12 rounded-full"
                            /> */}
                        </Link>
                        {/* <Link to={`/profile/${authorData.id}`}> */}
                        <Link to={`/profile/1`}>
                            <p className="text-lg font-semibold">
                                {course.authorName}
                            </p>
                        </Link>
                    </div>

                    {/* PRODUCT DESCRIPTION */}
                    <div className="item-description">
                        <p className="text-lg font-regular mt-4 whitespace-pre-line text-zinc-900">
                            {course.description}
                        </p>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="reviews mt-16">
                        {/* Only show review input section if already purchased the document */}
                        {isPurchased && (
                            <>
                                <h1 className="text-2xl font-bold text-zinc-700 mb-4">
                                    Write your review
                                </h1>
                                <div className="mb-4">
                                    <div className="flex items-center mb-2">
                                        <Rating
                                            defaultValue={5}
                                            value={reviewRating}
                                            onChange={setReviewRating}
                                            color="rgba(250, 186, 90, 1)"
                                            className="mb-2 ml-2"
                                        />
                                        <Text
                                            span
                                            c={currentRatingInfo.color}
                                            fw={700}
                                            ml="md"
                                            style={{
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {currentRatingInfo.label}
                                        </Text>
                                    </div>
                                    <Textarea
                                        size="md"
                                        radius="lg"
                                        value={comment}
                                        placeholder="What do you think about this course?"
                                        onChange={(event) =>
                                            setComment(
                                                event.currentTarget.value
                                            )
                                        }
                                    />
                                    <div className="flex mt-2 justify-end">
                                        <Button
                                            variant="filled"
                                            color="indigo"
                                            radius="lg"
                                            onClick={handlePostReview}
                                        >
                                            Post
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                        <h1 className="text-2xl font-bold text-zinc-700 mb-4">
                            Reviews ({reviewsData.length})
                        </h1>
                        <div className="space-y-4">
                            {console.log(reviewsData)}
                            {reviewsData.length > 0 &&
                                reviewsData.map((review) => {
                                    const user = fetchUser(review.userId)
                                    var picture = avatarIMG
                                    if (!user) return null

                                    if (user.avatarUrl) {
                                        picture = user.avatarUrl
                                    }

                                    return (
                                        <ReviewCard
                                            reviewData={review}
                                            userProfilePic={picture}
                                        />
                                    )
                                })}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4">
                    {/* BREADCRUMBS */}
                    <Breadcrumbs className="mb-4">
                        {breadcrumbItems}
                    </Breadcrumbs>

                    {/* STATS AND PURCHASE BUTTON */}
                    <div className="bg-white p-6 rounded-lg h-auto shadow-xl">
                        <p className="text-xl font-bold text-slate-600 mb-4">
                            Material Information
                        </p>

                        {/* SUBJECT */}
                        <div className="mb-1">
                            <p className="text-md font-medium text-gray-500">
                                Subject:
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {course.subjectName}
                            </p>
                        </div>

                        {/* UNIVERSITY */}
                        <div className="mb-1">
                            <p className="text-md font-medium text-gray-500">
                                University:
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {course.universityName}
                            </p>
                        </div>

                        {/* PURCHASES */}
                        <div className="flex items-center justify-between">
                            <p className="text-md font-medium text-gray-500">
                                Purchases:
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {course.purchaseCount}
                            </p>
                        </div>

                        {/* LAST UPDATED */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-md font-medium text-gray-500">
                                Last Updated:
                            </p>
                            <p className="text-lg font-semibold text-gray-800">
                                {course.updatedAt.split('T')[0]}
                            </p>
                        </div>

                        <p className="text-3xl font-bold text-blue-600 mb-4">
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(course.price)}
                        </p>

                        {/* ADD TO CART AND FAVORITE */}
                        <div className="grid grid-cols-12 mb-3 gap-2">
                            <div className="col-span-9">
                                <Button
                                    fullWidth
                                    variant="outline"
                                    color="#000"
                                    size="md"
                                    disabled={isPurchased}
                                >
                                    {isPurchased ? 'Item Owned' : 'Add to Cart'}
                                </Button>
                            </div>
                            <div className="col-span-3">
                                <Button
                                    onClick={() =>
                                        notifications.show({
                                            title: 'New Favourite Item ❤️',
                                            message:
                                                'Added a new item to your favourite collection!',
                                            color: 'pink',
                                        })
                                    }
                                    fullWidth
                                    variant="outline"
                                    color="#000"
                                    size="md"
                                    disabled={isPurchased}
                                >
                                    <Heart size={18} />
                                </Button>
                            </div>
                        </div>

                        {/* PURCHASE BUTTON */}
                        <Button
                            fullWidth
                            variant="filled"
                            color="#0052CC"
                            size="md"
                            disabled={isPurchased}
                            className="w-full"
                        >
                            {isPurchased ? 'Item Owned' : 'Purchase'}
                        </Button>
                    </div>

                    {/* OTHER ITEMS */}
                    <div className="mt-65">
                        <h2 className="text-xl font-bold text-slate-600 mb-4">
                            You may also like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {otherCourses.length > 0 ? (
                                otherCourses.map((item) => (
                                    <ItemCard key={item.id} itemData={item} />
                                ))
                            ) : (
                                <Card
                                    shadow="sm"
                                    padding="xl"
                                    component="a"
                                    target="_blank"
                                >
                                    <Card.Section>
                                        <Image
                                            src={notFoundImg}
                                            h={160}
                                            alt="No similar course!"
                                            fit="contain"
                                        />
                                    </Card.Section>

                                    <Text fw={500} size="lg" mt="md">
                                        No similar courses found{' '}
                                    </Text>

                                    <Text mt="xs" c="dimmed" size="sm">
                                        We currently don't have other items
                                        related to this course in our system.
                                        Please check back later for updates.
                                    </Text>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemPage
