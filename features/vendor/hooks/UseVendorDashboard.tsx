'use client';
import { useState, useEffect, useCallback } from "react";
import { getVendorOrders } from "@/features/order/libs/order-actions";
import { getStoreReviews } from "@/features/reviews/libs/review-actions";
import { VendorOrder, StoreReview } from "../types/types";

export function useVendorDashboard() {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [reviews, setReviews] = useState<StoreReview[]>([]);
    const [averageRating, setAverageRating] = useState<number | null>(null);
    const [ratingCount, setRatingCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = useCallback(async () => {
        setIsLoading(true);
        try {
            const [ordersData, reviewsMeta] = await Promise.all([
                getVendorOrders(),
                getStoreReviews(),
            ]);
            setOrders(ordersData);
            setReviews(reviewsMeta?.reviews ?? []);
            setAverageRating(reviewsMeta?.average_rating ?? null);
            setRatingCount(reviewsMeta?.rating_count ?? null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    const completed = orders.filter(o => o.status === "completed");
    const pending   = orders.filter(o => o.status === "pending");
    const running   = orders.filter(o => ["confirmed","preparing","ready_for_pickup","out_for_delivery","stand_by"].includes(o.status));

    const totalRevenue = completed.reduce((sum, o) => sum + o.total, 0);

    const getDailyRevenue = (month: number, year: number) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const revenue = completed
                .filter(o => {
                    const d = new Date(o.completed_at ?? o.created_at);
                    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
                })
                .reduce((sum, o) => sum + o.total, 0);
            return { name: `${day}`, revenue };
        });
    };

    return {
        values: {
            isLoading, error,
            totalRevenue,
            counts: {
                total: orders.length,
                pending: pending.length,
                running: running.length,
                completed: completed.length,
            },
            getDailyRevenue,
            allReviews: reviews,
            recentReviews: reviews.slice(0, 2),
            averageRating, ratingCount,
            pending, running, completed,
        },
    };
}