import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

function ItemCard({ itemData }) {
    if (!itemData) {
        return null;
    }

    return (
        <Link to={`/item/${itemData.id}`} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            {/* Now `itemData.images` will exist and the error is gone */}
            <img src={itemData.images[0]} alt={itemData.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <p className="text-lg font-semibold text-gray-800 truncate" title={itemData.name}>{itemData.name}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-blue-600 font-bold">{itemData.price} VND</p>
                <div className="flex items-center gap-x-1">
                    <p className="font-bold text-gray-700">{itemData.avgRating}</p>
                    <Star fill="#FFCC00" color="#FFCC00" size={20} />
                </div>
            </div>
        </Link>
    );
}

export default ItemCard;
