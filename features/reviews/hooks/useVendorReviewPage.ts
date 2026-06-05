
'use client';
import { useState, useEffect, useCallback } from "react";
import type { StoreReview, ReviewFilter} from "../types/types";
import { getStoreReviews } from "../libs/review-actions";

const PAGE_SIZE = 5;

export function useStoreReviews() {
  const [reviews, setReviews] = useState<StoreReview[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingCount, setRatingCount] = useState<number | null>(null);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const meta = await getStoreReviews();
      setReviews(meta?.reviews ?? []);
      setAverageRating(meta?.average_rating ?? null);
      setRatingCount(meta?.rating_count ?? null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false); // this was empty
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    setShowAll(false);
  }, [filter, search]);

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter =
      filter === "all" || review.rating === parseInt(filter);

    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      review.username.toLowerCase().includes(q) ||
      review.review?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const visibleReviews = showAll
    ? filteredReviews
    : filteredReviews.slice(0, PAGE_SIZE);

  const remainingCount = Math.max(0, filteredReviews.length - PAGE_SIZE);

  return {
    values: {reviews, averageRating, ratingCount, filteredReviews, visibleReviews, filter, search, isLoading, error, showAll, remainingCount},
    functions: { setFilter, setSearch, expandAll: () => setShowAll(true), refetch: fetchReviews },
    refetch: fetchReviews,
  };
}