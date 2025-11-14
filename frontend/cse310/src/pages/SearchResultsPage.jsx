import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
    Container,
    Title,
    Text,
    Loader,
    SimpleGrid,
    Paper,
    Group,
    Badge,
    Pagination,
    Button,
    Select,
} from "@mantine/core";

// Lucide Imports
import { ArrowLeft, TrendingUp, Star, Zap } from "lucide-react";

// COMPONENT IMPORTS
import ItemCard from "../components/ItemCard";

function SearchResultsPage() {
    const [searchParams] = useSearchParams();

    const universityId = searchParams.get("universityId");
    const subjectId = searchParams.get("subjectId");
    const title = searchParams.get("title");
    const course = searchParams.get("subjectName");
    const university = searchParams.get("universityName");

    const [results, setResults] = useState([]);
    const [sortedResults, setSortedResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("relevant");

    const itemsPerPage = 12;

    const totalPages = Math.ceil(sortedResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedResults.slice(startIndex, endIndex);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchResults = async () => {
            const params = new URLSearchParams();

            if (universityId) params.append("universityId", universityId);
            if (subjectId) params.append("subjectId", subjectId);
            if (title) params.append("title", title);

            const res = await fetch(
                `${API_URL}/api/documents?${params.toString()}`
            );
            const json = await res.json();
            setResults(json);
            console.log(
                `https://localhost:7013/api/documents?${params.toString()}`
            );
            console.log(results);
        };

        fetchResults();
    }, [universityId, subjectId, title, API_URL]);

    const sortItems = (items, sortType) => {
        const sorted = [...items];

        switch (sortType) {
            case "bestSelling":
                sorted.sort((a, b) => b.purchaseCount - a.purchaseCount);
                break;
            case "rating":
                sorted.sort((a, b) => {
                    if (b.avgRating !== a.avgRating) {
                        return b.avgRating - a.avgRating;
                    }
                    return b.purchaseCount - a.purchaseCount;
                });
                break;
            case "price-high-to-low":
                sorted.sort((a, b) => b.price - a.price);
                break;
            case "price-low-to-high":
                sorted.sort((a, b) => a.price - b.price);
                break;
            case "relevant":
            default:
                break;
        }

        return sorted;
    };

    const handleSortChange = (newSortType) => {
        setSortBy(newSortType || "relevant");
        setCurrentPage(1);
    };

    useEffect(() => {
        setIsLoading(true);
        setSortBy("relevant");
        setCurrentPage(1);
        setIsLoading(false);
    }, [searchParams, universityId, subjectId]);

    useEffect(() => {
        const sorted = sortItems(results, sortBy);
        setSortedResults(sorted);
    }, [results, sortBy]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pb-4 pt-[125px]">
            <Link
                to="/"
                className="group inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
            >
                <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                Back
            </Link>

            <div className="w-fit mb-4">
                <p className="text-lg">
                    Showing results for course{" "}
                    <span className="font-semibold">{course}</span> at{" "}
                    <span className="font-semibold">{university}</span>
                    {title && (
                        <>
                            {" "}
                            with keyword "
                            <span className="font-semibold">{title}</span>"
                        </>
                    )}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    {results.length} {results.length === 1 ? "item" : "items"}{" "}
                    found
                    {totalPages > 1 &&
                        ` • Page ${currentPage} of ${totalPages}`}
                </p>
            </div>

            {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Text
                        size="lg"
                        c="dimmed"
                        className="text-center"
                    >
                        No items found matching your search criteria.
                    </Text>
                </div>
            ) : (
                <>
                    {/* Sort Controls */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">
                                Sort by:
                            </span>

                            <Group gap="xs">
                                <Button
                                    variant={
                                        sortBy === "relevant"
                                            ? "filled"
                                            : "light"
                                    }
                                    size="sm"
                                    leftSection={<Zap size={16} />}
                                    onClick={() => handleSortChange("relevant")}
                                    color="blue"
                                >
                                    Relevant
                                </Button>

                                <Button
                                    variant={
                                        sortBy === "bestSelling"
                                            ? "filled"
                                            : "light"
                                    }
                                    size="sm"
                                    leftSection={<TrendingUp size={16} />}
                                    onClick={() =>
                                        handleSortChange("bestSelling")
                                    }
                                    color="green"
                                >
                                    Best Selling
                                </Button>

                                <Button
                                    variant={
                                        sortBy === "rating" ? "filled" : "light"
                                    }
                                    size="sm"
                                    leftSection={<Star size={16} />}
                                    onClick={() => handleSortChange("rating")}
                                    color="yellow"
                                >
                                    Highest Rating
                                </Button>
                            </Group>

                            <Select
                                placeholder="Price"
                                value={sortBy.includes("price") ? sortBy : null}
                                onChange={handleSortChange}
                                data={[
                                    {
                                        value: "price-high-to-low",
                                        label: "Price: High to Low",
                                    },
                                    {
                                        value: "price-low-to-high",
                                        label: "Price: Low to High",
                                    },
                                ]}
                                size="sm"
                                w={180}
                                clearable
                                styles={{
                                    input: {
                                        backgroundColor: sortBy.includes(
                                            "price"
                                        )
                                            ? "#228be6"
                                            : "white",
                                        color: sortBy.includes("price")
                                            ? "white"
                                            : "black",
                                        fontWeight: sortBy.includes("price")
                                            ? 500
                                            : 400,
                                    },
                                }}
                            />
                        </div>

                        <div className="mt-2 text-xs text-gray-600">
                            <span>
                                Sorted by:{" "}
                                <strong>
                                    {sortBy === "relevant" && "Relevance"}
                                    {sortBy === "bestSelling" && "Best Selling"}
                                    {sortBy === "rating" && "Highest Rating"}
                                    {sortBy === "price-high-to-low" &&
                                        "Price: High to Low"}
                                    {sortBy === "price-low-to-high" &&
                                        "Price: Low to High"}
                                </strong>
                            </span>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <SimpleGrid
                        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
                        spacing="lg"
                        className="mb-8"
                    >
                        {currentItems.map((item) => (
                            <ItemCard
                                key={item.id}
                                itemData={item}
                            />
                        ))}
                    </SimpleGrid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                total={totalPages}
                                value={currentPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default SearchResultsPage;
