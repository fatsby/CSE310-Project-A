import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
    TextInput,
    NumberInput,
    Button,
    Image,
    Badge,
    Paper,
    Group,
    Divider,
    Tabs,
    Table,
    ActionIcon,
    Alert,
    Textarea,
    Text,
} from '@mantine/core'
import { modals } from '@mantine/modals'

import {
    ArrowLeft,
    Save,
    Plus,
    Trash2,
    MoveUp,
    MoveDown,
    FilePlus2,
    FileText,
    ImagePlus,
    ArrowBigDownDash,
    X,
} from 'lucide-react'

import { getToken } from '../../utils/auth'

export default function EditItemPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [courseData, setCourseData] = useState(null)

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    // Files and Images on server
    const [files, setFiles] = useState([])
    const [images, setImages] = useState([])

    // New Files and Images
    const [newFiles, setNewFiles] = useState([])
    const [newImages, setNewImages] = useState([])

    const API_URL = import.meta.env.VITE_API_BASE_URL

    useEffect(() => {
        fetchCourseData()
        fetchFileFromCourse()
        fetchImageFromCourse()
    }, [id])

    // Get Course data
    const fetchCourseData = async () => {
        try {
            const res = await fetch(`${API_URL}/api/documents/${id}`)

            if (!res.ok) {
                throw new Error(`Could not fetch data. Status: ${res.status}`)
            }

            const json = await res.json()
            setCourseData(json)

            setName(json.name)
            setDescription(json.description)
            setPrice(json.price)
        } catch (err) {
            console.error('Error fetching course:', err)
        }
    }

    // Get File data
    const fetchFileFromCourse = async () => {
        try {
            const res = await fetch(`${API_URL}/api/documents/${id}/files`)

            if (!res.ok) {
                throw new Error(
                    `Could not fetch file from course. Status: ${res.status}`
                )
            }

            const json = await res.json()
            setFiles(json)
        } catch (err) {
            console.log('Error fetching file from course', err)
        }
    }

    // Get Image data
    const fetchImageFromCourse = async () => {
        try {
            const res = await fetch(`${API_URL}/api/documents/${id}/images`)

            if (!res.ok) {
                throw new Error(
                    `Could not fetch image from course. Status: ${res.status}`
                )
            }

            const json = await res.json()
            setImages(json)
        } catch (err) {
            console.log('Error fetching image from course', err)
        }
    }

    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)

    const fileInputRef = useRef(null)
    const imageInputRef = useRef(null)

    // ---------- Thumbnails handlers ----------
    const removeImage = (idx) => {
        setImages((arr) => arr.filter((_, i) => i !== idx))
    }
    const moveImageUp = (idx) => {
        if (idx === 0) return
        setImages((arr) => {
            const cp = [...arr]
            ;[cp[idx - 1], cp[idx]] = [cp[idx], cp[idx - 1]]
            return cp
        })
    }
    const moveImageDown = (idx) => {
        setImages((arr) => {
            if (idx >= arr.length - 1) return arr
            const cp = [...arr]
            ;[cp[idx + 1], cp[idx]] = [cp[idx], cp[idx + 1]]
            return cp
        })
    }

    // Confirm to upload Files
    const openUploadFileConfirmModal = () => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: (
                <div>
                    <Text size="sm" mb="xs">
                        These following files will be added into your course!!
                    </Text>
                </div>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => executeUploadFiles(newFiles),
        })
    }

    // Confirm to upload Images
    const openUploadImageConfirmModal = () => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: (
                <div>
                    <Text size="sm" mb="xs">
                        These following images will be added into your course!!
                    </Text>
                </div>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => executeUploadImages(newImages),
        })
    }

    // Comfirm to Save basic information
    const openSaveConfirmModal = () => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: (
                <Text size="sm">Your course information will be changed!!</Text>
            ),
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => onSave(),
        })
    }

    // Comfirm to Remove file in course
    const openRemoveConfirmModal = (fileId) => {
        modals.openConfirmModal({
            title: 'Please confirm your action',
            centered: true,
            children: <Text size="sm">This file will be delete!!</Text>,
            labels: { confirm: 'Confirm', cancel: 'Cancel' },
            onConfirm: () => handleRemoveFile(fileId),
        })
    }
    // ============================================ BASIC INFORMTION ================================ //
    // Save Changes handle
    const onSave = async () => {
        setError(null)

        const trimmedName = name.trim()
        const trimmedDesc = description ? description.trim() : ''

        if (!trimmedName) return setError('Name is required.')
        if (trimmedName.length < 5)
            return setError('Name must be at least 5 characters.')

        if (Number.isNaN(price) || price < 0)
            return setError('Price must be a non-negative number.')

        if (!trimmedDesc) return setError('Description is required.')
        if (trimmedDesc && trimmedDesc.length < 10) {
            return setError('Description must be at least 10 characters.')
        }

        const payload = {
            name: trimmedName,
            price: Number(price),
            description: trimmedDesc === '' ? null : trimmedDesc,
        }

        setSaving(true)
        try {
            const response = await fetch(
                `${API_URL}/api/documents/${id}/edit`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(payload),
                }
            )

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.message || 'Fail to update detail')
            }

            setSaving(false)
            navigate(`/item/${id}`)
        } catch (err) {
            setSaving(false)
            setError(err.message || 'Failed to save changes.')
        }
    }

    // ================================ IMAGE SECTION ================================= //
    // Choose Image to add
    const onImageSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length === 0) return

        setNewImages((prevImages) => {
            const uniqueNewImages = selectedFiles.filter((newFile) => {
                // Check if this image is in newImages
                const isDuplicate = prevImages.some(
                    (existingImage) =>
                        existingImage.name === newFile.name &&
                        existingImage.size === newFile.size &&
                        existingImage.lastModified === newFile.lastModified
                )
                return !isDuplicate
            })
            return [...prevImages, ...uniqueNewImages]
        })

        e.target.value = null
    }

    // Delete Image in preview section
    const handleDeleteSelectedImage = (indexToRemove) => {
        setNewImages((prevImages) =>
            prevImages.filter((_, index) => index !== indexToRemove)
        )
    }

    // Upload Image to server
    const executeUploadImages = async (imagesToUpload) => {
        const uploadedFiles = []
        try {
            await Promise.all(
                imagesToUpload.map(async (file) => {
                    const formData = new FormData()
                    formData.append('file', file)

                    const res = await fetch(
                        `${API_URL}/api/documents/${id}/images/add`,
                        {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${getToken()}` },
                            body: formData,
                        }
                    )
                    if (!res.ok) throw new Error('Fail to upload')
                    const newFileDto = await res.json()
                    uploadedFiles.push(newFileDto)
                })
            )

            if (uploadedFiles.length > 0) {
                setImages((prevFiles) => [...prevFiles, ...uploadedFiles])
            }
            setNewImages([])
        } catch (err) {
            console.error(err)
            setError(err.message || 'Error uploading images')
        }
    }

    // Delete Image in course
    const handleRemoveImage = async (fileId) => {
        try {
            const res = await fetch(
                `${API_URL}/api/documents/${id}/images/${fileId}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )

            if (!res.ok) {
                throw new Error(`Remove failed: ${res.statusText}`)
            }

            const updateFiles = files.filter((f) => f.id !== fileId)
            setImages(updateFiles)
        } catch (err) {
            console.log(err)
        }
    }

    // ================================ FILE SECTION ================================ //
    // Download File
    const handleDownloadFile = async (fileId, fileName) => {
        try {
            const res = await fetch(
                `${API_URL}/api/documents/${id}/files/${fileId}/download`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )

            if (!res.ok) {
                throw new Error(`Download failed: ${res.statusText}`)
            }

            const blob = await res.blob()

            const url = window.URL.createObjectURL(blob)

            const a = document.createElement('a')
            a.href = url

            // Naming download file
            a.download = fileName
            document.body.appendChild(a)

            // Auto click download
            a.click()

            a.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Download error:', err)
            alert('Không thể tải file này.')
        }
    }

    // Remove File in Course
    const handleRemoveFile = async (fileId) => {
        try {
            const res = await fetch(
                `${API_URL}/api/documents/${id}/files/${fileId}/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )

            if (!res.ok) {
                throw new Error(`Remove failed: ${res.statusText}`)
            }

            const updateFiles = files.filter((f) => f.id !== fileId)
            setFiles(updateFiles)
        } catch (err) {
            console.log(err)
        }
    }

    // Upload added file to server
    const executeUploadFiles = async (filesToUpload) => {
        const uploadedFiles = []

        try {
            await Promise.all(
                filesToUpload.map(async (file) => {
                    const formData = new FormData()
                    formData.append('file', file)

                    const res = await fetch(
                        `${API_URL}/api/documents/${id}/files/add`,
                        {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${getToken()}`,
                            },
                            body: formData,
                        }
                    )

                    if (!res.ok) {
                        const errorText = await res.text()
                        throw new Error(errorText || 'Fail to upload')
                    }

                    const newFileDto = await res.json()
                    uploadedFiles.push(newFileDto)
                })
            )

            // Render added file
            if (uploadedFiles.length > 0) {
                setFiles((prevFiles) => [...prevFiles, ...uploadedFiles])
            }

            setNewFiles([])
        } catch (err) {
            console.error(err)
            setError(err.message || 'Error uploading files')
        }
    }

    // Choose file to add
    const onFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (selectedFiles.length === 0) return
        setNewFiles((prevFiles) => {
            const uniqueNewFiles = selectedFiles.filter((newFile) => {
                // Check if this file is in newFile
                const isDuplicate = prevFiles.some(
                    (existingFile) =>
                        existingFile.name === newFile.name &&
                        existingFile.size === newFile.size &&
                        existingFile.lastModified === newFile.lastModified
                )

                return !isDuplicate
            })

            return [...prevFiles, ...uniqueNewFiles]
        })

        e.target.value = null
    }

    // Delete Slected File in Preview Section
    const handleDeleteSelectedFile = (removeIndex) => {
        const newSelectedFile = newFiles.filter(
            (f, index) => index != removeIndex
        )
        setNewFiles(newSelectedFile)
    }

    if (!courseData) {
        return (
            <div className="container mx-auto px-4 pt-[125px]">
                <Alert color="red" title="Not Found">
                    Item with id {id} was not found.
                </Alert>
                <div className="mt-4">
                    <Button
                        leftSection={<ArrowLeft />}
                        variant="light"
                        component={Link}
                        to="/profile"
                    >
                        Back to Profile
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 pb-10 pt-[125px]">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Button
                    variant="light"
                    leftSection={<ArrowLeft />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
                <h1 className="text-3xl font-semibold">Edit Item</h1>
            </div>

            {/* Meta (original subject/university) */}
            <div className="mb-4 text-sm text-gray-600">
                <Badge color="indigo" className="mr-2">
                    {courseData.subjectName}
                </Badge>
                <Badge color="cyan">{courseData.universityName}</Badge>
            </div>

            {error && (
                <Alert color="red" className="mb-4">
                    {error}
                </Alert>
            )}

            <Paper withBorder radius="lg" p="md" className="bg-white">
                <Tabs
                    defaultValue="details"
                    color="indigo"
                    variant="pills"
                    radius="xl"
                >
                    <Tabs.List>
                        <Tabs.Tab
                            value="details"
                            leftSection={<FileText size={16} />}
                        >
                            Details
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="images"
                            leftSection={<ImagePlus size={16} />}
                        >
                            Thumbnails
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="files"
                            leftSection={<FilePlus2 size={16} />}
                        >
                            Files
                        </Tabs.Tab>
                    </Tabs.List>

                    {/* DETAILS */}
                    <Tabs.Panel value="details" pt="md">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-7 space-y-4">
                                <TextInput
                                    label="Name"
                                    placeholder="Enter name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.currentTarget.value)
                                    }
                                    radius="md"
                                />

                                <NumberInput
                                    label="Price (VND)"
                                    placeholder="0"
                                    allowNegative={false}
                                    min={0}
                                    thousandSeparator
                                    value={price}
                                    onChange={(val) =>
                                        setPrice(Number(val) || 0)
                                    }
                                    radius="md"
                                />

                                <Textarea
                                    label="Description"
                                    placeholder="(Optional) Short description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.currentTarget.value)
                                    }
                                    radius="md"
                                />
                            </div>

                            {/* Locked fields */}
                            <div className="lg:col-span-5 space-y-4">
                                <TextInput
                                    disabled
                                    label="University (locked)"
                                    placeholder="Locked"
                                    value={courseData.universityName || ''}
                                    radius="md"
                                    readOnly
                                />
                                <TextInput
                                    disabled
                                    label="Course (locked)"
                                    placeholder="Locked"
                                    value={courseData.subjectName || ''}
                                    radius="md"
                                    readOnly
                                />
                                <div className="text-xs text-gray-500">
                                    University & Course cannot be edited after
                                    an item is uploaded.
                                </div>
                            </div>
                        </div>

                        <Divider my="lg" />
                        <div className="flex gap-3">
                            <Button
                                onClick={openSaveConfirmModal}
                                loading={saving}
                                leftSection={<Save size={16} />}
                            >
                                Save changes
                            </Button>
                            <Button
                                variant="light"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Tabs.Panel>

                    {/* IMAGES */}
                    <Tabs.Panel value="images" pt="md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Paper withBorder radius="md" p="md">
                                <div className="font-semibold mb-2">
                                    Add image
                                </div>

                                <div className="pb-2.5 border-b-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={imageInputRef}
                                        style={{ display: 'none' }}
                                        onChange={onImageSelect}
                                        multiple
                                    />

                                    <div className="flex gap-7">
                                        <Button
                                            onClick={() =>
                                                imageInputRef.current.click()
                                            }
                                        >
                                            Choose Image
                                        </Button>

                                        {newImages.length > 0 && (
                                            <Button
                                                color="green"
                                                onClick={
                                                    openUploadImageConfirmModal
                                                }
                                            >
                                                Upload
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {newImages.length > 0 ? (
                                    <div className="mt-2.5">
                                        <span className="font-bold block mb-2">
                                            Selected Images:
                                        </span>

                                        <div className="space-y-2">
                                            {newImages.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between border rounded p-2 bg-gray-50"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <Image
                                                            src={URL.createObjectURL(
                                                                file
                                                            )}
                                                            w={60}
                                                            h={60}
                                                            radius="sm"
                                                            fit="cover"
                                                        />
                                                        <span
                                                            className="text-sm truncate max-w-[200px]"
                                                            title={file.name}
                                                        >
                                                            {file.name}
                                                        </span>
                                                    </div>

                                                    <div className="cursor-pointer hover:bg-gray-200 p-1 rounded">
                                                        <X
                                                            size={18}
                                                            color="red"
                                                            onClick={() =>
                                                                handleDeleteSelectedImage(
                                                                    index
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2.5 text-sm text-gray-500">
                                        Selected Images will be shown here
                                    </div>
                                )}
                            </Paper>

                            <Paper withBorder radius="md" p="md">
                                <div className="font-semibold mb-3">
                                    Preview
                                </div>
                                {images.length === 0 && (
                                    <div className="text-sm text-gray-500">
                                        No thumbnails yet.
                                    </div>
                                )}
                                {console.log(images)}
                                <div className="grid grid-cols-2 gap-3">
                                    {images.map((src, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-md p-2"
                                        >
                                            <div className="relative">
                                                <Image
                                                    src={src}
                                                    alt={`thumb-${idx}`}
                                                    radius="sm"
                                                />
                                                <div className="flex gap-1 mt-2">
                                                    <ActionIcon
                                                        variant="light"
                                                        onClick={() =>
                                                            moveImageUp(idx)
                                                        }
                                                        title="Move up"
                                                    >
                                                        <MoveUp size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        variant="light"
                                                        onClick={() =>
                                                            moveImageDown(idx)
                                                        }
                                                        title="Move down"
                                                    >
                                                        <MoveDown size={16} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        color="red"
                                                        variant="light"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                idx
                                                            )
                                                        }
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </ActionIcon>
                                                </div>
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1 break-all">
                                                {src}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Paper>
                        </div>

                        <Divider my="lg" />
                    </Tabs.Panel>

                    {/* FILES */}
                    <Tabs.Panel value="files" pt="md">
                        <Paper withBorder radius="md" p="md" className="mb-4">
                            <div className="font-semibold mb-2">Add file</div>
                            <div className="pb-2.5 border-b-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={onFileSelect}
                                    multiple
                                />

                                <div className="flex gap-7">
                                    <Button
                                        onClick={() =>
                                            fileInputRef.current.click()
                                        }
                                    >
                                        Choose File
                                    </Button>
                                    {newFiles.length > 0 && (
                                        <Button
                                            color="green"
                                            onClick={openUploadFileConfirmModal}
                                        >
                                            Upload
                                        </Button>
                                    )}
                                </div>
                            </div>
                            {newFiles.length > 0 ? (
                                <div className="mt-2.5">
                                    <span className="font-bold">
                                        Selected Files
                                    </span>

                                    {newFiles.map((f, index) => (
                                        <div
                                            className="flex-row flex border-b-2 py-1.5 px-3 w-[50%] justify-between items-center"
                                            key={index}
                                        >
                                            <span className="">{f.name}</span>

                                            <X
                                                size={20}
                                                color="red"
                                                className="cursor-pointer hover:bg-gray-200 p-1 rounded"
                                                onClick={() =>
                                                    handleDeleteSelectedFile(
                                                        index
                                                    )
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-2.5 text-sm text-gray-500">
                                    Selected Files will be shown here
                                </div>
                            )}
                        </Paper>

                        <Paper withBorder radius="md" p="md">
                            <div className="font-semibold mb-3">
                                Files for this item
                            </div>
                            {files.length === 0 ? (
                                <div className="text-sm text-gray-500">
                                    No files added yet.
                                </div>
                            ) : (
                                <Table
                                    striped
                                    withTableBorder
                                    withColumnBorders
                                    stickyHeader
                                    stickyHeaderOffset={0}
                                >
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th style={{ width: '80%' }}>
                                                File Name
                                            </Table.Th>
                                            <Table.Th style={{ width: '10%' }}>
                                                <div className="flex justify-center items-center">
                                                    Download
                                                </div>
                                            </Table.Th>
                                            <Table.Th style={{ width: '10%' }}>
                                                <div className="flex justify-center items-center">
                                                    Delete
                                                </div>
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {files.map((f) => (
                                            <Table.Tr key={f.id}>
                                                <Table.Td className="font-medium">
                                                    {f.fileName}
                                                </Table.Td>
                                                <Table.Td className="break-all">
                                                    <div className="flex justify-center items-center">
                                                        <ActionIcon
                                                            onClick={() =>
                                                                handleDownloadFile(
                                                                    f.id,
                                                                    f.fileName
                                                                )
                                                            }
                                                            className="text-blue-600 underline"
                                                        >
                                                            <ArrowBigDownDash
                                                                size={16}
                                                            />
                                                        </ActionIcon>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td>
                                                    <div className="flex justify-center items-center">
                                                        <ActionIcon
                                                            color="red"
                                                            variant="light"
                                                            onClick={() =>
                                                                openRemoveConfirmModal(
                                                                    f.id
                                                                )
                                                            }
                                                            title="Remove"
                                                        >
                                                            <Trash2 size={16} />
                                                        </ActionIcon>
                                                    </div>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            )}
                        </Paper>

                        <Divider my="lg" />
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </div>
    )
}
