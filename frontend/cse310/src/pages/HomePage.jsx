// MANTINE IMPORTS
import { Select, TextInput, Button } from '@mantine/core';

// LUCIDE ICONS
import { Search } from "lucide-react"

// COMPONENT IMPORTS
import ItemsRow from "../components/home_components/ItemsRow.jsx"


function HomePage() {

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
                        <Button variant="filled" fullWidth color="#000">Search</Button>
                    </div>
                </div>
            </div>


            {/* MAIN CONTENT */}
            <div>
                
            </div>
        </div>
    );
}

export default HomePage;