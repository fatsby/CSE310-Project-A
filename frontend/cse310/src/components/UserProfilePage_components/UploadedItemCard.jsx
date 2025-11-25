import { Link } from 'react-router-dom'
import { Button, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { Pencil, Power, Ban, CheckCircle2 } from 'lucide-react'
import { fetchChangeCourseActiveStatus } from '../../../utils/fetch'
import { useState } from 'react'

export default function UploadedItemCard({ item, onEdit, onDelete }) {
    const [isActive, setIsActive] = useState(item.isActive)

    if (!item) return null

    const handleToggleStatus = () => {
        // Xác định hành động tiếp theo dựa trên trạng thái hiện tại
        const nextStatus = !isActive
        const actionLabel = isActive ? 'Disable' : 'Activate'
        const actionColor = isActive ? 'red' : 'teal'

        modals.openConfirmModal({
            title: `${actionLabel} Course`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to{' '}
                    <strong>{actionLabel.toLowerCase()}</strong> this course?
                    <br />
                    <span className="text-gray-500 text-xs mt-1 block">
                        {isActive
                            ? '(Users will no longer be able to purchase this item)'
                            : '(Users will be able to see and purchase this item again)'}
                    </span>
                </Text>
            ),
            labels: { confirm: actionLabel, cancel: 'Cancel' },
            confirmProps: { color: actionColor },
            onConfirm: async () => {
                const id = notifications.show({
                    loading: true,
                    title: 'Updating status...',
                    message: 'Please wait.',
                    autoClose: false,
                    withCloseButton: false,
                })

                const success = await fetchChangeCourseActiveStatus(
                    item.id,
                    nextStatus
                )

                if (success) {
                    setIsActive(nextStatus)

                    notifications.update({
                        id,
                        color: 'green',
                        title: 'Success',
                        message: `Course has been ${
                            isActive ? 'disabled' : 'activated'
                        } successfully!`,
                        icon: <CheckCircle2 size="1rem" />,
                        loading: false,
                        autoClose: 3000,
                    })
                } else {
                    notifications.update({
                        id,
                        color: 'red',
                        title: 'Error',
                        message: 'Failed to update status. Please try again.',
                        icon: <Ban size="1rem" />,
                        loading: false,
                        autoClose: 3000,
                    })
                }
            },
        })
    }

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
                        {item.subjectName}
                    </p>
                    <p className="bg-rose-600 text-white font-semibold rounded-lg p-1.5 text-sm">
                        {item.universityName}
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
                        color={isActive ? '#c10007' : '#41c720'}
                        onClick={handleToggleStatus}
                        rightSection={
                            isActive ? <Ban size="16" /> : <Power size="16" />
                        }
                    >
                        {isActive ? 'Disable' : 'Activate'}
                    </Button>
                </div>
            </div>
            <p className="text-gray-600">Price: ${item.price}</p>
        </div>
    )
}
