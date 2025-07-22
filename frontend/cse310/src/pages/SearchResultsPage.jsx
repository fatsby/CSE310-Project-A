import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Title, Text, Loader, SimpleGrid, Paper, Group, Badge } from '@mantine/core';
import { searchItems } from '../data/SampleData'; 
import { Link } from 'react-router-dom';

// Lucide Imports
import { ArrowLeft} from 'lucide-react';

// COMPONENT IMPORTS
import ItemCard from '../components/ItemCard';


function SearchResultsPage() {
    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const university = searchParams.get('university');
    const course = searchParams.get('course');
    const query = searchParams.get('q');

    useEffect(() => {
        setIsLoading(true);
        const foundItems = searchItems({ university, course, query });
        setResults(foundItems);
        setIsLoading(false);
    }, [searchParams, university, course, query]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 pb-4 pt-[125px]'>
            <Link to="/home" className="flex gap-1 mb-3 text-2xl"> <ArrowLeft/> Back </Link>
            <div className="w-fit"> 
                <p className="text-lg">
                    Showing results for course <span className="font-semibold">{course}</span> at <span className="font-semibold">{university}</span>
                    {query && <> with keyword "<span className="font-semibold">{query}</span>"</>}
                </p>
            </div>
        </div>
    );
}

export default SearchResultsPage;