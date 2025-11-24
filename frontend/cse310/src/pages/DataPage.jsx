import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Loader, Alert } from '@mantine/core'
import { ArrowDownToLine, AlertCircle } from 'lucide-react'
import { getToken } from '../../utils/auth' // Ensure you have this
import TreePdfBrowser from '../components/TreePdfBrowser'

function DataPage() {
    const { id } = useParams()
    const [documentData, setDocumentData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const API_URL = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        const fetchDocument = async () => {
            setIsLoading(true)
            try {
                // Fetch document details
                const res = await fetch(`${API_URL}/api/documents/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}` 
                    }
                })

                if (!res.ok) {
                    throw new Error(`Error: ${res.statusText}`)
                }

                const data = await res.json()
                setDocumentData(data)
            } catch (err) {
                console.error("Failed to fetch document", err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchDocument()
    }, [id])

    const handleDownloadAll = () => {
        alert("Batch download feature coming soon.")
    }

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader size="xl"/></div>
    if (error) return <div className="container mx-auto pt-[150px]"><Alert icon={<AlertCircle/>} color="red">{error}</Alert></div>
    if (!documentData) return null

    return (
        <div className="container mx-auto pt-[125px] pb-10">
            {/* Header Section */}
            <div className="py-[20px] mt-[40px] border-y border-solid flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="col-span-7 pl-[20px]">
                    <h1 className="font-medium text-[36px] leading-tight">
                        {documentData.name}
                    </h1>
                    <p className="text-gray-500 text-lg">
                        {documentData.universityName} • {documentData.subjectName}
                    </p>
                </div>
                
                {/* Optional: Bulk Action */}
                {/* <div className="ml-auto flex items-center pr-[20px]">
                    <Button
                        variant="filled"
                        color="#2986E3"
                        radius="md"
                        size="lg"
                        leftSection={<ArrowDownToLine size={20} />}
                        onClick={handleDownloadAll}
                    >
                        Download All
                    </Button>
                </div> */}
            </div>

            {/* Browser Component */}
            <div className="mt-6">
                <TreePdfBrowser document={documentData} />
            </div>
        </div>
    )
}

export default DataPage