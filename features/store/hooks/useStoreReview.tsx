'use client';
import { useState, useEffect, useCallback } from "react";
import type { StoreReview, ReviewFilter, StoreReviewsMeta } from "../types/types";
import { getStoreReviews } from "../libs/store-actions";

const PAGE_SIZE = 5;

export function useStoreReview(storeId: string) {
    const [data, setData] = useState<StoreReviewsMeta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<ReviewFilter>("all");
    const [showAll, setShowAll] = useState(false);

    const fetchReviews = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const reviewsData = await getStoreReviews(storeId);
            setData(reviewsData);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [storeId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    useEffect(() => {
        setShowAll(false);
    }, [filter]);

    const reviews = data?.reviews ?? [];
    
    const filteredReviews = reviews.filter((review) => {
        const matchesFilter = filter === "all" || review.rating === parseInt(filter);
        return matchesFilter;
    });

    const visibleReviews = showAll 
        ? filteredReviews 
        : filteredReviews.slice(0, PAGE_SIZE);
    
    const remainingCount = Math.max(0, filteredReviews.length - PAGE_SIZE);

    return {
        values: {
            reviews,
            averageRating: data?.average_rating ?? null,
            ratingCount: data?.rating_count ?? null,
            filteredReviews,
            visibleReviews,
            filter,
            isLoading,
            error,
            showAll,
            remainingCount,
        },
        functions: {
            setFilter,
            expandAll: () => setShowAll(true),
            refetch: fetchReviews,
        },
        refetch: fetchReviews,
    };
}