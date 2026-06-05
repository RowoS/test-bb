    'use client';

    import { useState, useEffect } from 'react';
    import { getOrderReview, submitOrderReview, deleteOrderReview } from '../libs/review-actions';
    import { CustomerOrder } from '../types/types';

    export function useReviewModal(order: CustomerOrder, onClose: () => void, onSubmitted: () => void) {
    const [rating, setRating]           = useState(0);
    const [hovered, setHovered]         = useState(0);
    const [review, setReview]           = useState('');
    const [reviewId, setReviewId]       = useState<string | null>(null);
    const [isLoading, setLoading]       = useState(true);
    const [isSubmitting, setSubmitting] = useState(false);
    const [error, setError]             = useState<string | null>(null);

    useEffect(() => {
        async function load() {
        try {
            const data = await getOrderReview(order.order_id);
            if (data?.review_id) {
            setReviewId(data.review_id);
            setRating(data.rating ?? 0);
            setReview(data.review ?? '');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }
        load();
    }, [order.order_id]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    async function handleSubmit() {
        if (rating === 0) { setError('Please select a rating.'); return; }
        setSubmitting(true);
        setError(null);
        try {
        await submitOrderReview({
            order_id: order.order_id,
            store_id: order.store_id,
            rating,
            review:   review.trim() || undefined,
        });
        onSubmitted();
        } catch (err: any) {
        setError(err.message);
        } finally {
        setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!reviewId) return;
        setSubmitting(true);
        setError(null);
        try {
        await deleteOrderReview(reviewId);
        onSubmitted();
        } catch (err: any) {
        setError(err.message);
        } finally {
        setSubmitting(false);
        }
    }

    function handleBackdrop(e: React.MouseEvent) {
        if (e.target === e.currentTarget) onClose();
    }

    const ratingLabel = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hovered || rating] ?? '';

    return {
        values: { rating, hovered, review, reviewId, isLoading, isSubmitting, error, ratingLabel },
        functions: { setRating, setHovered, setReview, handleSubmit, handleDelete, handleBackdrop },
    };
    }