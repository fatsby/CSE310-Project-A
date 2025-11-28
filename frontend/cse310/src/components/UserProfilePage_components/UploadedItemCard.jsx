import { Link } from 'react-router-dom'
import { Button, Text, Badge, Tooltip, ActionIcon } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { Pencil, Power, Ban, CheckCircle2, Eye } from 'lucide-react'
import { fetchChangeCourseActiveStatus } from '../../../utils/fetch'
import { useState } from 'react'

export default function UploadedItemCard({ item }) {
    const [isActive, setIsActive] = useState(item.isActive)

    if (!item) return null

    const handleToggleStatus = () => {
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
        <div
            className={`group flex flex-col sm:flex-row bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md mb-4 ${
                !isActive ? 'opacity-75 bg-gray-50' : ''
            }`}
        >
            {/* --- LEFT: CLICKABLE CONTENT AREA --- */}
            <Link
                to={`/data/${item.id}`}
                className="flex-1 grid grid-cols-10 gap-4 p-3 text-inherit no-underline hover:bg-blue-50/30 transition-colors relative"
            >
                {/* Image Section */}
                <div className="col-span-3 sm:col-span-2 overflow-hidden rounded-lg relative">
                    <img
                        src={
                            item.images?.[0] ||
                            'https://placehold.co/400?text=No+Image'
                        }
                        alt={item.name}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            !isActive ? 'grayscale' : ''
                        }`}
                    />
                    <div className="absolute top-1 left-1">
                        <Badge
                            color={isActive ? 'green' : 'red'}
                            variant="filled"
                            size="xs"
                        >
                            {isActive ? 'Active' : 'Disabled'}
                        </Badge>
                    </div>
                </div>

                {/* Info Section */}
                <div className="col-span-7 sm:col-span-8 flex flex-col justify-between py-1 pr-2">
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                {item.universityName}
                            </span>
                        </div>
                        <h3 className="line-clamp-2 mb-2 text-[16px] font-bold leading-tight text-slate-800 group-hover:text-blue-700 transition-colors">
                            {item.name}
                        </h3>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                        <span className="inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                            {item.subjectName}
                        </span>

                        <div className="text-right">
                            {item.price === 0 ? (
                                <span className="font-bold text-green-600 text-sm">
                                    Free
                                </span>
                            ) : (
                                <span className="font-bold text-blue-600 text-[15px]">
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(item.price)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* --- RIGHT: ACTION BUTTONS AREA --- */}
            <div className="flex sm:flex-col items-center justify-center gap-2 p-3 border-t sm:border-t-0 sm:border-l border-gray-100 bg-gray-50 min-w-[120px]">
                <Link to={`/item/${item.id}/edit`} className="w-full">
                    <Button
                        fullWidth
                        variant="white"
                        color="blue"
                        className="border border-gray-200 hover:bg-blue-50"
                        leftSection={<Pencil size={14} />}
                        size="xs"
                    >
                        Edit
                    </Button>
                </Link>

                <Button
                    fullWidth
                    variant={isActive ? 'light' : 'filled'}
                    color={isActive ? 'red' : 'green'}
                    onClick={handleToggleStatus}
                    leftSection={
                        isActive ? <Ban size={14} /> : <Power size={14} />
                    }
                    size="xs"
                    className="transition-all"
                >
                    {isActive ? 'Disable' : 'Activate'}
                </Button>
            </div>
        </div>
    )
}
