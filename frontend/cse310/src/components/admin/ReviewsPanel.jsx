import { useState } from "react";
import { Alert, Badge, Button, Checkbox, Loader, Text, Tooltip, ActionIcon } from "@mantine/core";
import { Star, ShieldCheck, EyeOff, Trash2 } from "lucide-react";
import { getReviewsByItemId } from "../../data/SampleData";

export default function ReviewsPanel({ loading, items }) {
  const [showLowRatingOnly, setShowLowRatingOnly] = useState(true);
  const [expandedItemId, setExpandedItemId] = useState(null);

  if (loading) return <Loader />;

  const itemsWithReviews = items.map((it) => ({
    ...it,
    reviews: getReviewsByItemId(it.id),
  }));

  const displayed = showLowRatingOnly
    ? itemsWithReviews.filter((it) => (it.reviews || []).some((r) => r.rating <= 3))
    : itemsWithReviews;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Checkbox checked={showLowRatingOnly} onChange={(e) => setShowLowRatingOnly(e.currentTarget.checked)} label="Show only items with low-rated reviews (≤ 3★)"/>
      </div>

      {displayed.length === 0 && (
        <Alert color="green" title="All good!">No low-rated reviews found.</Alert>
      )}

      <div className="space-y-4">
        {displayed.map((it) => (
          <div key={it.id} className="border rounded-2xl p-4 bg-gray-50">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Text className="text-lg font-semibold">{it.name}</Text>
                  <Badge color="blue">{it.subject}</Badge>
                  <Badge variant="light">{it.university}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Star size={16} className="text-yellow-500"/> {it.avgRating} avg
                  <span>•</span>
                  <span>{it.purchaseCount} purchases</span>
                </div>
              </div>
              <Button variant="light" onClick={() => setExpandedItemId((p) => (p === it.id ? null : it.id))}>{expandedItemId === it.id ? "Hide Reviews" : "Show Reviews"}</Button>
            </div>

            {expandedItemId === it.id && (
              <div className="mt-3 space-y-3">
                {(it.reviews || []).map((r) => (
                  <div key={r.id} className={`rounded-xl p-3 border ${r.rating <= 3 ? "border-red-300 bg-red-50" : "bg-white"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge color={r.rating <= 3 ? "red" : "green"}>{r.rating}★</Badge>
                        <span className="text-sm text-gray-600">{new Date(r.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tooltip label="Approve & keep visible"><ActionIcon variant="subtle" color="green"><ShieldCheck size={18}/></ActionIcon></Tooltip>
                        <Tooltip label="Hide from listing"><ActionIcon variant="subtle" color="orange"><EyeOff size={18}/></ActionIcon></Tooltip>
                        <Tooltip label="Delete review"><ActionIcon variant="subtle" color="red"><Trash2 size={18}/></ActionIcon></Tooltip>
                      </div>
                    </div>
                    <Text className="mt-2 text-sm">{r.comment}</Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}