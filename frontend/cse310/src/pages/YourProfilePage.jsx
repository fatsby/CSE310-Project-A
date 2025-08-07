import useUserStore from "../stores/userStore";
import { Tabs, LoadingOverlay } from "@mantine/core";
import { BanknoteArrowDown, BanknoteArrowUp, BookCheck } from "lucide-react";
import { getItemById } from "../data/SampleData";
import { useState, useEffect } from "react";

export default function YourProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const userName = useUserStore((state) => state.getUserName());
  const profilePicture = useUserStore((state) => state.getProfilePicture());

  const userTotalPurchases = userData.purchasedItems.length;

  const uploadedItems = (uploadedItemIDs) => {
    return uploadedItemIDs.map(itemID => getItemById(itemID));
  };

  useEffect(() => {
    if (userData?.uploadedItems && Array.isArray(userData.uploadedItems)) {
      setIsLoading(false);
    }
  }, [userData]);

  const itemsArray = uploadedItems(userData.uploadedItems);

  function UploadedItemCard(item) {
    return (
      <div className="container mx-auto px-4 pb-4 pt-[125px]" style={{ position: "relative" }}>
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ size: "lg", color: "indigo", variant: "bars" }}
        overlayOpacity={0.3}
        overlayColor="#c5c5c5"
        zIndex={1000}
      />
        <h3 className="text-lg font-semibold">Uploaded Item</h3>
        <p className="text-2xl font-bold">Item Name</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-4 pt-[125px]">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 bg-[#fff] shadow-md rounded-2xl p-6">
          <div className="justify-items-center">
            <img
              src={profilePicture || avatarIMG}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <div>
              <h2 className="text-xl font-semibold">{userName}</h2>
              <p className="text-center text-gray-600">{userData?.email}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 bg-[#fff] shadow-md rounded-2xl p-6">
          {/* STATS BLOCKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowDown color="green" /> Money Earned</h3>
              <p className="text-2xl font-bold">{userData.moneyearned}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowUp color="red" /> Money Spent</h3>
              <p className="text-2xl font-bold">{userData.moneyspent}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BookCheck color="orange" /> Total Purchases</h3>
              <p className="text-2xl font-bold">{userTotalPurchases}</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 bg-[#fff] shadow-md rounded-2xl p-6 min-h-[500px]">
        <Tabs color="indigo" variant="pills" radius="xl" defaultValue="uploaded">
          <Tabs.List>
            <Tabs.Tab value="uploaded">
              Uploaded Items
            </Tabs.Tab>
            <Tabs.Tab value="messages">
              Messages
            </Tabs.Tab>
            <Tabs.Tab value="settings">
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel className="p-6" value="uploaded">
            {itemsArray.map((item) => (
              <UploadedItemCard key={item.id} item={item} />
            ))};
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}