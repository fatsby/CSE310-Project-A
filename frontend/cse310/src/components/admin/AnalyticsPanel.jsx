import { Loader, Text, Badge } from "@mantine/core";
import { Users, FileText, CreditCard, Star } from "lucide-react";

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-gray-100 p-4 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 text-gray-700 mb-2">{icon}<span className="font-medium">{title}</span></div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

export default function AnalyticsPanel({ loading, analytics, items }) {
  if (loading) return <Loader />;
  const { totalUsers, totalItems, totalSales, avgPlatformRating, bestSellers } = analytics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={<Users size={18} />} />
        <StatCard title="Total Items" value={totalItems} icon={<FileText size={18} />} />
        <StatCard title="Total Sales (₫)" value={new Intl.NumberFormat('vi-VN').format(totalSales)} icon={<CreditCard size={18} />} />
        <StatCard title="Avg Rating" value={avgPlatformRating} icon={<Star size={18} />} />
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <h3 className="text-lg font-semibold mb-3">Top 5 Best Sellers</h3>
        <div className="space-y-3">
          {bestSellers.map((it) => {
            const max = Math.max(...bestSellers.map((b) => b.purchaseCount || 1));
            const widthPct = Math.round(((it.purchaseCount || 0) / max) * 100);
            return (
              <div key={it.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{it.name}</span>
                  <span className="text-gray-600">{it.purchaseCount} purchases</span>
                </div>
                <div className="w-full bg-white rounded-lg border overflow-hidden">
                  <div className="h-2" style={{ width: `${widthPct}%`, background: '#0052cc' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}