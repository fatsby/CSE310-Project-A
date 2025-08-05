import useUserStore from "../stores/userStore";
import { BanknoteArrowDown, BanknoteArrowUp, BookCheck } from "lucide-react";

export default function YourProfilePage() {
  // Zustand selectors
  const userData = useUserStore((state) => state.userData);
  const userName = useUserStore((state) => state.getUserName());
  const profilePicture = useUserStore((state) => state.getProfilePicture());

  const userTotalPurchases = userData.purchasedItems.length;

  return (
    <div className="container mx-auto px-4 pb-4 pt-[125px]">
      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 bg-[#fff] shadow-md rounded-lg p-6">
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
        <div className="lg:col-span-8 bg-[#fff] shadow-md rounded-lg p-6">
          {/* STATS BLOCKS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowDown/> Money Earned</h3>
              <p className="text-2xl font-bold">{userData.moneyearned}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BanknoteArrowUp/> Money Spent</h3>
              <p className="text-2xl font-bold">{userData.moneyspent}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold flex items-center justify-center gap-2"><BookCheck/> Total Purchases</h3>
              <p className="text-2xl font-bold">{userTotalPurchases}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}