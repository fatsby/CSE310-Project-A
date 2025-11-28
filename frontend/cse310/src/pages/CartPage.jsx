import {
    Checkbox,
    Input,
    Button,
    Loader,
    Alert,
    Notification,
} from '@mantine/core'
import { Trash2, XIcon, CheckIcon, AlertCircle } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { getToken, refreshUserProfile, getUser } from '../../utils/auth'
import { fetchCoupon, fetchPurchase } from '../../utils/fetch'

function CartPage() {
    const [cartItems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [coupon, setCoupon] = useState('')
    const [couponData, setCouponData] = useState(null)
    const [discountAmount, setDiscountAmount] = useState(0)
    const [couponError, setCouponError] = useState(false)

    const API_URL = import.meta.env.VITE_API_BASE_URL

    // Fetch cart items on mount
    useEffect(() => {
        const fetchCartItems = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await fetch(`${API_URL}/api/cart`, {
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                })
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items.')
                }
                const data = await response.json()
                // Add 'selected' property for checkbox state
                setCartItems(
                    data.map((item) => ({ ...item, selected: true }))
                )
            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCartItems()
    }, [])

    // Memoized calculations for performance
    const selectedItems = useMemo(
        () => cartItems.filter((item) => item.selected),
        [cartItems]
    )

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + item.documentPrice,
        0
    )

    const total = useMemo(
        () => Math.max(0, subtotal - discountAmount),
        [subtotal, discountAmount]
    )

    const isAllChecked =
        cartItems.length > 0 && cartItems.every((item) => item.selected)

    const handleCheckAll = (e) => {
        const checked = e.target.checked
        setCartItems(
            cartItems.map((item) => ({ ...item, selected: checked }))
        )
    }

    const handleItemCheck = (index) => {
        const update = [...cartItems]
        update[index].selected = !update[index].selected
        setCartItems(update)
    }

    const deleteItemApiCall = async (documentId) => {
        const response = await fetch(`${API_URL}/api/cart/${documentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        })
        if (!response.ok) {
            throw new Error(`Failed to delete item ${documentId}`)
        }
    }

    const handleDeleteItem = (documentId) =>
        modals.openConfirmModal({
            title: 'Confirm deletion',
            centered: true,
            children: <p>Are you sure you want to delete this item?</p>,
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                try {
                    await deleteItemApiCall(documentId)
                    setCartItems((prev) =>
                        prev.filter((item) => item.documentId !== documentId)
                    )
                    notifications.show({
                        color: 'green',
                        title: 'Success',
                        message: 'Item removed from cart.',
                    })
                } catch (err) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'Failed to remove item.',
                    })
                }
            },
        })

    const handleDeleteSelected = () => {
        modals.openConfirmModal({
            title: 'Confirm deletion',
            centered: true,
            children: (
                <p>
                    Are you sure you want to delete all selected items? This
                    action cannot be undone.
                </p>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: async () => {
                const itemsToDelete = selectedItems.map(
                    (item) => item.documentId
                )
                try {
                    await Promise.all(itemsToDelete.map(deleteItemApiCall))
                    setCartItems((prev) =>
                        prev.filter((item) => !itemsToDelete.includes(item.documentId))
                    )
                    notifications.show({
                        color: 'green',
                        title: 'Success',
                        message: 'Selected items removed.',
                    })
                } catch (err) {
                    notifications.show({
                        color: 'red',
                        title: 'Error',
                        message: 'Some items could not be removed.',
                    })
                }
            },
        })
    }

    const handleFetchCoupon = async () => {
        setCouponError(false)
        if (!coupon.trim()) {
            setCouponError(true)
            return
        }
        const data = await fetchCoupon(coupon)
        if (data) {
            setCouponData(data)
            const offPrice = Math.floor(
                (subtotal * data.discountPercentage) / 100
            )
            setDiscountAmount(offPrice)
        } else {
            setCouponData(null)
            setDiscountAmount(0)
            setCouponError(true)
        }
    }

    const handleCouponChange = (event) => {
        const value = event.currentTarget.value
        setCoupon(value)
        if (discountAmount > 0 || couponData || couponError) {
            setDiscountAmount(0)
            setCouponData(null)
            setCouponError(false)
        }
    }

    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            notifications.show({
                color: 'yellow',
                title: 'Empty Selection',
                message: 'Please select items to purchase.',
            })
            return
        }

        const notifId = notifications.show({
            loading: true,
            title: 'Processing...',
            message: 'Please wait while we process your transaction.',
            autoClose: false,
            withCloseButton: false,
        })

        try {
            await fetchPurchase({
                documentIds: selectedItems.map((item) => item.documentId),
                couponCode: couponData ? coupon : null,
            })

            notifications.update({
                id: notifId,
                color: 'teal',
                title: 'Purchase Successful!',
                message: 'You can now access your new documents.',
                icon: <CheckIcon size="1rem" />,
                autoClose: 3000,
            })

            // Refresh cart and user balance
            const currentUser = getUser()
            if (currentUser) {
                await refreshUserProfile(currentUser.id)
            }
            // Refetch cart items
            const response = await fetch(`${API_URL}/api/cart`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            })
            const data = await response.json()
            setCartItems(data.map((item) => ({ ...item, selected: true })))
        } catch (error) {
            console.error(error)
            notifications.update({
                id: notifId,
                color: 'red',
                title: 'Transaction Failed',
                message:
                    error.message || 'Something went wrong during checkout.',
                icon: <XIcon size="1rem" />,
                autoClose: 4000,
            })
        }
    }

    return (
        <>
            <div className="container mx-auto pt-[125px]">
                {isLoading && (
                    <div className="flex justify-center items-center h-96">
                        <Loader />
                    </div>
                )}
                {error && (
                    <Alert
                        icon={<AlertCircle size="1rem" />}
                        title="Error"
                        color="red"
                    >
                        {error}
                    </Alert>
                )}
                {!isLoading && !error && (
                <div className="grid grid-cols-12 gap-4">
                    {/* Cart */}
                    <div className="col-span-9 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] rounded-xl">
                        <div className="grid grid-cols-10 ">
                            <h2 className="col-span-7 font-bold text-[40px] pl-[20px] pt-[20px]">
                                Your Cart ({cartItems.length})
                            </h2>
                            <div className="col-span-3 justify-end flex pr-[20px] pt-[20px] items-center">
                                <Button
                                    variant="filled"
                                    color="#E32929"
                                    size="md"
                                    radius="md"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedItems.length === 0}
                                >
                                    <Trash2 />
                                    &nbsp; {selectedItems.length} selected
                                    item(s)
                                </Button>
                            </div>
                        </div>
                        <div className="mt-10 ">
                            <div className="grid grid-cols-10 gap-4 border-b-2">
                                <div className="col-span-1 flex justify-center">
                                    <Checkbox
                                        className="content-center"
                                        checked={isAllChecked}
                                        onChange={handleCheckAll}
                                    ></Checkbox>
                                </div>
                                <div className="col-span-6 font-medium text-[30px] text-[black]">
                                    Product
                                </div>
                                <div className="col-span-2 font-medium text-[30px] text-[black]">
                                    Price
                                </div>
                            </div>

                            {/* Products */}
                            {/* Products Loop */}
                            {cartItems.map((item, index) => (
                                <div
                                    key={item.documentId}
                                    className="grid grid-cols-10 gap-4 py-[20px] border-b border-gray-100 items-center hover:bg-gray-50/50 transition-colors rounded-lg px-2"
                                >
                                    {/* Checkbox Column */}
                                    <div className="col-span-1 flex justify-center">
                                        <Checkbox
                                            size="md"
                                            checked={
                                                cartItems[index].selected
                                            }
                                            onChange={() =>
                                                handleItemCheck(index)
                                            }
                                        />
                                    </div>

                                    {/* Product Info Column (ĐÃ DESIGN LẠI) */}
                                    <Link
                                        to={`/item/${item.documentId}`}
                                        className="col-span-6 group"
                                    >
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-32 h-24 flex-shrink-0">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-100"
                                                />
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex flex-col justify-center">
                                                {/* University */}
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                    {item.universityName}
                                                </span>

                                                {/* Name */}
                                                <h2 className="text-[17px] font-bold text-slate-800 leading-tight line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                                                    {item.documentName}
                                                </h2>

                                                {/* Subject Badge */}
                                                <div>
                                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        {item.subjectName}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Price Column */}
                                    <div className="col-span-2">
                                        <p className="font-bold text-blue-600 text-[18px]">
                                            {item.documentPrice.toLocaleString()}{' '}
                                            VND
                                        </p>
                                    </div>

                                    {/* Delete Button Column */}
                                    <div className="col-span-1 flex justify-center">
                                        <Button
                                            variant="subtle"
                                            color="red"
                                            onClick={() =>
                                                handleDeleteItem(
                                                    item.documentId
                                                )
                                            }
                                            className="hover:bg-red-50"
                                        >
                                            <Trash2 size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment */}
                    <div className="col-span-3 ">
                        <div className="shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] p-[15px] rounded-xl">
                            <h3 className="font-semibold text-[20px]">
                                Payment Summary
                            </h3>
                            <div className="py-[15px]">
                                <div className="grid grid-cols-10">
                                    <div className="col-span-5">Subtotal</div>
                                    <div className="col-span-5 text-right">
                                        {Number(subtotal).toLocaleString()} VND
                                    </div>
                                </div>
                                <div className="grid grid-cols-10">
                                    <div className="col-span-5">Discount</div>
                                    <div className="col-span-5 text-right text-green-600 font-medium">
                                        -{' '}
                                        {Number(
                                            discountAmount
                                        ).toLocaleString()}{' '}
                                        VND
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-10 gap-1">
                                <div className="col-span-7">
                                    <Input
                                        radius="md"
                                        placeholder="Enter your coupon"
                                        value={coupon}
                                        onChange={handleCouponChange}
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Button
                                        variant="outline"
                                        radius="md"
                                        fullWidth
                                        onClick={handleFetchCoupon}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                            {couponError && (
                                <div className="col-span-10 mt-2">
                                    <Notification
                                        icon={<XIcon size="1.1rem" />}
                                        color="red"
                                        title="Invalid Coupon"
                                        onClose={() => setCouponError(false)}
                                    >
                                        Coupon is expired or does not exist.
                                    </Notification>
                                </div>
                            )}

                            <hr className="my-[15px]" />
                            <div className="grid grid-cols-10 mb-[15px]">
                                <div className="col-span-3 font-medium text-[18px]">
                                    Total
                                </div>
                                <div className="col-span-7 text-right font-medium text-[18px]">
                                    {Number(total).toLocaleString()} VND
                                </div>
                            </div>

                            <Button
                                variant="filled"
                                radius="md"
                                fullWidth
                                onClick={handleCheckout}
                                disabled={selectedItems.length === 0}
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </>
    )
}
export default CartPage
