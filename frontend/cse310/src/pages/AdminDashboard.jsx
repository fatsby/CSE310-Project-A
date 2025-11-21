import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Group,
  Tabs,
  Text,
} from "@mantine/core";
import {
  Users,
  FileText,
  Star,
  Plus,
  BarChart3,
  CreditCard,
  Search as SearchIcon,
} from "lucide-react";

import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import UsersPanel from "../components/admin/UsersPanel";
import ItemsPanel from "../components/admin/ItemsPanel";
import ReviewsPanel from "../components/admin/ReviewsPanel";
import TransactionsPanel from "../components/admin/TransactionsPanel";

import { getToken } from '../../utils/auth'

const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]); //documents
  const [reviews, setReviews] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [avgPlatformRating, setAvgPlatformRating] = useState("0.00");
  const [bestSellers, setBestSellers] = useState([]);
  
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const [
        usersRes, 
        salesRes, 
        ratingRes, 
        bestSellersRes, 
        countRes,
        reviewsRes,
        transactionsRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/users/users`, { method: "GET", headers }),
        fetch(`${API_URL}/api/purchases/totalSales`, { method: "GET", headers }),
        fetch(`${API_URL}/api/reviews/averageRating`, { method: "GET", headers }),
        fetch(`${API_URL}/api/documents/best-sellers`, { method: "GET", headers }),
        fetch(`${API_URL}/api/documents/count`, { method: "GET", headers }),
        fetch(`${API_URL}/api/reviews`, { method: "GET", headers }),
        fetch(`${API_URL}/api/purchases/all`, { method: "GET", headers })
      ]);

      // users data
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
        setTotalUsers(usersData.length);
      }

      // total sales
      if (salesRes.ok) {
        const salesData = await salesRes.json();
        const salesValue = salesData;
        setTotalSales(Number(salesValue) || 0);
      }

      // average platform rating
      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        const ratingValue = ratingData;
        setAvgPlatformRating(Number(ratingValue).toFixed(2));
      }

      // best sellers
      if (bestSellersRes.ok) {
        const bestSellersData = await bestSellersRes.json();
        setBestSellers(bestSellersData.slice(0, 5)); // topp 5
        setItems(bestSellersData); // use full list for ItemsPanel
      }

      // document count
      if (countRes.ok) {
        const countData = await countRes.json();
        const countValue = countData;
        setTotalItems(countValue || 0);
      }

      // reviews data
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json();
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      }

      // transactions data
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      }
    } catch (error) {
      console.error("Failed to fetch admin analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // analytics object for anlytics panel
  const analytics = {
    totalUsers,
    totalItems,
    totalSales,
    avgPlatformRating,
    bestSellers
  };

  // --- Actions (Placeholders for now) ---
  const updateUser = (id, payload) => {
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
    // TODO: Call API to update user
  };

  const deleteUser = (id) => {
    // Optimistic delete
    setUsers((prev) => prev.filter((u) => u.id !== id));
    // TODO: Call API DELETE /users/{id}
  };

  const upsertItem = (item) => {
    // Optimistic upsert
    setItems((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev.map((it) => (it.id === item.id ? { ...it, ...item } : it));
      return [item, ...prev];
    });
    // TODO: Call API POST/PUT /documents
  };

  const deleteItem = (id) => {
    // Optimistic delete
    setItems((prev) => prev.filter((it) => it.id !== id));
    // TODO: Call API DELETE /documents/{id}
  };

  return { loading, users, items, reviews, transactions, analytics, updateUser, deleteUser, upsertItem, deleteItem };
};

export default function AdminDashboard() {
  const { loading, users, items, reviews, transactions, analytics, updateUser, deleteUser, upsertItem, deleteItem } = useAdminData();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="container mx-auto px-4 pb-6 pt-[110px]">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Text c="dimmed">Manage users, items, reviews, transactions & platform analytics</Text>
        </div>
        <Group gap="xs">
          <Button variant="light" color="#0052cc" leftSection={<SearchIcon size={16} />}>Search</Button>
          <Button variant="filled" color="#0052cc" leftSection={<Plus size={16} />}>Quick Action</Button>
        </Group>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-3 md:p-5">
        <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="xl" color="indigo">
          <Tabs.List>
            <Tabs.Tab value="analytics" leftSection={<BarChart3 size={16} />}>Analytics</Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<Users size={16} />}>Users</Tabs.Tab>
            <Tabs.Tab value="items" leftSection={<FileText size={16} />}>Documents/Items</Tabs.Tab>
            <Tabs.Tab value="reviews" leftSection={<Star size={16} />}>Reviews</Tabs.Tab>
            <Tabs.Tab value="transactions" leftSection={<CreditCard size={16} />}>Transactions</Tabs.Tab>
          </Tabs.List>

          <Divider my="md" />

          <Tabs.Panel value="analytics">
            <AnalyticsPanel loading={loading} analytics={analytics} items={items} />
          </Tabs.Panel>
          <Tabs.Panel value="users">
            <UsersPanel loading={loading} users={users} onUpdate={updateUser} onDelete={deleteUser} />
          </Tabs.Panel>
          <Tabs.Panel value="items">
            <ItemsPanel loading={loading} items={items} onUpsert={upsertItem} onDelete={deleteItem} />
          </Tabs.Panel>
          <Tabs.Panel value="reviews">
            <ReviewsPanel loading={loading} reviews={reviews} />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            <TransactionsPanel loading={loading} transactions={transactions} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}