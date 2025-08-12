import useUserStore from "../stores/userStore";
import { Tabs, Loader, LoadingOverlay, ScrollArea } from "@mantine/core";
import { CloudUpload, BanknoteArrowDown, BanknoteArrowUp, History, Star } from "lucide-react";
import { getItemById, getCurrentUser } from "../data/SampleData";
import { useState, useEffect, useMemo } from "react";
import UploadedItemCard from "../components/UserProfilePage_components/UploadedItemCard";
import BalanceHistoryItem from "../components/UserProfilePage_components/BalanceHistoryItem";

export default function YourProfilePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const profilePicture = useUserStore((state) => state.getProfilePicture());
  const loadUser = useUserStore((state) => state.loadUser);

  // Sensitive data (balance, money earned/spent, email, etc.)
  const [sensitiveUserData, setSensitiveUserData] = useState(null);

  // Load non-sensitive from store
  useEffect(() => {
    if (!userData) loadUser();
  }, [userData, loadUser]);

  // Fetch sensitive data (simulate; replace with API later)
  useEffect(() => {
    if (userData) {
      const fullUserData = getCurrentUser();
      setSensitiveUserData(fullUserData);
      setIsLoading(false);
    }
  }, [userData]);

  // Resolve uploaded items to full item objects (with avgRating from SampleData)
  const itemsArray = useMemo(() => {
    const ids = userData?.uploadedItems || [];
    return ids
      .map((id) => getItemById(id))
      .filter(Boolean);
  }, [userData]);

  // ---- Helpers (swap with API-calculated fields later) ----
  const formatVND = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);

  /* TODO: REPLACE THIS WITH ACTUAL AMOUNT FROM API FETCH */
  // Total sales amount across all uploaded items (price * purchaseCount)
  const totalSalesAmount = useMemo(() => {
    if (!itemsArray?.length) return 0;
    return itemsArray.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const pcs = Number(item.purchaseCount) || 0;
      return sum + price * pcs;
    }, 0);
  }, [itemsArray]);

  /* TODO: REPLACE THIS WITH ACTUAL AMOUNT FROM API FETCH */
  // Average rating across uploaded items (only items that have a rating > 0)
  const avgRatingAcrossUploads = useMemo(() => {
    if (!itemsArray?.length) return 0;
    const rated = itemsArray.filter((i) => Number(i.avgRating) > 0);
    if (!rated.length) return 0;
    const sum = rated.reduce((s, i) => s + Number(i.avgRating || 0), 0);
    return Number((sum / rated.length).toFixed(1));
  }, [itemsArray]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">

            {/* TODO: REPLACE THIS WITH ACTUAL AMOUNT FROM API FETCH */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <BanknoteArrowUp color="red" /> Money Spent
              </h3>
              <p className="text-2xl font-bold">
                {formatVND(Number(sensitiveUserData?.moneyspent))}
              </p>
            </div>

            {/* TODO: REPLACE THIS WITH ACTUAL AMOUNT FROM API FETCH */}
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <BanknoteArrowDown color="green" /> Money Earned
              </h3>
              <p className="text-2xl font-bold">
                {formatVND(totalSalesAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sum of your item sales</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                <Star color="gold" /> Avg Rating
              </h3>
              <p className="text-2xl font-bold">
                {avgRatingAcrossUploads.toFixed(1)}<span className="text-base text-gray-600">/5</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="mt-6 bg-[#fff] shadow-md rounded-2xl p-6 min-h-[500px] max-h-[500px]">
        <Tabs color="indigo" variant="pills" radius="xl" defaultValue="uploaded">
          <Tabs.List>
            <Tabs.Tab value="uploaded" leftSection={<CloudUpload />}>
              Uploaded Items
            </Tabs.Tab>
            <Tabs.Tab value="history" leftSection={<History />}>
              Balance History
            </Tabs.Tab>
          </Tabs.List>

          {/* UPLOADED ITEMS */}
          <Tabs.Panel className="p-6 relative" value="uploaded">
            <ScrollArea h={400} type="always" offsetScrollbars>
              <LoadingOverlay visible={isLoading} overlayBlur={2} />
              {itemsArray.length > 0 ? (
                itemsArray.map((item) => (
                  item && <UploadedItemCard key={item.id} item={item} />
                ))
              ) : (
                !isLoading && <p>You have not uploaded any items yet.</p>
              )}
            </ScrollArea>
          </Tabs.Panel>

          {/* BALANCE HISTORY */}
          <Tabs.Panel className="p-6 relative" value="history" offsetScrollbars>
            <ScrollArea h={400} type="always">
              <BalanceHistoryItem item={{ date: "12/01/2023", description: "Profit from selling CSE301 Final Database", amount: 100000 }} />
              <BalanceHistoryItem item={{ date: "12/01/2023", description: "Profit from selling CSE301 Final Database", amount: 100000 }} />
              <BalanceHistoryItem item={{ date: "12/01/2023", description: "Profit from selling CSE301 Final Database", amount: 100000 }} />
              <BalanceHistoryItem item={{ date: "11/01/2023", description: "Refund for CSE101 Course Material", amount: -20000 }} />
              <BalanceHistoryItem item={{ date: "10/01/2023", description: "Added from bank account", amount: 50000 }} />
              <BalanceHistoryItem item={{ date: "10/01/2023", description: "Purchased CSE201 Exam Preps", amount: -50000 }} />
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
