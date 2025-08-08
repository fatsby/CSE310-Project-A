import useUserStore from "../stores/userStore";
import { Tabs, Loader, LoadingOverlay } from "@mantine/core";
import { CloudUpload, BanknoteArrowDown, BanknoteArrowUp, BookCheck, TriangleAlert, Pencil, History } from "lucide-react";
import { getItemById, getCurrentUser } from "../data/SampleData";
import { useState, useEffect } from "react";
import UploadedItemCard from "../components/UserProfilePage_components/UploadedItemCard";
// import avatarIMG from '../path/to/default/avatar.png';

export default function YourProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const profilePicture = useUserStore((state) => state.getProfilePicture());
  const loadUser = useUserStore((state) => state.loadUser);

  // State for data that should be fetched from a server
  const [sensitiveUserData, setSensitiveUserData] = useState(null);

  // Non-sensitive data loading effect
  useEffect(() => {
    if (!userData) {
      loadUser();
    }
  }, [userData, loadUser]);

  // Sensitive data fetching effect
  useEffect(() => {
    if (userData) {

      const fullUserData = getCurrentUser();
      setSensitiveUserData(fullUserData);

      setIsLoading(false);
    }
  }, [userData]);

  const uploadedItems = (uploadedItemIDs = []) => {
    return uploadedItemIDs.map(itemID => getItemById(itemID)).filter(Boolean);
  };
  const itemsArray = uploadedItems(userData?.uploadedItems);



  if (isLoading || !sensitiveUserData) {
    return (
            <div className="flex justify-center items-center h-screen">
                <Loader color="blue" />
            </div>
        );
  }

  return (
    <div className="container mx-auto px-4 pb-4 pt-[125px]">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 bg-[#fff] shadow-md rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <div>
              <h2 className="text-xl font-semibold text-center">{sensitiveUserData?.name}</h2>
              <p className="text-center text-gray-600">{sensitiveUserData?.email}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 bg-[#fff] shadow-md rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowDown color="green" /> Money Earned</h3>
              <p className="text-2xl font-bold">
                {sensitiveUserData && new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(sensitiveUserData.moneyearned)}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowUp color="red" /> Money Spent</h3>
              <p className="text-2xl font-bold">
                {sensitiveUserData && new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(sensitiveUserData.moneyspent)}
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BookCheck color="orange" /> Total Purchases</h3>
              <p className="text-2xl font-bold">
                {sensitiveUserData && new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(sensitiveUserData.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 bg-[#fff] shadow-md rounded-2xl p-6 min-h-[500px]">
        <Tabs color="indigo" variant="pills" radius="xl" defaultValue="uploaded">
          <Tabs.List>
            <Tabs.Tab value="uploaded" leftSection={<CloudUpload />}>
              Uploaded Items
            </Tabs.Tab>
            <Tabs.Tab value="history" leftSection={<History />}>
              Balance History
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel className="p-6 relative" value="uploaded">
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            {itemsArray.length > 0 ? (
              itemsArray.map((item) => (
                item && <UploadedItemCard key={item.id} item={item} />
              ))
            ) : (
              !isLoading && <p>You have not uploaded any items yet.</p>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
