import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Divider,
  Group,
  Tabs,
  Text,
  Notification,
  Transition
} from "@mantine/core";
import {
  Users,
  FileText,
  Star,
  Plus,
  BarChart3,
  CreditCard,
  Library,
  Search as SearchIcon, // Renamed to avoid conflict
  X as XIcon,
  ShieldAlert
} from "lucide-react";

import AnalyticsPanel from "../components/admin/AnalyticsPanel";
import UsersPanel from "../components/admin/UsersPanel";
import ItemsPanel from "../components/admin/ItemsPanel";
import ReviewsPanel from "../components/admin/ReviewsPanel";
import TransactionsPanel from "../components/admin/TransactionsPanel";
import UniversitySubjectPanel from "../components/admin/UniversitySubjectPanel";
import DeletedDocsPanel from "../components/admin/DeletedDocsPanel";

import { getToken } from '../../utils/auth'

const useAdminData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // error state for notification

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

  //auto dismiss error notification after 5 secs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
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
        transactionsRes,
        documentsRes
      ] = await Promise.all([
        fetch(`${API_URL}/api/users/users`, { method: "GET", headers }),
        fetch(`${API_URL}/api/purchases/totalSales`, { method: "GET", headers }),
        fetch(`${API_URL}/api/reviews/averageRating`, { method: "GET", headers }),
        fetch(`${API_URL}/api/documents/best-sellers`, { method: "GET", headers }),
        fetch(`${API_URL}/api/documents/count`, { method: "GET", headers }),
        fetch(`${API_URL}/api/reviews`, { method: "GET", headers }),
        fetch(`${API_URL}/api/purchases/all`, { method: "GET", headers }),
        fetch(`${API_URL}/api/documents/inactive`, { method: "GET", headers })
      ]);

      // users data
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
        setTotalUsers(usersData.length);
      } else {
        throw new Error(`${usersRes.text()}`)
      }

      if (salesRes.ok) setTotalSales(Number(await salesRes.json()) || 0);
      if (ratingRes.ok) setAvgPlatformRating(Number(await ratingRes.json()).toFixed(2));
      if (bestSellersRes.ok) {
        const data = await bestSellersRes.json();
        setBestSellers(data.slice(0, 5));
      }
      if (countRes.ok) setTotalItems(await countRes.json() || 0);
      if (reviewsRes.ok) setReviews(await reviewsRes.json());
      if (transactionsRes.ok) setTransactions(await transactionsRes.json());
      if (documentsRes.ok) setItems(await documentsRes.json());

    } catch (error) {
      console.error("Failed to fetch admin analytics:", error.message);
      setError(error.message || "Failed to load dashboard data. Please refresh.");
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

  const createUser = async (newUser) => {
    try {
      const createRes = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newUser.email,
          userName: newUser.userName,
          password: newUser.password
        }),
      });

      if (!createRes.ok) {
        const errorMsg = await createRes.text(); 
        throw new Error(errorMsg || "Unknown error occurred");
      }

      fetchAnalytics();

    } catch (error) {
      console.log(`Error creating user: ${error.message} `)
      setError(`Error creating user: ${error.message} `);
    }
  }

  // --- Actions (Placeholders for now) ---
  const updateUser =  async(id, payload) => {
    // Optimistic update
    
    const updateRes = await fetch(`${API_URL}/api/users/admin/edit/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          userName: payload.userName,
          password: "",
          avatarUrl: payload.avatarUrl
        }),
      });

      if (!updateRes.ok) {
        const errorMsg = await updateRes.text(); 
        throw new Error(errorMsg || "Unknown error occurred");
      }

      try {

      } catch (error){
        console.log(`Error editing user: ${error.message} `)
        setError(`Error editing user: ${error.message} `);
      } finally{
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
      }
  };

  const deleteUser = async (email) => {
    try {
      const banRes = await fetch(`${API_URL}/api/users/admin/ban-switch/${email}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        }
      });
      if (!banRes.ok) throw new Error(`${banRes.text()}`);

      const result = await banRes.json();
      console.log("User status toggled successfully:", result);

      // update status badge
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isActive: !user.isActive } : user
        )
      );

    } catch (err) {
      console.error("Failed to ban/unban user:", err.message);
      setError(`Error banning/unbannign user: ${err.message}` || "An unexpected error occurred while modifying user.");
    } finally {
    }

  };

  const upsertItem = (item) => {
    // DEPRECATED
    setItems((prev) => {
      const exists = prev.some((it) => it.id === item.id);
      if (exists) return prev.map((it) => (it.id === item.id ? { ...it, ...item } : it));
      return [item, ...prev];
    });
  };

  const toggleItemActive = async (id, currentIsActive) => {
    // Optimistic update
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isActive: !currentIsActive } : it))
    );

    try {
      const res = await fetch(`${API_URL}/api/documents/${id}/active?isActive=${!currentIsActive}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
    } catch (err) {
      setError(`Failed to update document status: ${err.message}`);
      // Revert optimistic update on error
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, isActive: currentIsActive } : it))
      );
    }
  };

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/documents/${id}/delete?isDeleted=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(`Failed to delete document: ${err.message}`);
    }
  };

  return { loading, users, items, reviews, transactions, analytics, updateUser, deleteUser, upsertItem, toggleItemActive, deleteItem, createUser, error, setError };
};

export default function AdminDashboard() {
  const { loading, users, items, reviews, transactions, analytics, updateUser, deleteUser, upsertItem, toggleItemActive, deleteItem, createUser, error, setError } = useAdminData();
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="container mx-auto px-4 pb-6 pt-[110px]">
      {/* ERROR NOTIFICATION TOAST */}
      <div className="fixed bottom-6 right-6 z-[9999] w-[350px]">
        {error && (
          <Notification
            icon={<XIcon size={18} />}
            color="red"
            title="Error"
            onClose={() => setError(null)}
            withBorder
            radius="md"
            className="shadow-xl"
          >
            {error}
          </Notification>
        )}
      </div>

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
            <Tabs.Tab value="deleteddocs" leftSection={<ShieldAlert size={16} />}>Approve Documents</Tabs.Tab>
            <Tabs.Tab value="items" leftSection={<FileText size={16} />}>Documents/Items</Tabs.Tab>
            <Tabs.Tab value="uni-subjects" leftSection={<Library size={16} />}>University/Subjects</Tabs.Tab>
            <Tabs.Tab value="reviews" leftSection={<Star size={16} />}>Reviews</Tabs.Tab>
            <Tabs.Tab value="transactions" leftSection={<CreditCard size={16} />}>Transactions</Tabs.Tab>
          </Tabs.List>

          <Divider my="md" />

          <Tabs.Panel value="analytics">
            <AnalyticsPanel loading={loading} analytics={analytics} items={items} />
          </Tabs.Panel>
          <Tabs.Panel value="users">
            <UsersPanel loading={loading} users={users} onUpdate={updateUser} onDelete={deleteUser} onCreate={createUser} />
          </Tabs.Panel>
          <Tabs.Panel value="deleteddocs">
            <DeletedDocsPanel />
          </Tabs.Panel>
          <Tabs.Panel value="items">
            <ItemsPanel loading={loading} items={items} onUpsert={upsertItem} onToggleActive={toggleItemActive} onDeleteItem={deleteItem} />
          </Tabs.Panel>
          <Tabs.Panel value="uni-subjects">
            <UniversitySubjectPanel />
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