import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

function ItemCard({ itemData }) {
    if (!itemData) {
        return null
    }

    return (
        <Link
            to={`/item/${itemData.id}`}
            className="
                group block bg-white rounded-2xl overflow-hidden
                shadow-[0px_2px_10px_0px_rgba(0,0,0,0.05)] 
                hover:shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1)]
                transition-all duration-300 hover:-translate-y-1
                border border-transparent hover:border-blue-100
                h-full flex-col
            "
        >
            {/* Image Section */}
            <div className="relative overflow-hidden h-48">
                <img
                    src={itemData.images[0]}
                    alt={itemData.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                {/* 1. University Name (Top label) */}
                <div className="mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 line-clamp-1">
                        {itemData.universityName}
                    </span>
                </div>

                {/* 2. Item Name (Main Title) */}
                <h3
                    className="text-[17px] font-bold text-slate-800 leading-tight line-clamp-2 mb-3 group-hover:text-blue-700 transition-colors"
                    title={itemData.name}
                >
                    {itemData.name}
                </h3>

                {/* 3. Subject Badge */}
                <div className="mb-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-300">
                        {itemData.subjectName}
                    </span>
                </div>

                {/* Footer: Price & Rating (Pushed to bottom) */}
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-blue-600 font-bold text-lg">
                        {itemData.price === 0
                            ? 'FREE'
                            : new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: 'VND',
                              }).format(itemData.price)}
                    </p>
                    <div className="flex items-center gap-x-1 text-sm font-medium text-gray-500">
                        <p>
                            {itemData.averageRating === 0
                                ? 'No Reviews'
                                : `${itemData.averageRating}`}
                        </p>
                        <Star fill="#FFCC00" color="#FFCC00" size={16} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ItemCard
