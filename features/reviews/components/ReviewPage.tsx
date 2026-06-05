'use client';
import { Star, Search } from "lucide-react";
import { useStoreReviews } from "../hooks/useVendorReviewPage";

export default function VendorReviewPage() {
    const { values, functions } = useStoreReviews();

    if (values.isLoading) {
        return <div className="p-20">Loading reviews...</div>;
    }

    if (values.error) {
        return <div className="p-20 text-red-500">Error loading reviews: {values.error}</div>;
    }

    const averageRating = values.averageRating ?? 0;

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
        <div className="pt-25">
            <div
                style={{ background: "linear-gradient(135deg, #2A4A6F 0%, #1D3557 100%)" }}
                className="rounded-xl shadow-xl p-8 border border-white/10 mb-6"
            >
                <div className="flex gap-8 items-center">
                    <div className="flex-shrink-0 text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Star className="w-16 h-16" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                            <span style={{ fontSize: "3rem" }} className="font-bold text-white">{averageRating.toFixed(1)}</span>
                        </div>
                        <p className="text-white text-sm font-medium">
                            {values.ratingCount} {values.ratingCount === 1 ? "review" : "reviews"}
                        </p>
                    </div>
                    <div className="flex-1 w-full">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = ratingCounts[star as keyof typeof ratingCounts];
                            const percentage = values.reviews.length ? (count / values.reviews.length) * 100 : 0;
                            const isHighlighted = star === Math.round(averageRating);
                            return (
                                <div key={star} className="flex items-center gap-3 mb-3 last:mb-0">
                                    <div className="flex items-center gap-1 w-10">
                                        <span className="text-sm font-medium text-white">{star}</span>
                                        <Star className="w-4 h-4" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
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
                                    <span className="text-sm text-white w-12 text-right">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="rounded-xl mb-6 overflow-hidden" style={{ border: "1px solid #ffe4d4" }}>
                <div className="p-4" style={{ background: "linear-gradient(135deg, #3A6B9F 0%, #2A5480 100%)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-2 overflow-x-auto flex-1">
                            <span className="text-xs font-medium whitespace-nowrap flex-shrink-0" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Filter:
                            </span>
                            {[
                                { id: "all", label: "All" },
                                { id: "5", label: "5 ★" },
                                { id: "4", label: "4 ★" },
                                { id: "3", label: "3 ★" },
                                { id: "2", label: "2 ★" },
                                { id: "1", label: "1 ★" },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    onClick={() => functions.setFilter(f.id as "all" | "1" | "2" | "3" | "4" | "5")}
                                    style={values.filter === f.id ? {
                                        background: "#FF6B35",
                                        color: "#ffffff",
                                        border: "1px solid #FF6B35",
                                    } : {
                                        background: "rgba(255,255,255,0.12)",
                                        color: "#e2e8f0",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                    }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors"
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>


                        <div className="relative flex-shrink-0 w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} />
                            <input
                                type="text"
                                value={values.search}
                                onChange={(e) => functions.setSearch(e.target.value)}
                                placeholder="Search reviews..."
                                style={{
                                    background: "rgba(255,255,255,0.12)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    color: "#ffffff",
                                }}
                                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] placeholder-blue-300"
                            />
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 border-b" style={{ background: "#f9fafb", borderBottomColor: "#ffe4d4" }}>
                    <p className="text-sm text-gray-600">
                        Showing {values.visibleReviews.length} of {values.filteredReviews.length} {values.filteredReviews.length === 1 ? "review" : "reviews"}
                    </p>
                </div>

                <div className="p-4" style={{ background: "#f9fafb" }}>
                    <div className="overflow-y-auto max-h-[560px] space-y-3">
                        {values.filteredReviews.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-20 h-20 bg-[#FFE8DF] rounded-full flex items-center justify-center mb-4">
                                        <Star className="w-10 h-10 text-[#FF6B35]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#1D3557] mb-1">No Reviews Found</h3>
                                    <p className="text-gray-500 text-sm">
                                        {values.search
                                            ? "Try adjusting your search terms or filters."
                                            : "No reviews match the selected filter."}
                                    </p>
                                </div>
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
                                                <span className="text-white font-bold text-sm">{review.username.charAt(0).toUpperCase()}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-1">
                                                <p className="font-bold text-[#1D3557] text-sm">{review.username}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0" style={{ marginTop: "8px", marginRight: "12px" }}>
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