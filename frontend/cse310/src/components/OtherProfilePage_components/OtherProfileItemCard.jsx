import { Link } from 'react-router-dom';
import { Star, ShoppingBag, CalendarClock } from 'lucide-react';

function formatVND(value) {
  const n = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(n) + "₫";
}

export default function OtherProfileItemCard({ item }) {
  return (
    <div className="rounded-2xl bg-white shadow-md p-4 flex flex-col">
      <Link to={`/item/${item.id}`} className="block">
        <div className="w-full h-40 overflow-hidden rounded-xl mb-3">
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>
        <h3 className="text-lg font-semibold line-clamp-2 hover:underline">
          {item.name}
        </h3>
      </Link>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {/* Course code */}
        <span className="bg-blue-700 text-white font-semibold rounded-lg px-2 py-1 text-xs">
          {item.subject}
        </span>
        {/* University */}
        <span className="bg-rose-600 text-white font-semibold rounded-lg px-2 py-1 text-xs">
          {item.university}
        </span>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1">
          <Star size={18} className="text-yellow-500" />
          <span className="font-medium">
            {item.avgRating?.toFixed?.(1) ?? item.avgRating}
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <ShoppingBag size={18} />
          <span className="text-sm">{item.purchaseCount}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xl font-bold">{formatVND(item.price)}</span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <CalendarClock size={14} />
          {item.lastUpdated}
        </span>
      </div>
    </div>
  );
}
