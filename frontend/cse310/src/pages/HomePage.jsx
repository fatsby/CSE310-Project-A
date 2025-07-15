// MANTINE IMPORTS
import { Select, TextInput, Button, Loader, Image } from '@mantine/core';

// LUCIDE ICONS
import { Search } from "lucide-react"

// IMAGE IMPORTS
import Main_AD from "../assets/HomePage/main-ad.jpg";
import hr_ad from "../assets/HomePage/hr-ad.jpg"

// COMPONENT IMPORTS
import ItemsRow from "../components/home_components/ItemsRow.jsx"
import { use, useEffect, useState } from 'react';

import { getCurrentUser, getItemsByUniversity, getSortedItemsByPurchase, getSortedItemsByRating } from '../data/SampleData.js';


function HomePage() {
    const [userData, setUserData] = useState(null);
    const [itemsFromUserUni, setItemsFromUserUni] = useState(null);
    const [bestSellerItems, setBestSellerItems] = useState(null);
    const [highestRatingItems, setHighestRatingItems] = useState(null);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setUserData(getCurrentUser());
        setBestSellerItems(getSortedItemsByPurchase());
        setHighestRatingItems(getSortedItemsByRating());
    }, []);

    useEffect(() => {
        if (userData) {
            const tempData = getItemsByUniversity(userData.university);
            setItemsFromUserUni(tempData);
        }
    }, [userData]);

    useEffect(() => {
        if (userData && itemsFromUserUni && bestSellerItems && highestRatingItems){
            setIsLoading(false);
        }
    }, [userData, itemsFromUserUni, bestSellerItems, highestRatingItems])

    if(isLoading){
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            {/* HEADER TEXT */}
            <div className="w-fit mx-auto">
                <h1 className="text-center text-[50px] font-semibold">What are you looking for?</h1>

                {/* SELECTOR DIV */}
                <div className="flex gap-x-3 pt-4">
                    <div className="w-1/2">
                        <Select
                            checkIconPosition="right"
                            data={['EIU', 'VNU', 'HUST', 'HUB']}
                            pb={15}
                            placeholder="Select University"
                            radius="lg"
                            size='md'
                        />
                    </div>
                    <div className="w-1/2">
                        <Select
                            checkIconPosition="right"
                            data={['EIU', 'VNU', 'HUST', 'HUB']}
                            pb={15}
                            placeholder="Select Course"
                            radius="lg"
                            size='md'
                        />
                    </div>
                </div>
                <div className="flex gap-x-2">
                    <div className="flex-auto w-6/7">
                        <TextInput
                            placeholder="Search for documents name, notes, and more... (Optional)"
                            leftSection={<Search size="16" />}
                            radius="lg"
                            size='md'
                        />
                    </div>
                    <div className='flex-auto w-1/7'>
                        <Button size='md' variant="filled" radius="lg" fullWidth color="#0052cc">Find</Button>
                    </div>
                </div>
            </div>

            
            {/* ADVERTISEMENT */}
            <div className="mt-10">
                <Image src={hr_ad} radius="md"/>
            </div>

            {/* MAIN CONTENT */}
            <div className="pt-5">
                {/* ITEMS FROM USER UNI */}
                <ItemsRow title={userData.university} itemsArray={itemsFromUserUni} />
                <ItemsRow title="Best Selling" itemsArray={bestSellerItems} />
                <ItemsRow title="Highest Rating" itemsArray={highestRatingItems} />
            </div>
        </div>
    );
}

export default HomePage;