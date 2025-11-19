import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../../utils/auth";
// import './css/ItemPageCSS.module.css';

// Mantine Components
import { Carousel } from "@mantine/carousel";
import { Button } from "@mantine/core";
import {
    Breadcrumbs,
    Anchor,
    Textarea,
    Rating,
    Text,
    Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

// --- Components ---
import ItemCard from "../components/ItemCard";
import ReviewCard from "../components/ReviewCard";

// --- Sample Data ---
import {
    getItemById,
    getUserById,
    getReviewsByItemId,
    getOtherItems,
    getCurrentUser,
} from "../data/SampleData";

// --- Icons ---
import { Star, Heart, CheckIcon, XIcon } from "lucide-react";

import { Link } from "react-router-dom";

function ItemPage() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authorData, setAuthorData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [otherItems, setOtherItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isPurchased, setIsPurchased] = useState(false);

    const [reviewRating, setReviewRating] = useState(5);
    const [comment, setComment] = useState("");

    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        notifications.show({
            id: "load-item-data",
            loading: true,
            title: "Loading Item...",
            message: "Please wait while we fetch the details.",
            autoClose: false,
            withCloseButton: false,
        });

        const fetchCourse = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/api/documents/${id}`);

                if (!res.ok) {
                    throw new Error(
                        `Could not fetch data. Status: ${res.status}`
                    );
                }

                const json = await res.json();
                setCourse(json);
            } catch (err) {
                console.error("Error fetching course:", err);
                setIsLoading(false);
                notifications.update({
                    id: "load-item-data",
                    color: "red",
                    title: "Error Loading Item",
                    message: "We could not find the item you were looking for.",
                    icon: <XIcon size="1rem" />,
                    autoClose: 5000,
                });
            } finally {
                setIsLoading(false);
                console.log(`${API_URL}/api/documents/${id}}`);
                console.log(course);
            }
        };

        fetchCourse();

        const user = getCurrentUser();
        setCurrentUser(user);
    }, [id, API_URL]);

    useEffect(() => {
        if (course) {
            try {
                // const author = getUserById(course.authorName);
                // setAuthorData(author);

                // const reviews = getReviewsByItemId(course.reviews);
                // setReviewsData(reviews);
                // const itemsInSameSubject = getOtherItems(data.id);
                // setOtherItems(itemsInSameSubject);

                // (Bạn có thể thêm logic kiểm tra 'user' và 'course' ở đây)
                // const owned = !!currentUser?.purchasedItems?.some((p) => p.id === course.id);
                // const isOwner = currentUser?.id === course.authorId;
                // setIsPurchased(owned || isOwner);

                // Cập nhật notification thành công
                notifications.update({
                    id: "load-item-data",
                    color: "teal",
                    title: "Data Loaded!",
                    message: "The item details are ready for you to view.",
                    icon: <CheckIcon size="1rem" />,
                    autoClose: 3000,
                });
            } catch (err) {
                console.error("Error processing dependent data:", err);
                notifications.update({
                    id: "load-item-data",
                    color: "red",
                    title: "Error Processing Data",
                    message: "Failed to process item details.",
                    icon: <XIcon size="1rem" />,
                    autoClose: 5000,
                });
            } finally {
                // Dừng loading *sau khi* tất cả dữ liệu đã được xử lý
                setIsLoading(false);
            }
        }
    }, [course, currentUser]);

    // if (!course || !authorData) {
    //     return <div className="text-center p-10">Loading item...</div>;
    // }

    if (!course) {
        return <div className="text-center p-10">Loading item...</div>;
    }

    const slides = course.images.map((url) => (
        <Carousel.Slide
            key={url}
            className="bg-white flex items-center justify-center"
        >
            <img
                src={url}
                alt={course.name}
                className="max-h-full max-w-full object-contain rounded-md"
            />
        </Carousel.Slide>
    ));

    const breadcrumbItems = [
        { title: "Home", href: "/" },
        { title: course.universityName, href: "#" },
    ].map((item, index) => (
        <Anchor
            href={item.href}
            key={index}
        >
            {item.title}
        </Anchor>
    ));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        );
    }

    const ratingConfig = {
        1: { label: "Terrible", color: "red" },
        2: { label: "Bad", color: "orange" },
        3: { label: "Average", color: "yellow" },
        4: { label: "Good", color: "lime" },
        5: { label: "Excellent", color: "green" },
    };

    // Get current rating in review
    const currentRatingInfo = ratingConfig[reviewRating] || {
        label: "",
        color: "gray",
    };

    const handlePostReview = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/reviews/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify({
                    documentId: id,
                    rating: reviewRating,
                    comment: comment,
                }),
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8">
                    <Carousel
                        withIndicators
                        loop
                        styles={{
                            indicator: {
                                width: 10,
                                height: 10,
                                borderRadius: "100%",
                            },
                        }}
                        emblaOptions={{ loop: true }}
                        className="max-h-[600px] rounded-lg"
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
                                    style={{ transition: "all 0.2s ease" }}
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
                                    setComment(event.currentTarget.value)
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
                        <h1 className="text-2xl font-bold text-zinc-700 mb-4">
                            Reviews ({reviewsData.length})
                        </h1>
                        <div className="space-y-4">
                            {reviewsData.length > 0 &&
                                reviewsData.map((review) => {
                                    const user = getUserById(review.userId);
                                    if (!user) return null;

                                    return (
                                        <ReviewCard
                                            key={review.id}
                                            reviewData={review}
                                            userName={user.name}
                                            userProfilePic={user.profilePicture}
                                        />
                                    );
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
                                {course.updatedAt.split("T")[0]}
                            </p>
                        </div>

                        <p className="text-3xl font-bold text-blue-600 mb-4">
                            {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
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
                                    {isPurchased ? "Item Owned" : "Add to Cart"}
                                </Button>
                            </div>
                            <div className="col-span-3">
                                <Button
                                    onClick={() =>
                                        notifications.show({
                                            title: "New Favourite Item ❤️",
                                            message:
                                                "Added a new item to your favourite collection!",
                                            color: "pink",
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
                            {isPurchased ? "Item Owned" : "Purchase"}
                        </Button>
                    </div>

                    {/* OTHER ITEMS */}
                    <div className="mt-65">
                        <h2 className="text-xl font-bold text-slate-600 mb-4">
                            You may also like
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {otherItems.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    itemData={item}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
