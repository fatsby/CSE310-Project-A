// MANTINE IMPORTS
import { Select, TextInput, Button, Loader } from '@mantine/core';

// LUCIDE ICONS
import { Search } from "lucide-react"

// COMPONENT IMPORTS
import ItemsRow from "../components/home_components/ItemsRow.jsx"
import { use, useEffect, useState } from 'react';

import { getCurrentUser, getItemsByUniversity, getSortedItemsByPurchase } from '../data/SampleData.js';


function HomePage() {
    const [userData, setUserData] = useState(null);
    const [itemsFromUserUni, setItemsFromUserUni] = useState(null);
    const [bestSellerItems, setBestSellerItems] = useState(null);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        setUserData(getCurrentUser());
        setBestSellerItems(getSortedItemsByPurchase());
    }, []);

    useEffect(() => {
        if (userData) {
            const tempData = getItemsByUniversity(userData.university);
            setItemsFromUserUni(tempData);
        }
    }, [userData]);

    useEffect(() => {
        if (userData && itemsFromUserUni && bestSellerItems){
            setIsLoading(false);
        }
    }, [userData, itemsFromUserUni, bestSellerItems])

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
                        />
                    </div>
                    <div className="w-1/2">
                        <Select
                            checkIconPosition="right"
                            data={['EIU', 'VNU', 'HUST', 'HUB']}
                            pb={15}
                            placeholder="Select Course"
                        />
                    </div>
                </div>
                <div className="flex gap-x-2">
                    <div className="flex-auto w-6/7">
                        <TextInput
                            placeholder="Search for documents name, notes, and more... (Optional)"
                            leftSection={<Search size="16" />}
                        />
                    </div>
                    <div className='flex-auto w-1/7'>
                        <Button variant="filled" fullWidth color="#0052cc">Search</Button>
                    </div>
                </div>
            </div>


            {/* MAIN CONTENT */}
            <div className="pt-5">
                {/* ITEMS FROM USER UNI */}
                <ItemsRow title={userData.university} itemsArray={itemsFromUserUni}></ItemsRow>
                <ItemsRow title="Best Selling" itemsArray={bestSellerItems}></ItemsRow>
            </div>
        </div>
    );
}

export default HomePage;