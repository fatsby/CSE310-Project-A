import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ItemPageCSS.css';

// Mantine Components
import { Carousel } from '@mantine/carousel';
import { Button } from '@mantine/core';
import { Breadcrumbs, Anchor } from '@mantine/core';


// --- Components ---
import ItemCard from '../components/ItemCard';
import ReviewCard from '../components/ReviewCard';

// --- Sample Data ---
import { getItemById, getUserById, getReviewsByItemId, getOtherItems } from '../data/SampleData';

// --- Icons ---
import { Star, Heart } from 'lucide-react';



function ItemPage() {
    const { id } = useParams();

    const [currentUser, setCurrentUser] = useState(null);

    const [itemData, setItemData] = useState(null);
    const [authorData, setAuthorData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);
    const [otherItems, setOtherItems] = useState([]);


    useEffect(() => {
        const data = getItemById(parseInt(id, 10));
        setItemData(data);

        const author = getUserById(data.authorId);
        setAuthorData(author);

        const reviews = getReviewsByItemId(data.id);
        setReviewsData(reviews);

        const itemsInSameSubject = getOtherItems(data.id);
        setOtherItems(itemsInSameSubject);
    }, [id]);


    if (!itemData || !authorData) {
        return <div className="text-center p-10">Loading item...</div>;
    }

    const slides = itemData.images.map((url) => (
        <Carousel.Slide key={url}>
            <img src={url} alt={itemData.name} className="w-full h-full object-cover rounded-md" />
        </Carousel.Slide>
    ));

    const breadcrumbItems = [
        { title: 'Home', href: '/' },
        // Remove the quotes around itemData.university
        { title: itemData.university, href: '#' },
    ].map((item, index) => (
        <Anchor href={item.href} key={index}>
            {item.title}
        </Anchor>
    ));

    return (
        <div className="container mx-auto p-4 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT COLUMN */}
                <div className="lg:col-span-8">
                    <Carousel withIndicators loop
                        styles={{
                            indicator: {
                                width: 10,
                                height: 10,
                                borderRadius: '100%',
                            },
                        }}
                        emblaOptions={{ loop: true }}
                    >
                        {slides}
                    </Carousel>

                    {/* ITEM INFO */}
                    <div className="item-info mt-4 grid lg:grid-cols-12 grid-cols-1 gap-4 ">
                        <div className="item-name lg:col-span-9">
                            <h1 className="text-3xl font-bold">{itemData.name}</h1>
                        </div>
                        <div className="item-stats lg:col-span-3 flex items-center justify-start lg:justify-end gap-x-2">
                            <p className="text-2xl font-bold">{itemData.avgRating}</p>
                            <Star fill="#FFCC00" color="#FFCC00" size={28} />
                            <p className="text-2xl font-light">{reviewsData.length} Reviews</p>
                        </div>
                    </div>

                    {/* AUTHOR INFO */}
                    <div className="author-info mt-2 flex items-center gap-x-4 mb-10">
                        <img src={authorData.profilePicture} alt={authorData.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="text-lg font-semibold">{authorData.name}</p>
                        </div>
                    </div>

                    {/* PRODUCT DESCRIPTION */}
                    <div className="item-description">
                        <p className="text-lg font-regular mt-4 whitespace-pre-line text-zinc-900">{itemData.description}</p>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="reviews mt-16">
                        <h1 className="text-2xl font-bold text-zinc-700 mb-4">Reviews ({reviewsData.length})</h1>
                        <div className="space-y-4">
                            {reviewsData.length > 0 && (
                                reviewsData.map(review => {
                                    const user = getUserById(review.userId);
                                    if (!user) return null;
                                    
                                    return (
                                        <ReviewCard key={review.id} reviewData={review} userName={user.name} userProfilePic={user.profilePicture} />
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4">

                    {/* BREADCRUMBS */}
                    <Breadcrumbs className="mb-4">{breadcrumbItems}</Breadcrumbs>

                    {/* STATS AND PURCHASE BUTTON */}
                    <div className="bg-stone-50 p-6 rounded-lg drop-shadow-md h-100">
                        <p className="text-xl font-bold text-slate-600 mb-4">Material Information</p>

                        {/* SUBJECT */}
                        <div className='flex items-center justify-between'>
                            <p className="text-lg font-light text-gray-500">Subject:</p>
                            <p className="text-lg font-light text-gray-800">{itemData.subject}</p>
                        </div>

                        {/* UNIVERSITY */}
                        <div className='flex items-center justify-between'>
                            <p className="text-lg font-light text-gray-500">University:</p>
                            <p className="text-lg font-light text-gray-800">{itemData.university}</p>
                        </div>

                        {/* PURCHASES */}
                        <div className='flex items-center justify-between'>
                            <p className="text-lg font-light text-gray-500">Purchases:</p>
                            <p className="text-lg font-light text-gray-800">{itemData.purchaseCount}</p>
                        </div>

                        {/* LAST UPDATED */}
                        <div className='flex items-center justify-between mb-4'>
                            <p className="text-lg font-light text-gray-500">Last Updated:</p>
                            <p className="text-lg font-light text-gray-800">{itemData.lastUpdated}</p>
                        </div>

                        <p className="text-3xl font-bold text-blue-600 mb-4">{itemData.price} VND</p>

                        {/* ADD TO CART AND FAVORITE */}
                        <div className="grid grid-cols-12 mb-3 gap-2">
                            <div className="col-span-10">
                                <Button fullWidth variant="outline" color="#000" size="md">Add to Cart</Button>
                            </div>
                            <div className="col-span-2">
                                <Button fullWidth variant="outline" color="#000" size="md"><Heart /></Button>
                            </div>
                        </div>
                        {/* PURCHASE BUTTON */}
                        <Button fullWidth variant="filled" color="#0052CC" size="md">Purchase</Button>
                    </div>

                    {/* OTHER ITEMS IN SAME SUBJECT */}
                    <div className="mt-65">
                        <h2 className="text-xl font-bold text-slate-600 mb-4">You may also like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                            {/* Placeholder for other items */}
                            {otherItems.map(item => (
                                <ItemCard key={item.id} itemData={item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
