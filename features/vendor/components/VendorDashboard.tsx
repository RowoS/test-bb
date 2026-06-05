'use client';
import { useRouter } from "next/navigation";
import { ExternalLink, ChevronDown, Star } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import {useState, useMemo} from "react";
import { useVendorDashboard } from '../hooks/UseVendorDashboard';
import { statusLabel} from '@/features/order/libs/order-actions';

export default function VendorDashboard() {
    const router = useRouter();
    const [orderTab, setOrderTab] = useState<"pending" | "running" | "completed">("pending");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

    const { values } = useVendorDashboard();
    const { isLoading, counts, averageRating, ratingCount, recentReviews, pending, running, completed, allReviews = [] } = values;

    const orderTabMap = {
      pending:   { label: "Order Requests", orders: pending?.slice(0, 2) || [] },
      running:   { label: "Running Orders", orders: running?.slice(0, 2) || [] },
      completed: { label: "Order History",  orders: completed?.slice(0, 2) || [] },
    };

    const Months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return { month: d.getMonth(), year: d.getFullYear(), label: `${Months[d.getMonth()]} ${d.getFullYear()}` };
    });

    const dailyRevenue = values.getDailyRevenue?.(selectedMonth, selectedYear) || [];
    const monthlyTotal = dailyRevenue.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const selectedLabel = `${Months[selectedMonth]} ${selectedYear}`;
    const currentTab = orderTabMap[orderTab];

    const ratingDistribution = useMemo(() => {
        const reviews = allReviews || [];
        const total = reviews.length;
        
        return [5, 4, 3, 2, 1].map(star => {
            const starCount = reviews.filter(r => r?.rating === star).length;
            const percentage = total > 0 ? (starCount / total) * 100 : 0;
            return { star, count: starCount, percentage };
        });
    }, [allReviews]);

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400 text-sm">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="grid grid-cols-3 gap-6 items-stretch">
                <div className="flex flex-col gap-6 h-full">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-base font-bold text-[#1D3557] mb-5">Order Summary</h2>
                        <div className="space-y-5">
                            {[
                                { label: "Pending", count: counts?.pending || 0, total: counts?.total || 1, color: "#F4D35E" },
                                { label: "Running", count: counts?.running || 0, total: counts?.total || 1, color: "#3A6B9F" },
                                { label: "Completed", count: counts?.completed || 0, total: counts?.total || 1, color: "#FF6B35" },
                            ].map(({ label, count, total, color }) => {
                                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                                return (
                                    <div key={label}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm text-gray-600">{label} Orders</span>
                                            <span className="text-sm text-gray-400">{count}/{total}</span>
                                        </div>
                                        <div className="text-xl font-bold text-[#1D3557] mb-1">{pct}%</div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" style={{ height: "280px" }}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative">
                                <button
                                    onClick={() => setOrderDropdownOpen(o => !o)}
                                    className="flex items-center gap-1.5 text-base font-bold text-[#1D3557] hover:text-[#FF6B35] transition-colors"
                                >
                                    {currentTab.label}
                                    <ChevronDown size={14} className={`transition-transform ${orderDropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {orderDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setOrderDropdownOpen(false)} />
                                        <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                                            {(Object.entries(orderTabMap) as [typeof orderTab, typeof currentTab][]).map(([key, { label }]) => (
                                                <button
                                                    key={key}
                                                    onClick={() => { setOrderTab(key); setOrderDropdownOpen(false); }}
                                                    className="w-full px-4 py-2 text-left text-sm transition-colors"
                                                    style={{
                                                        color: orderTab === key ? "#FF6B35" : "#374151",
                                                        background: orderTab === key ? "#fff5f0" : "transparent",
                                                        fontWeight: orderTab === key ? 600 : 400,
                                                    }}
                                                >
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => router.push("/vendor/orders")}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF6B35] transition-colors"
                            >
                                View all
                                <ExternalLink size={11} />
                            </button>
                        </div>

                        <div className="space-y-2">
                            {currentTab.orders.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No {currentTab.label.toLowerCase()}</p>
                            ) : currentTab.orders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-gray-50 hover:border-orange-100 hover:bg-orange-50/30 transition-colors"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold text-[#1D3557] truncate">{order.customer_name ?? "Customer"}</p>
                                        <p className="text-[10px] text-gray-400 font-mono">#{order.order_id?.slice(0, 8) || 'N/A'}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            {order.created_at ? new Date(order.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className="text-xs font-bold text-[#FF6B35]">₱{(order.total || 0).toFixed(2)}</p>
                                        <span
                                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                            style={{
                                                background: order.status === "completed" ? "#dcfce7"
                                                    : order.status === "cancelled" ? "#fee2e2"
                                                    : order.status === "pending" ? "#fef9c3"
                                                    : "#dbeafe",
                                                color: order.status === "completed" ? "#16a34a"
                                                    : order.status === "cancelled" ? "#dc2626"
                                                    : order.status === "pending" ? "#92400e"
                                                    : "#2563eb",
                                            }}
                                        >
                                            {statusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-bold text-[#1D3557]">Monthly Revenue</h2>
                            <p className="text-xs text-gray-400 mt-0.5">Daily breakdown</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => setMonthDropdownOpen(o => !o)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-orange-300 transition-colors"
                                >
                                    {selectedLabel}
                                    <ChevronDown size={12} className={`transition-transform ${monthDropdownOpen ? "rotate-180" : ""}`} />
                                </button>
                                {monthDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setMonthDropdownOpen(false)} />
                                        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 max-h-48 overflow-y-auto">
                                            {monthOptions.map((opt) => (
                                                <button
                                                    key={`${opt.month}-${opt.year}`}
                                                    onClick={() => {
                                                        setSelectedMonth(opt.month);
                                                        setSelectedYear(opt.year);
                                                        setMonthDropdownOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-xs transition-colors"
                                                    style={{
                                                        color: selectedMonth === opt.month && selectedYear === opt.year ? "#FF6B35" : "#374151",
                                                        background: selectedMonth === opt.month && selectedYear === opt.year ? "#fff5f0" : "transparent",
                                                        fontWeight: selectedMonth === opt.month && selectedYear === opt.year ? 600 : 400,
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div
                                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                                style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)" }}
                            >
                                ₱{monthlyTotal.toLocaleString("en-PH", { minimumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 10 }}
                                stroke="#ccc"
                                interval={4}
                                tickFormatter={(v) => `${v}`}
                            />
                            <YAxis tick={{ fontSize: 10 }} stroke="#ccc" tickFormatter={(v) => `₱${v}`} />
                            <Tooltip
                                formatter={(v: any) => [`₱${Number(v).toFixed(2)}`, "Revenue"]}
                                labelFormatter={(l) => `Day ${l}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#FF6B35"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col gap-6">
                    <div
                        className="rounded-xl p-5 pb-6 pl-6 pt-6 shadow-sm flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #2A4A6F 0%, #1D3557 100%)" }}
                    >
                        <h2 className="text-base font-bold text-white mb-4 uppercase tracking-wide">Rating Distribution</h2>
                        <div className="flex items-center gap-6">
                            <div className="text-center flex-shrink-0">
                                <Star className="w-8 h-8 mx-auto mb-1" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                                <p className="text-2xl font-bold text-white">{averageRating?.toFixed(1) ?? "—"}</p>
                                <p className="text-xs text-white/80 mt-0.5">{ratingCount ?? 0} reviews</p>
                            </div>
                            <div className="flex-1 min-w-0 space-y-2">
                                {ratingDistribution.map(({ star, percentage }) => {
                                    const isHighlighted = star === Math.round(averageRating ?? 0);
                                    return (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-sm text-white w-3 flex-shrink-0">{star}</span>
                                            <Star className="w-3 h-3 flex-shrink-0" style={{ fill: "#F4D35E", color: "#F4D35E" }} />
                                            <div
                                                className="flex-1 h-2 rounded-full overflow-hidden"
                                                style={{
                                                    background: "rgba(255,255,255,0.1)",
                                                    border: `1px solid ${isHighlighted ? "#FF6B35" : "rgba(255,255,255,0.15)"}`,
                                                    maxWidth: "75%",
                                                }}
                                            >
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: isHighlighted
                                                            ? "linear-gradient(to right, #FF6B35, #F4D35E)"
                                                            : "rgba(255,255,255,0.35)",
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-white/80 w-7 text-right flex-shrink-0">
                                                {Math.round(percentage)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" style={{ height: "365px" }}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-[#1D3557]">Recent Reviews</h2>
                            <button
                                onClick={() => router.push("/vendor/reviews")}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF6B35] transition-colors"
                            >
                                View all <ExternalLink size={11} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {!recentReviews || recentReviews.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">No reviews yet</p>
                            ) : recentReviews.slice(0, 2).map((review) => ( 
                                <div key={review.review_id} className="rounded-lg p-4 border border-orange-100 bg-orange-50/30">
                                    <div className="flex items-start gap-3">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                                            style={{ background: "linear-gradient(135deg, #FF6B35, #F4D35E)" }}
                                        >
                                            {review.avatar_url
                                                ? <img src={review.avatar_url} alt={review.username} className="w-full h-full object-cover" />
                                                : <span className="text-white text-xs font-bold">{review.username?.charAt(0).toUpperCase() || '?'}</span>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-semibold text-[#1D3557] truncate">{review.username || 'Anonymous'}</p>
                                                <span className="text-[10px] text-gray-400 flex-shrink-0 ml-3">
                                                    {review.created_at ? new Date(review.created_at).toLocaleDateString("en-PH", { month: "short", day: "numeric" }) : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 mb-2">
                                                {[1,2,3,4,5].map(s => (
                                                    <Star key={s} className="w-3.5 h-3.5" style={{
                                                        fill: s <= (review.rating || 0) ? "#F4D35E" : "#E5E7EB",
                                                        color: s <= (review.rating || 0) ? "#F4D35E" : "#E5E7EB",
                                                    }} />
                                                ))}
                                            </div>
                                            {review.review && (
                                                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{review.review}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}