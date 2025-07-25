import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

function ItemCard({ itemData }) {
    if (!itemData) {
        return null;
    }

    return (
        <Link to={`/item/${itemData.id}`} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <img src={itemData.images[0]} alt={itemData.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <p className="text-lg font-semibold text-gray-800 truncate" title={itemData.name}>{itemData.name}</p>
                <div className="flex gap-1">
                    <p className="font-semibold text-blue-700 border-2 inline p-1 rounded-lg text-xs" title={itemData.subject}>{itemData.subject}</p>
                    <p className="font-semibold text-rose-400 border-2 inline p-1 rounded-lg text-xs" title={itemData.university}>{itemData.university}</p>
                </div>
            <div className="flex items-center justify-between mt-2">
                <p className="text-gray-700 font-regular">
                    {itemData.price === 0 ? 'FREE' : `${itemData.price} VND`}
                </p>
                <div className="flex items-center gap-x-1">
                    <p className="font-regular text-gray-700">
                        {itemData.avgRating === 0 ? 'No Reviews' : `${itemData.avgRating}`}
                    </p>
                    <Star fill="#FFCC00" color="#FFCC00" size={20} />
                </div>
            </div>
        </Link>
    );
}

export default ItemCard;
