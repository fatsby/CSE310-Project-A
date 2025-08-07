import useUserStore from "../stores/userStore";
import { Tabs, Loader, LoadingOverlay, Button } from "@mantine/core";
import { CloudUpload, BanknoteArrowDown, BanknoteArrowUp, BookCheck, TriangleAlert, Pencil } from "lucide-react";
import { getItemById, getCurrentUser } from "../data/SampleData";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  function UploadedItemCard({ item, onEdit, onDelete }) {
    if (!item) return null;

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
            <Button variant="light" radius="md" rightSection={<Pencil size="16"/>}>Edit</Button>
            <Button variant="filled" radius="md" color="#c10007" rightSection={<TriangleAlert size="16" color="yellow"/>}>Delete</Button>
          </div>
        </div>
        <p className="text-gray-600">Price: ${item.price}</p>
      </div>
    );
  }



  if (isLoading || !sensitiveUserData) {
    return (
      <div className="container mx-auto px-4 pb-4 pt-[125px]">
        <Loader visible={true} overlayBlur={2} />
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
              <p className="text-2xl font-bold">${sensitiveUserData?.moneyearned || 0}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowUp color="red" /> Money Spent</h3>
              <p className="text-2xl font-bold">${sensitiveUserData?.moneyspent || 0}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BookCheck color="orange" /> Total Purchases</h3>
              <p className="text-2xl font-bold">{sensitiveUserData?.purchasedItems?.length || 0}</p>
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
