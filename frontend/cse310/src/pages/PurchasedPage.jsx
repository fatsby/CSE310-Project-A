import { TextInput, Select, Button } from "@mantine/core";
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { getUserPurchased } from "../data/SampleData.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PurchasedPage() {
    const [allItems, setAllItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    const [selectedUni, setSelectedUni] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isAsc, setIsAsc] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [universityList, setUniversityList] = useState([]);
    const [courseList, setCourseList] = useState([]);

    console.log(courseList);
    console.log(universityList);

    useEffect(() => {
        const data = getUserPurchased();
        setAllItems(data);
        setFilteredItems(data);

        setUniversityList([...new Set(data.map((item) => item.university))]);
        setCourseList([...new Set(data.map((item) => item.subject))]);
    }, []);

    // Filter
    const filterItems = (uni, subject, searchValue) => {
        var result = allItems;
        if (uni) {
            result = result.filter((item) => item.university === uni);
        }

        if (subject) {
            result = result.filter((item) => item.subject === subject);
        }

        if (searchValue) {
            result = result.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
        setFilteredItems(result);
    };

    // Filter by University
    const handleUniChange = (value) => {
        setSelectedUni(value);
        setSelectedSubject(null);
        setCourseList([
            ...new Set(
                allItems
                    .filter((item) => item.university == value)
                    .map((item) => item.subject)
            ),
        ]);
        filterItems(value, selectedSubject, searchValue);
    };

    // Filter by Subject
    const handleSubjectChange = (value) => {
        setSelectedSubject(value);
        filterItems(selectedUni, value, searchValue);
    };

    // Sort by Alphabet
    const sortAlphabet = () => {
        const sortAZ = [...filteredItems];

        if (isAsc) {
            sortAZ.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            sortAZ.sort((a, b) => b.name.localeCompare(a.name));
        }

        setFilteredItems(sortAZ);
        setIsAsc((prev) => !prev);
    };

    // Search
    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        filterItems(selectedUni, selectedSubject, value);
    };

    return (
        <>
            <div className="bg-[#F9FAFB]">
                <div className="container mx-auto pt-[125px]">
                    <h2 className="col-span-7 font-bold text-[40px] pl-[20px] pt-[20px] ">
                        Your Purchased Courses ({allItems.length})
                    </h2>
                    <p className="font-bold text-[20px] pl-[20px] pt-[20px] text-blue-700">
                        Showing {filteredItems.length} item(s)
                    </p>
                    <div className="py-[20px] mt-[40px] border-y border-solid">
                        <div className="flex gap-4 px-[20px]">
                            <div className="">
                                <TextInput
                                    leftSection={<Search size="16px" />}
                                    radius="xl"
                                    placeholder="Search..."
                                    value={searchValue}
                                    onChange={handleSearchInput}
                                />
                            </div>
                            <div className="">
                                <Select
                                    placeholder="Select university"
                                    autoSelectOnBlur
                                    radius="xl"
                                    data={universityList}
                                    onChange={handleUniChange}
                                    value={selectedUni}
                                />
                            </div>
                            <div className=" ">
                                <Select
                                    placeholder="Select course name"
                                    autoSelectOnBlur
                                    radius="xl"
                                    data={courseList}
                                    onChange={handleSubjectChange}
                                    disabled={!selectedUni}
                                    value={selectedSubject}
                                />
                            </div>
                            <div className="ml-auto flex items-center">
                                <Button
                                    variant="filled"
                                    color="rgba(117, 117, 117, 1)"
                                    radius="md"
                                    onClick={sortAlphabet}
                                >
                                    {isAsc ? <ArrowDownAZ /> : <ArrowUpAZ />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-[20px] px-[10px]">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="col-span-1">
                                <Link
                                    to={`/data/${item.id}`}
                                    className="grid grid-cols-10 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] rounded-xl p-[5px]"
                                >
                                    <div className="col-span-3 flex content-center">
                                        <img
                                            src={item.images}
                                            alt=""
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div className="col-span-7">
                                        <div className="px-[10px]">
                                            <h2 className="font-medium text-[18px] ">
                                                {item.name}
                                            </h2>
                                            <p className="bg-[#6C8BA4] text-[white] font-semibold block w-fit rounded-lg my-[5px] p-1.5">
                                                {item.subject}
                                            </p>
                                            <p className="bg-[#A68E7C] text-[white] font-semibold block w-fit rounded-lg my-[5px] p-1.5">
                                                {item.university}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchasedPage;
