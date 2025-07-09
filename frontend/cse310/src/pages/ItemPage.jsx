import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ItemPageCSS.css';

// Mantine Components
import { Carousel } from '@mantine/carousel';
import { Button } from '@mantine/core';



// --- Sample Data ---
import { getItemById, getUserById, getReviewsByItemId } from '../data/SampleData';

// --- Icons ---
import { Star, Heart } from 'lucide-react';



function ItemPage() {
    const { id } = useParams();

    const [currentUser, setCurrentUser] = useState(null);

    const [itemData, setItemData] = useState(null);
    const [authorData, setAuthorData] = useState(null);
    const [reviewsData, setReviewsData] = useState([]);


    useEffect(() => {
        const data = getItemById(parseInt(id, 10));
        setItemData(data);

        const author = getUserById(data.authorId);
        setAuthorData(author);

        const reviews = getReviewsByItemId(data.id);
        setReviewsData(reviews);
    }, [id]);


    if (!itemData) {
        return <div className="text-center p-10">Loading item...</div>;
    }

    const slides = itemData.images.map((url) => (
        <Carousel.Slide key={url}>
            <img src={url} alt={itemData.name} className="w-full h-full object-cover rounded-md" />
        </Carousel.Slide>
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
                    <div className="author-info mt-2 flex items-center gap-x-4">
                        <img src={authorData.profilePicture} alt={authorData.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <p className="text-lg font-semibold">{authorData.name}</p>
                        </div>
                    </div>
                </div>
                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4">
                    {/* STATS AND PURCHASE BUTTON */}
                    <div className="bg-stone-50 p-6 rounded-lg drop-shadow-md h-80">
                        <p className="text-xl font-bold text-slate-600 mb-4">Material Information</p>

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
                        
                        <div className="grid grid-cols-12 mb-3 gap-2">
                            <div className="col-span-10">
                                <Button fullWidth variant="outline" color="#000" size="md">Add to Cart</Button>
                            </div>
                            <div className="col-span-2">
                                <Button fullWidth variant="outline" color="#000" size="md"><Heart /></Button>
                            </div>
                        </div>
                        <Button fullWidth variant="filled" color="#0052CC" size="md">Purchase</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
