import { useState, useMemo } from "react";
import { Alert, Badge, Checkbox, Loader, Text, Tooltip, ActionIcon } from "@mantine/core";
import { ShieldCheck, EyeOff, Trash2 } from "lucide-react";

export default function ReviewsPanel({ loading, reviews }) {
  const [showLowRatingOnly, setShowLowRatingOnly] = useState(true);

  // Filter reviews directly
  const displayedReviews = useMemo(() => {
    if (!reviews) return [];
    
    return showLowRatingOnly
      ? reviews.filter(r => r.rating <= 3)
      : reviews;
  }, [reviews, showLowRatingOnly]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={showLowRatingOnly} 
          onChange={(e) => setShowLowRatingOnly(e.currentTarget.checked)} 
          label="Show only low-rated reviews (≤ 3★)"
        />
      </div>

      {displayedReviews.length === 0 && (
        <Alert color="green" title="No reviews found">
          {showLowRatingOnly ? "No reviews with 3 stars or less found." : "No reviews in the database."}
        </Alert>
      )}

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {displayedReviews.map((r, index) => (
          // Use a composite key since Review ID might not be unique or present in all DTOs depending on backend
          <div 
            key={r.id || `${r.userId}-${r.documentId}-${index}`} 
            className={`rounded-2xl p-4 border flex flex-col gap-3 shadow-sm transition-colors ${r.rating <= 3 ? "border-red-200 bg-red-50" : "bg-white border-gray-200"}`}
          >
            {/* Header: Document Name & Rating */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <Text className="font-semibold text-gray-900 truncate max-w-[250px]" title={r.documentName}>
                  {r.documentName || "Unknown Document"}
                </Text>
                <Text className="text-xs text-gray-500">
                  by <span className="font-medium">{r.userName || "Anonymous"}</span>
                </Text>
              </div>
              <Badge color={r.rating <= 3 ? "red" : "green"} size="lg" variant="filled">
                {r.rating} ★
              </Badge>
            </div>

            {/* Review Content */}
            <div className="flex-grow">
              <Text className="text-sm text-gray-700 italic">"{r.comment}"</Text>
            </div>

            {/* Footer: Date & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100/50 mt-1">
              <Text className="text-xs text-gray-400">
                {r.reviewDate ? new Date(r.reviewDate).toLocaleDateString() : "N/A"}
              </Text>
              
              <div className="flex items-center gap-1">
                <Tooltip label="Approve & Keep">
                  <ActionIcon variant="light" color="green" size="sm"><ShieldCheck size={16}/></ActionIcon>
                </Tooltip>
                <Tooltip label="Hide Review">
                  <ActionIcon variant="light" color="orange" size="sm"><EyeOff size={16}/></ActionIcon>
                </Tooltip>
                <Tooltip label="Delete Review">
                  <ActionIcon variant="light" color="red" size="sm"><Trash2 size={16}/></ActionIcon>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}