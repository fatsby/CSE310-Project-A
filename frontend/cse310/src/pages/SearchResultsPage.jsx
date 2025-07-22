import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Title, Text, Loader, SimpleGrid, Paper, Group, Badge } from '@mantine/core';
import { searchItems } from '../data/SampleData'; 

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
        return <Container className="pt-[150px] flex justify-center"><Loader /></Container>;
    }

    return (
        <Container size="lg" className="pt-[150px]">
            <Title order={2} mb="xs">Search Results</Title>
            <Text c="dimmed" mb="xl">
                Showing results for course <Text span fw={700} c="dark">{course}</Text> at <Text span fw={700} c="dark">{university}</Text>
                {query && <> with keyword "<Text span fw={700} c="dark">{query}</Text>"</>}
            </Text>

            {results.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                    {results.map(item => (
                        <ItemCard key={item.id} itemData={item} />
                    ))}
                </SimpleGrid>
            ) : (
                <Text>No results found matching your criteria.</Text>
            )}
        </Container>
    );
}

export default SearchResultsPage;