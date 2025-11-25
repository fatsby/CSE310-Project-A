import { Link } from 'react-router-dom'
import { Button } from '@mantine/core'
import { Pencil, TriangleAlert } from 'lucide-react'

export default function UploadedItemCard({ item, onEdit, onDelete }) {
    if (!item) return null

    return (
        <div className="border p-4 mb-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-2">
                {/* Container for item details on the left */}
                <div className="flex items-center space-x-1">
                    <Link to={`/item/${item.id}`}>
                        <h3 className="text-lg font-semibold hover:underline">
                            {item.name}
                        </h3>
                    </Link>
                    <p className="bg-blue-700 text-white font-semibold rounded-lg p-1.5 text-sm">
                        {item.subject}
                    </p>
                    <p className="bg-rose-600 text-white font-semibold rounded-lg p-1.5 text-sm">
                        {item.university}
                    </p>
                </div>

                {/* Container for buttons on the right */}
                <div className="flex space-x-2">
                    <Link to={`/item/${item.id}/edit`}>
                        <Button
                            variant="light"
                            radius="md"
                            rightSection={<Pencil size="16" />}
                        >
                            Edit
                        </Button>
                    </Link>
                    <Button
                        variant="filled"
                        radius="md"
                        color="#c10007"
                        rightSection={
                            <TriangleAlert size="16" color="yellow" />
                        }
                    >
                        Delete
                    </Button>
                </div>
            </div>
            <p className="text-gray-600">Price: ${item.price}</p>
        </div>
    )
}
