import { Checkbox, Input, Button } from "@mantine/core";
import { getItemsList } from "../data/SampleData.js";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function CartPage() {
    const items = getItemsList();

    const [checkedItems, setCheckItems] = useState(items.map(() => false));

    // Check all check boxes
    const isAllChecked = checkedItems.every((item) => item === true);

    const handleCheckAll = (e) => {
        console.log(e);
        const checked = e.target.checked;
        console.log(checked);
        setCheckItems(items.map(() => checked));
    };

    const handleItemCheck = (index) => {
        const update = [...checkedItems];
        update[index] = !update[index];
        setCheckItems(update);
    };

    return (
        <>
            <div className="container mx-auto pt-[125px]">
                <div className="grid grid-cols-12 gap-4">
                    {/* Cart */}
                    <div className="col-span-9 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] rounded-xl">
                        <div className="grid grid-cols-10 ">
                            <h2 className="col-span-7 font-bold text-[40px] pl-[20px] pt-[20px]">
                                Your Cart ({items.length})
                            </h2>
                            <div className="col-span-3 justify-end flex pr-[20px] pt-[20px] items-center">
                                <Button
                                    variant="filled"
                                    color="red"
                                    size="md"
                                    radius="md"
                                >
                                    <Trash2 />
                                    &nbsp; selected item(s)
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
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-10 gap-4 py-[20px] border-b-2 border-[#dadada]"
                                >
                                    <div className="col-span-1 flex justify-center">
                                        <Checkbox
                                            className="content-center"
                                            checked={checkedItems[index]}
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
                                        <Button variant="filled" color="red">
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
                                        1,000,000 VND
                                    </div>
                                </div>
                                <div className="grid grid-cols-10">
                                    <div className="col-span-5">Discount</div>
                                    <div className="col-span-5 text-right">
                                        -0 VND
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
                                    1,000,000 VND
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
