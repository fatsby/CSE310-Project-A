import { Checkbox, Input, Button } from '@mantine/core'
import { getItemsList } from '../data/SampleData.js'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { modals } from '@mantine/modals'

function CartPage() {
    const [discount, setDiscount] = useState(0)

    const [checkedItems, setCheckedItems] = useState(
        getItemsList().map((item) => {
            return {
                ...item,
                selected: false,
            }
        })
    )

    // Caluculate bill
    const selectedItems = checkedItems.filter((item) => item.selected)

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + Number(item.price.replace(/,/g, '')),
        0
    )

    const total = subtotal - discount

    // Check all check boxes
    const isAllChecked = checkedItems.every((item) => item.selected === true)

    const handleCheckAll = (e) => {
        const checked = e.target.checked
        setCheckedItems(
            checkedItems.map((item) => {
                return {
                    ...item,
                    selected: checked,
                }
            })
        )
    }

    const handleItemCheck = (index) => {
        const update = [...checkedItems]
        update[index].selected = !update[index].selected
        setCheckedItems(update)
    }

    // Delete 1 item
    const handleDeleteItem = (id) =>
        modals.openConfirmModal({
            title: 'Confirm deletion',
            centered: true,
            children: (
                <p>
                    Are you sure you want to delete ? This action cannot be
                    undone.
                </p>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                setCheckedItems(checkedItems.filter((item) => item.id !== id))
            },
        })

    // Delete selected items
    const handleDeleteSelected = () => {
        modals.openConfirmModal({
            title: 'Confirm deletion',
            centered: true,
            children: (
                <p>
                    Are you sure you want to delete ? This action cannot be
                    undone.
                </p>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                setCheckedItems(checkedItems.filter((item) => !item.selected))
            },
        })
    }

    return (
        <>
            <div className="container mx-auto pt-[125px]">
                <div className="grid grid-cols-12 gap-4">
                    {/* Cart */}
                    <div className="col-span-9 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] rounded-xl">
                        <div className="grid grid-cols-10 ">
                            <h2 className="col-span-7 font-bold text-[40px] pl-[20px] pt-[20px]">
                                Your Cart ({checkedItems.length})
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
                            {checkedItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-10 gap-4 py-[20px] border-b border-gray-100 items-center hover:bg-gray-50/50 transition-colors rounded-lg px-2"
                                >
                                    {/* Checkbox Column */}
                                    <div className="col-span-1 flex justify-center">
                                        <Checkbox
                                            size="md"
                                            checked={
                                                checkedItems[index].selected
                                            }
                                            onChange={() =>
                                                handleItemCheck(index)
                                            }
                                        />
                                    </div>

                                    {/* Product Info Column (ĐÃ DESIGN LẠI) */}
                                    <Link
                                        to={`/item/${item.id}`}
                                        className="col-span-6 group"
                                    >
                                        <div className="flex gap-4">
                                            {/* Image */}
                                            <div className="w-32 h-24 flex-shrink-0">
                                                <img
                                                    src={item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-100"
                                                />
                                            </div>

                                            {/* Text Content */}
                                            <div className="flex flex-col justify-center">
                                                {/* University */}
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                    {item.university}
                                                </span>

                                                {/* Name */}
                                                <h2 className="text-[17px] font-bold text-slate-800 leading-tight line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
                                                    {item.name}
                                                </h2>

                                                {/* Subject Badge */}
                                                <div>
                                                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        {item.subject}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Price Column */}
                                    <div className="col-span-2">
                                        <p className="font-bold text-blue-600 text-[18px]">
                                            {Number(
                                                item.price.replace(/,/g, '')
                                            ).toLocaleString()}{' '}
                                            VND
                                        </p>
                                    </div>

                                    {/* Delete Button Column */}
                                    <div className="col-span-1 flex justify-center">
                                        <Button
                                            variant="subtle"
                                            color="red"
                                            onClick={() =>
                                                handleDeleteItem(item.id)
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
                                    <div className="col-span-5 text-right">
                                        - {Number(discount).toLocaleString()}{' '}
                                        VND
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-10 gap-1">
                                <div className="col-span-7">
                                    <Input
                                        radius="md"
                                        placeholder="Discount code"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Button
                                        variant="outline"
                                        radius="md"
                                        fullWidth
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                            <hr className="my-[15px]" />
                            <div className="grid grid-cols-10 mb-[15px]">
                                <div className="col-span-3 font-medium text-[18px]">
                                    Total
                                </div>
                                <div className="col-span-7 text-right font-medium text-[18px]">
                                    {Number(total).toLocaleString()} VND
                                </div>
                            </div>

                            <Button variant="filled" radius="md" fullWidth>
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CartPage
