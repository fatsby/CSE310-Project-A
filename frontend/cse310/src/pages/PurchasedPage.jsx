import { TextInput, Select, Button } from '@mantine/core'
import { ArrowDownAZ, ArrowUpAZ, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchUserPurchase } from '../../utils/fetch.js'

function PurchasedPage() {
    const [allCourses, setAllCourses] = useState([])
    const [filteredCourses, setfilteredCourses] = useState([])

    const [selectedUni, setSelectedUni] = useState(null)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [isAsc, setIsAsc] = useState(true)
    const [searchValue, setSearchValue] = useState('')
    const [universityList, setUniversityList] = useState([])
    const [courseList, setCourseList] = useState([])

    console.log(courseList)
    console.log(universityList)

    useEffect(() => {
        const getPurchasedCourses = async () => {
            const data = await fetchUserPurchase()

            if (Array.isArray(data)) {
                setAllCourses(data)
            } else {
                setAllCourses([])
            }
        }
        getPurchasedCourses()
    }, [])

    useEffect(() => {
        setAllCourses(allCourses)
        setfilteredCourses(allCourses)

        setUniversityList([
            ...new Set(allCourses.map((item) => item.universityName)),
        ])
        setCourseList([...new Set(allCourses.map((item) => item.subjectName))])
    }, [allCourses])

    // Filter
    const filterItems = (uni, subject, searchValue) => {
        var result = allCourses
        if (uni) {
            result = result.filter((item) => item.universityName === uni)
        }

        if (subject) {
            result = result.filter((item) => item.subjectName === subject)
        }

        if (searchValue) {
            result = result.filter((item) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
            )
        }
        setfilteredCourses(result)
    }

    // Filter by University
    const handleUniChange = (value) => {
        setSelectedUni(value)
        setSelectedSubject(null)
        setCourseList([
            ...new Set(
                allCourses
                    .filter((item) => item.universityName == value)
                    .map((item) => item.subjectName)
            ),
        ])
        filterItems(value, selectedSubject, searchValue)
    }

    // Filter by Subject
    const handleSubjectChange = (value) => {
        setSelectedSubject(value)
        filterItems(selectedUni, value, searchValue)
    }

    // Sort by Alphabet
    const sortAlphabet = () => {
        const sortAZ = [...filteredCourses]

        if (isAsc) {
            sortAZ.sort((a, b) => a.name.localeCompare(b.name))
        } else {
            sortAZ.sort((a, b) => b.name.localeCompare(a.name))
        }

        setfilteredCourses(sortAZ)
        setIsAsc((prev) => !prev)
    }

    // Search
    const handleSearchInput = (e) => {
        const value = e.target.value
        setSearchValue(value)
        filterItems(selectedUni, selectedSubject, value)
    }

    return (
        <>
            {console.log(allCourses)}
            <div className="bg-[#ffffff]">
                <div className="container mx-auto pt-[125px]">
                    <h2 className="col-span-7 font-bold text-[40px] pl-[20px] pt-[20px] ">
                        Your Purchased Courses ({allCourses.length})
                    </h2>
                    <p className="font-bold text-[20px] pl-[20px] pt-[20px] text-blue-700">
                        Showing {filteredCourses.length} item(s)
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
                        {filteredCourses.map((item) => (
                            <div key={item.id} className="col-span-1">
                                <Link
                                    to={`/data/${item.id}`}
                                    className="group grid grid-cols-10 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] rounded-xl p-[5px] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:bg-blue-50 border border-transparent hover:border-blue-200       "
                                >
                                    <div className="col-span-3 flex content-center">
                                        <img
                                            src={item.images?.[0]}
                                            alt=""
                                            className="rounded-xl w-full h-[100px] object-cover"
                                        />
                                    </div>
                                    <div className="col-span-7 flex flex-col justify-center pl-4 pr-2">
                                        <div className="col-span-7 flex flex-col justify-center pl-4 pr-2">
                                            <div className="mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    {item.universityName}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-slate-800 text-[17px] leading-tight line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                                                {item.name}
                                            </h3>

                                            <div>
                                                <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50  transition-colors duration-300">
                                                    {item.subjectName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PurchasedPage
