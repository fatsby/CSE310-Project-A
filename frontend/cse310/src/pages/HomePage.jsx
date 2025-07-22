// MANTINE IMPORTS
import { Select, TextInput, Button, Loader, Image, Alert } from '@mantine/core';

// LUCIDE ICONS
import { Search, AlertCircle } from "lucide-react"

// IMAGE IMPORTS
import AD_BackToSchool from "../assets/HomePage/hr-ad.jpg"

// COMPONENT IMPORTS
import ItemsRow from "../components/home_components/ItemsRow.jsx"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// DATA IMPORTS
import {
    getCurrentUser,
    getItemsByUniversity,
    getSortedItemsByPurchase,
    getSortedItemsByRating,
    getUniversityNames,
    getCoursesByUniversity
} from '../data/SampleData.js';


function HomePage() {
    const [userData, setUserData] = useState(null);
    const [itemsFromUserUni, setItemsFromUserUni] = useState(null);
    const [bestSellerItems, setBestSellerItems] = useState(null);
    const [highestRatingItems, setHighestRatingItems] = useState(null);
    const [universityList, setUniversityList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // SELECTORS STATES
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);

    // SEARCH & VALIDATIONS STATES
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // HANDLER FUNCTION FOR ON UNIVERSITY SELECT
    const handleUniversityChange = (universityName) => {
        setSelectedUniversity(universityName);
        const courses = getCoursesByUniversity(universityName);
        setAvailableCourses(courses);
        setSelectedCourse(null); // Reset course selection
    };

    // FORM SUBMISSION HANDLER
    const handleSearch = (event) => {
        event.preventDefault();
        setError(null);

        // validate
        if (!selectedUniversity || !selectedCourse) {
            setError('Please select both a university and a course to search.');
            return;
        }

        // build search params
        const params = new URLSearchParams();
        params.append('university', selectedUniversity);
        params.append('course', selectedCourse);
        if (searchQuery) {
            params.append('q', searchQuery);
        }

        navigate(`/search?${params.toString()}`);
    };

    useEffect(() => {
        setUserData(getCurrentUser());
        setBestSellerItems(getSortedItemsByPurchase());
        setHighestRatingItems(getSortedItemsByRating());
        setUniversityList(getUniversityNames());
    }, []);

    useEffect(() => {
        if (userData) {
            const tempData = getItemsByUniversity(userData.university);
            setItemsFromUserUni(tempData);
        }
    }, [userData]);

    useEffect(() => {
        if (userData && itemsFromUserUni && bestSellerItems && highestRatingItems) {
            setIsLoading(false);
        }
    }, [userData, itemsFromUserUni, bestSellerItems, highestRatingItems])

    if (isLoading) {
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

                {/* SEARCH SECTION */}
                <form onSubmit={handleSearch}>
                    <div className="flex gap-x-3 pt-4">
                        <div className="w-1/2">
                            <Select
                                checkIconPosition="right"
                                data={universityList}
                                pb={15}
                                placeholder="Select University"
                                radius="lg"
                                size='md'
                                searchable
                                value={selectedUniversity}
                                onChange={handleUniversityChange}
                            />
                        </div>
                        <div className="w-1/2">
                            <Select
                                checkIconPosition="right"
                                data={availableCourses}
                                pb={15}
                                placeholder="Select Course"
                                radius="lg"
                                size='md'
                                searchable
                                value={selectedCourse}
                                onChange={setSelectedCourse}
                                disabled={!selectedUniversity}
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
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                            />
                        </div>
                        <div className='flex-auto w-1/7'>
                            <Button type="submit" size='md' variant="filled" radius="lg" fullWidth color="#0052cc">Find</Button>
                        </div>
                    </div>
                </form>

                {/* VALIDATION ERROR */}
                {error && (
                    <Alert
                        icon={<AlertCircle size="1rem" />}
                        title="Input Required"
                        color="red"
                        radius="md"
                        mt="md"
                        withCloseButton
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
            </div>


            {/* ADVERTISEMENT */}
            <div className="mt-10">
                <Image src={AD_BackToSchool} radius="md" />
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