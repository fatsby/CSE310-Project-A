import { Checkbox, Input, Button } from "@mantine/core";
import { getItemsList } from "../data/SampleData.js";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function CartPage() {
    const [discount, setDiscount] = useState(0);

    const [checkedItems, setCheckedItems] = useState(
        getItemsList().map((item) => {
            return {
                ...item,
                selected: false,
            };
        })
    );

    // Caluculate bill
    const selectedItems = checkedItems.filter((item) => item.selected);

    const subtotal = selectedItems.reduce(
        (sum, item) => sum + Number(item.price.replace(/,/g, "")),
        0
    );

    const total = subtotal - discount;

    // Check all check boxes
    const isAllChecked = checkedItems.every((item) => item.selected === true);

    const handleCheckAll = (e) => {
        const checked = e.target.checked;
        setCheckedItems(
            checkedItems.map((item) => {
                return {
                    ...item,
                    selected: checked,
                };
            })
        );
    };

    const handleItemCheck = (index) => {
        const update = [...checkedItems];
        update[index].selected = !update[index].selected;
        setCheckedItems(update);
    };

    // Delete 1 item
    const handleDeleteItem = (id) => {
        setCheckedItems(checkedItems.filter((item) => item.id !== id));
    };

    // Delete selected items
    const handleDeleteSelected = () => {
        setCheckedItems(checkedItems.filter((item) => !item.selected));
    };

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
                                    color="red"
                                    size="md"
                                    radius="md"
                                    onClick={handleDeleteSelected}
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
                            {checkedItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-10 gap-4 py-[20px] border-b-2 border-[#dadada]"
                                >
                                    <div className="col-span-1 flex justify-center">
                                        <Checkbox
                                            className="content-center"
                                            checked={
                                                checkedItems[index].selected
                                            }
                                            onChange={() =>
                                                handleItemCheck(index)
                                            }
                                        ></Checkbox>
                                    </div>
                                    <div className="col-span-6">
                                        <div className="grid grid-cols-10">
                                            <div className="col-span-3 flex content-center">
                                                <img
                                                    src={item.images}
                                                    alt=""
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <div className="col-span-7">
                                                <div className="px-[10px]">
                                                    <h2 className="font-medium text-[20px] ">
                                                        {item.name}
                                                    </h2>
                                                    <p className="bg-[#547792] text-[#FAFAFA] font-semibold block w-fit rounded-lg my-[5px] p-1.5">
                                                        {item.subject}
                                                    </p>
                                                    <p className="bg-[#DDA853] text-[#FAFAFA] font-semibold block w-fit rounded-lg my-[5px] p-1.5">
                                                        {item.university}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex">
                                        <p className="font-bold text-blue-600 text-[22px] content-center">
                                            {item.price} VND
                                        </p>
                                    </div>
                                    <div className="col-span-1 content-center">
                                        <Button
                                            variant="filled"
                                            color="red"
                                            onClick={() =>
                                                handleDeleteItem(item.id)
                                            }
                                        >
                                            <Trash2 />
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
                                        {subtotal} VND
                                    </div>
                                </div>
                                <div className="grid grid-cols-10">
                                    <div className="col-span-5">Discount</div>
                                    <div className="col-span-5 text-right">
                                        - {discount} VND
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
                                    {total} VND
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
    );
}
export default CartPage;
