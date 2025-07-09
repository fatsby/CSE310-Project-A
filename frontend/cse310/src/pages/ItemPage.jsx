import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ItemPageCSS.css';

// Mantine Carousel and its CSS
import { Carousel } from '@mantine/carousel';


// --- Sample Data ---
import { getItemById } from '../data/SampleData';


function ItemPage() {
    const { id } = useParams();
    
    const [currentUser, setCurrentUser] = useState(null);

    const [itemData, setItemData] = useState(null);
    const [authorData, setAuthorData] = useState(null);
    

    useEffect(() => {
        const data = getItemById(parseInt(id, 10));
        setItemData(data);
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
                </div>
                <div className="lg:col-span-4 bg-stone-50 p-6 rounded-lg drop-shadow-md h-80">
                    <h1 className="text-3xl font-bold mb-2">{itemData.name}</h1>
                    <p className="text-lg text-slate-600 mb-4">By {itemData.author}</p>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">{itemData.price} VND</p>
                    <h3 className="font-bold mt-6 mb-2">Description</h3>
                    <p className="text-slate-700">{itemData.description}</p>
                </div>
            </div>
        </div>
    );
}

export default ItemPage;
