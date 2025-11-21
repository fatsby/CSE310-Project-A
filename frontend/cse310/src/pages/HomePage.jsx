// MANTINE IMPORTS
import { Select, TextInput, Button, Loader, Image, Alert } from "@mantine/core";

// LUCIDE ICONS
import { Search, AlertCircle } from "lucide-react";

// IMAGE IMPORTS
import AD_BackToSchool from "../assets/HomePage/hr-ad.jpg";

// COMPONENT IMPORTS
import ItemsRow from "../components/home_components/ItemsRow.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/auth";

function HomePage() {
    // const [userData, setUserData] = useState(null);
    // const [itemsFromUserUni, setItemsFromUserUni] = useState(null);
    const [bestSellerItems, setBestSellerItems] = useState(null);
    const [highestRatingItems, setHighestRatingItems] = useState(null);
    const [universityList, setUniversityList] = useState(null);

    // SELECTORS STATES
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [availableCourses, setAvailableCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");

    // SEARCH & VALIDATIONS STATES
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // HANDLER FUNCTION FOR ON UNIVERSITY SELECT
    const handleUniversityChange = (universityName) => {
        setSelectedUniversity(universityName);
        setSelectedCourse(null); // Reset course selection
    };

    const universityOptions =
        universityList?.map((u) => ({
            value: u.id.toString(),
            label: u.name,
        })) || [];

    const courseOptions =
        availableCourses?.map((s) => ({
            value: s.id.toString(),
            label: s.name,
        })) || [];

    // Fetch all Universities
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try{
                setIsLoading(true);
                const URL = `${API_URL}/api/documents/best-sellers`;
                const res = await fetch(URL);
                const json = await res.json();
                setBestSellerItems(json);
            } catch (err) {
                console.log("Error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBestSellers();
    }, []);
    
    useEffect(() => {
        const fetchTopRated = async () => {
            try{
                setIsLoading(true);
                const URL = `${API_URL}/api/documents/top-rated`;
                const res = await fetch(URL);
                const json = await res.json();
                setHighestRatingItems(json);
            } catch (err) {
                console.log("Error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopRated();
    }, []);

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                setIsLoading(true);
                const URL = `${API_URL}/api/university`;
                const res = await fetch(URL);
                const json = await res.json();
                setUniversityList(json);
            } catch (err) {
                console.log("Error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUniversities();
    }, []);

    // Fetch all Subjects from Selected University
    useEffect(() => {
        if (!selectedUniversity) return;
        const fetchSubjects = async () => {
            try {
                setIsLoading(true);
                const URL = `${API_URL}/api/university/${selectedUniversity}/subject`;
                const token = getToken();
                const headers = {
                    "Content-Type": "application/json",
                };

                if (token) {
                    headers["Authorization"] = `Bearer ${token}`;
                }

                const res = await fetch(URL, {
                    method: "GET",
                    headers: headers,
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const json = await res.json();
                setAvailableCourses(json);
            } catch (err) {
                console.log("Error", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubjects();
    }, [selectedUniversity]);

    // FORM SUBMISSION HANDLER
    const handleSearch = (event) => {
        event.preventDefault();
        setError(null);

        // validate
        if (!selectedUniversity || !selectedCourse) {
            setError("Please select both a university and a course to search.");
            return;
        }

        const param = new URLSearchParams();

        if (selectedCourse) param.append("subjectId", selectedCourse);
        if (selectedUniversity)
            param.append("universityId", selectedUniversity);
        if (searchQuery) param.append("courseTitle", searchQuery);

        // Get name of University and Course
        const universityObj = universityList.find(
            (u) => u.id.toString() === selectedUniversity
        );
        const subjectObj = availableCourses.find(
            (s) => s.id.toString() === selectedCourse
        );

        param.append("universityName", universityObj.name);
        param.append("subjectName", subjectObj.name);

        navigate(`/search?${param.toString()}`);
    };

    // useEffect(() => {
    //     setUserData(getCurrentUser());
    //     setBestSellerItems(getSortedItemsByPurchase());
    //     setHighestRatingItems(getSortedItemsByRating());
    //     setUniversityList(getUniversityNames());
    // }, []);

    // useEffect(() => {
    //     if (userData) {
    //         const tempData = getItemsByUniversity(userData.university);
    //         setItemsFromUserUni(tempData);
    //     }
    // }, [userData]);

    // useEffect(() => {
    //     if (
    //         userData &&
    //         itemsFromUserUni &&
    //         bestSellerItems &&
    //         highestRatingItems
    //     ) {
    //         setIsLoading(false);
    //     }
    // }, [userData, itemsFromUserUni, bestSellerItems, highestRatingItems]);

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
                <h1 className="text-center text-[50px] font-semibold">
                    What are you looking for?
                </h1>

                {/* SEARCH SECTION */}
                <form onSubmit={handleSearch}>
                    <div className="flex gap-x-3 pt-4">
                        <div className="w-1/2">
                            <Select
                                checkIconPosition="right"
                                data={universityOptions}
                                pb={15}
                                placeholder="Select University"
                                radius="lg"
                                size="md"
                                searchable
                                value={selectedUniversity}
                                onChange={handleUniversityChange}
                            />
                        </div>
                        <div className="w-1/2">
                            <Select
                                checkIconPosition="right"
                                data={courseOptions}
                                pb={15}
                                placeholder="Select Course"
                                radius="lg"
                                size="md"
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
                                size="md"
                                value={searchQuery}
                                onChange={(event) =>
                                    setSearchQuery(event.currentTarget.value)
                                }
                            />
                        </div>
                        <div className="flex-auto w-1/7">
                            <Button
                                type="submit"
                                size="md"
                                variant="filled"
                                radius="lg"
                                fullWidth
                                color="#0052cc"
                            >
                                Find
                            </Button>
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
                <Image
                    src={AD_BackToSchool}
                    radius="md"
                />
            </div>
            {/* MAIN CONTENT */}
            <div className="pt-5">
            {/* ITEMS FROM USER UNI */}
            {/* <ItemsRow
                    title={userData.university}
                    itemsArray={itemsFromUserUni}
                /> */}
            <ItemsRow
                    title="Best Selling"
                    itemsArray={bestSellerItems}
                />
            <ItemsRow
                    title="Highest Rating"
                    itemsArray={highestRatingItems}
                />
            </div>
        </div>
    );
}

export default HomePage;
