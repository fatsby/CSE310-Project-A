import React from 'react';
import { Star } from 'lucide-react'; // Assuming you might want to show stars here too

// Renamed to ReviewCard for clarity
function ReviewCard({ reviewData, userName, userProfilePic }) {
    if (!reviewData) {
        return null;
    }

    return (
        <div className="block bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-start gap-x-4">
                <img src={userProfilePic} alt={userName} className="w-12 h-12 object-cover rounded-full" />
                <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">{userName}</p>
                    <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                            <Star 
                                key={i} 
                                size={20} 
                                color="#FFCC00" 
                                fill={i < reviewData.rating ? "#FFCC00" : "none"} 
                            />
                        ))}
                    </div>
                    <p className="text-gray-700 mt-2">{reviewData.comment}</p>
                    <p className="text-sm text-gray-500 text-right mt-2">{new Date(reviewData.date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;
