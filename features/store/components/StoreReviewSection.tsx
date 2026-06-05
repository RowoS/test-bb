"use client";
import { Star } from "lucide-react";
import { useStoreReview } from "../hooks/useStoreReview";

export default function StoreReviewsSection({ storeId }: { storeId: string }) {
    const { values, functions } = useStoreReview(storeId);

    if (values.isLoading) return <div className="p-6">Loading...</div>;
    if (values.error) return <div className="p-6 text-red-500">{values.error}</div>;
    if (!values.reviews.length) return null;

    const averageRating = values.averageRating ?? 0;

    // Calculate rating distribution percentages
    const getPercentage = (starCount: number) => {
        if (values.reviews.length === 0) return 0;
        return (starCount / values.reviews.length) * 100;
    };

    const ratingCounts = {
        5: values.reviews.filter(r => r.rating === 5).length,
        4: values.reviews.filter(r => r.rating === 4).length,
        3: values.reviews.filter(r => r.rating === 3).length,
        2: values.reviews.filter(r => r.rating === 2).length,
        1: values.reviews.filter(r => r.rating === 1).length,
    };

    return (
        <div className="w-full">
            {/* Rating Summary */}
            <div
                style={{ background: "linear-gradient(135deg, #2A4A6F 0%, #1D3557 100%)" }}
                className="rounded-xl shadow-xl p-8 border border-white/10 mb-6"
            >
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="text-center flex-shrink-0">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Star className="w-12 h-12" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                            <span className="text-6xl font-bold text-white">{averageRating.toFixed(1)}</span>
                        </div>
                        <p className="text-blue-200 text-sm">
                            Based on {values.ratingCount} {values.ratingCount === 1 ? "review" : "reviews"}
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingCounts[star as keyof typeof ratingCounts];
                            const percentage = values.reviews.length ? (count / values.reviews.length) * 100 : 0;
                            const isHighlighted = star === Math.round(averageRating);

                            return (
                                <div key={star} className="flex items-center gap-3 mb-3 last:mb-0">
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm font-medium text-white">{star}</span>
                                        <Star className="w-3 h-3" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                                    </div>
                                    <div
                                        style={{
                                            background: "rgba(255,255,255,0.1)",
                                            border: `1px solid ${isHighlighted ? "#FF6B35" : "rgba(255,255,255,0.2)"}`,
                                        }}
                                        className="flex-1 h-3 rounded-full overflow-hidden"
                                    >
                                        <div
                                            style={{
                                                width: `${percentage}%`,
                                                background: isHighlighted
                                                    ? "linear-gradient(to right, #FF6B35, #F4D35E)"
                                                    : "linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.6))",
                                            }}
                                            className="h-full rounded-full transition-all duration-500"
                                        />
                                    </div>
                                    <span className="text-sm text-blue-200 w-12 text-right text-white">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="rounded-xl mb-6" style={{ background: "linear-gradient(135deg, #fafafa 0%, #fff8f5 100%)", border: "1px solid #ffe4d4" }}>
                {/* Filter Section */}
                <div className="p-4 border-b" style={{ borderBottomColor: "#ffe4d4" }}>
                    <div className="flex items-center gap-3 overflow-x-auto">
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
                        {[
                            { id: "all", label: "All Reviews" },
                            { id: "5", label: "5 Stars" },
                            { id: "4", label: "4 Stars" },
                            { id: "3", label: "3 Stars" },
                            { id: "2", label: "2 Stars" },
                            { id: "1", label: "1 Star" },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => functions.setFilter(f.id as "all" | "1" | "2" | "3" | "4" | "5")}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                                    values.filter === f.id
                                        ? "bg-[#FF6B35] text-white shadow-md"
                                        : "bg-white text-[#1D3557] hover:bg-gray-100 shadow-sm border border-gray-200"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="px-4 py-3 border-b" style={{ background: "linear-gradient(135deg, #fafafa 0%, #fff8f5 100%)", border: "1px solid #ffe4d4" }}>
                    <p className="text-sm text-gray-600">
                        Showing {values.visibleReviews.length} of {values.filteredReviews.length} {values.filteredReviews.length === 1 ? "review" : "reviews"}
                    </p>
                </div>

                {/* Reviews List */}
                <div className="p-4">
                    <div className="overflow-y-auto max-h-[560px] space-y-3">
                        {values.filteredReviews.length === 0 ? (
                            <div className="py-16 text-center">
                                <Star className="w-10 h-10 text-orange-200 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No reviews match the selected filter.</p>
                            </div>
                        ) : (
                            values.visibleReviews.map((review) => (
                                <div 
                                    key={review.review_id} 
                                    className="rounded-xl p-5 transition-shadow hover:shadow-md"
                                    style={{
                                        background: "#ffffff",
                                        border: "1px solid #ffe4d4",
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F4D35E] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {review.avatar_url ? (
                                                <img src={review.avatar_url} alt={review.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white font-bold text-sm gap-2 mb-2">{review.username.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="font-bold text-[#1D3557] text-sm">{review.username}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0 text-right mt-1 mr-2">
                                                    {new Date(review.created_at).toLocaleDateString("en-PH", {
                                                        month: "short", day: "numeric", year: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-0.5 mb-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className="w-3.5 h-3.5"
                                                        style={{
                                                            fill: star <= review.rating ? "#F4D35E" : "#E5E7EB",
                                                            color: star <= review.rating ? "#F4D35E" : "#E5E7EB",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            {review.review && (
                                                <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {values.remainingCount > 0 && (
                        <div className="pt-4 mt-2 border-t" style={{ borderTopColor: "#ffe4d4" }}>
                            <button
                                onClick={functions.expandAll}
                                className="w-full py-3 border border-dashed rounded-xl text-sm transition-colors"
                                style={{
                                    borderColor: "#ffe4d4",
                                    color: "#9ca3af",
                                    background: "#ffffff"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#FF6B35";
                                    e.currentTarget.style.color = "#FF6B35";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#ffe4d4";
                                    e.currentTarget.style.color = "#9ca3af";
                                }}
                            >
                                Show {values.remainingCount} more review{values.remainingCount !== 1 ? "s" : ""}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StarRating({ rating }: { rating: number }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <Star
                    key={`full-${i}`}
                    className="w-5 h-5"
                    style={{ fill: "#F4D35E", color: "#F4D35E" }}
                />
            ))}
            {hasHalfStar && (
                <div className="relative w-5 h-5">
                    <Star
                        className="absolute inset-0 w-5 h-5"
                        style={{ fill: "#E5E7EB", color: "#E5E7EB" }}
                    />
                    <div className="absolute inset-0 w-2.5 h-5 overflow-hidden">
                        <Star
                            className="w-5 h-5"
                            style={{ fill: "#F4D35E", color: "#F4D35E" }}
                        />
                    </div>
                </div>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    className="w-5 h-5"
                    style={{ fill: "#E5E7EB", color: "#E5E7EB" }}
                />
            ))}
        </div>
    );
}