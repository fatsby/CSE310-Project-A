import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Group,
  Tabs,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Users,
  FileText,
  Star,
  Plus,
  BarChart3,
  CreditCard,
  Search as SearchIcon,
} from "lucide-react";
import {
  getUsers,
  getItemsList,
} from "../data/SampleData";

// Panels
import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import UsersPanel from "../components/admin/UsersPanel";
import ItemsPanel from "../components/admin/ItemsPanel";
import ReviewsPanel from "../components/admin/ReviewsPanel";
import TransactionsPanel from "../components/admin/TransactionsPanel";


const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [avgPlatformRating, setAvgPlatformRating] = useState("0.00");
  const [bestSellers, setBestSellers] = useState([]);
  const API_URL = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    // TODO[API]: Replace with real endpoints
    fetchAnalytics();
    setLoading(false);
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      //fetch user list
      const fetchUserLists = await fetch(`${API_URL}/api/users/users`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!fetchUserLists.ok) {
        throw new Error(`Failed to fetch analytics. Status: ${response.status}`);
      }

      const usersList = await fetchUserLists.json();
      setUsers(usersList);
      setTotalUsers(usersList.length);

      const fetchTotalSales = await fetch(`${API_URL}/api/purchases/totalSales`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!fetchTotalSales.ok) {
        throw new Error(`Failed to fetch analytics. Status: ${response.status}`);
      }
      const salesData = await fetchTotalSales.json();
      setTotalSales(salesData.totalSales || 0);

    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Derived stats
  // const analytics = useMemo(() => {
  //   const totalUsers = users.length;
  //   const totalItems = items.length;
  //   const totalSales = items.reduce((sum, it) => sum + (parseInt(it.price, 10) || 0) * (it.purchaseCount || 0), 0);
  //   const avgPlatformRating = items.length
  //     ? (items.reduce((s, it) => s + (it.avgRating || 0), 0) / items.length).toFixed(2)
  //     : "0.00";
  //   const bestSellers = [...items]
  //     .sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0))
  //     .slice(0, 5);
  //   return { totalUsers, totalItems, totalSales, avgPlatformRating, bestSellers };
  // }, [users, items]);

  // Mock mutations (visual only)
  const updateUser = (id, payload) => {
    // TODO[API]: PUT /users/{id}
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
  };
  const deleteUser = (id) => {
    // TODO[API]: DELETE /users/{id}
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };
  const upsertItem = (item) => {
    // TODO[API]: POST/PUT /items
    setItems((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev.map((it) => (it.id === item.id ? { ...it, ...item } : it));
      return [item, ...prev];
    });
  };
  const deleteItem = (id) => {
    // TODO[API]: DELETE /items/{id}
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return { loading, users, items, analytics, updateUser, deleteUser, upsertItem, deleteItem };
};

export default function AdminDashboard() {
  const { loading, users, items, analytics, updateUser, deleteUser, upsertItem, deleteItem } = useAdminData();
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
            <ReviewsPanel loading={loading} items={items} />
          </Tabs.Panel>
          <Tabs.Panel value="transactions">
            <TransactionsPanel loading={loading} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}