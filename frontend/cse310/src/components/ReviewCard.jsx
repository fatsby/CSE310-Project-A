import React from 'react'
import { Rating } from '@mantine/core'

function ReviewCard({ reviewData, userProfilePic }) {
    if (!reviewData) {
        return null
    }

    return (
        <div className="block bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-start gap-x-4">
                <img
                    src={userProfilePic}
                    alt={reviewData.userName}
                    className="w-12 h-12 object-cover rounded-full"
                />
                <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">
                        {reviewData.userName}
                    </p>
                    <div className="flex items-center mt-1">
                        <Rating
                            value={reviewData.rating}
                            fractions={2}
                            readOnly
                        />
                    </div>
                    <p className="text-gray-700 mt-2">{reviewData.comment}</p>
                    <p className="text-sm text-gray-500 text-right mt-2">
                        {new Date(reviewData.reviewDate).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard
