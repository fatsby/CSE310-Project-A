import React from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, CalendarClock } from 'lucide-react'

function formatVND(value) {
    const n = Number(value || 0)
    if (n === 0) return 'FREE'
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(n)
}

function formatDate(dateString) {
    if (!dateString) return ''
    return dateString.split('T')[0]
}

export default function OtherProfileItemCard({ item }) {
    if (!item) return null

    return (
        <Link
            to={`/item/${item.id}`}
            className="
                group  bg-white rounded-2xl overflow-hidden
                shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] 
                hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]
                transition-all duration-300 hover:-translate-y-1
                border border-transparent hover:border-blue-100
                flex flex-col h-full
            "
        >
            <div className="relative overflow-hidden h-44 sm:h-48">
                <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 line-clamp-1">
                        {item.universityName}
                    </span>
                </div>

                <h3
                    className="text-[16px] font-bold text-slate-800 leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors"
                    title={item.name}
                >
                    {item.name}
                </h3>

                <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                        {item.subjectName}
                    </span>
                </div>

                {/* Stats Row: Rating & Purchase Count */}
                <div className="flex items-center gap-4 mb-4 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                        <Star
                            size={14}
                            className="text-yellow-500 fill-yellow-500"
                        />
                        <span>
                            {item.averageRating > 0
                                ? item.averageRating.toFixed(1)
                                : 'No reviews'}
                        </span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-300"></div>
                    <div className="flex items-center gap-1">
                        <ShoppingBag size={14} />
                        <span>{item.purchaseCount} sold</span>
                    </div>
                </div>

                {/* Footer: Price & Date */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-lg">
                        {formatVND(item.price)}
                    </span>

                    <div
                        className="flex items-center gap-1 text-xs text-gray-400"
                        title="Last updated"
                    >
                        <CalendarClock size={14} />
                        <span>{formatDate(item.updatedAt)}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
