import { createClient } from '@/lib/supabase/client';
import { StoreReviewsMeta } from '../types/types';

export async function getOrderReview(orderId: string) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_order_review', { p_order_id: orderId });
    if (error) throw new Error(error.message);
    return data?.[0] ?? null;
}

export async function submitOrderReview(payload: {
    order_id:  string;
    store_id:  string;
    rating:    number;
    review?:   string;
}) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
        .from('order_reviews')
        .upsert({
            ...payload,
            customer_id: user.id,
        }, {
            onConflict: 'order_id, customer_id',
        });

    if (error) throw new Error(error.message);
}

export async function deleteOrderReview(reviewId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('order_reviews')
        .delete()
        .eq('id', reviewId);
    if (error) throw new Error(error.message);
}

export async function getStoreReviews(): Promise<StoreReviewsMeta | null> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) throw new Error(`Auth error: ${authError.message}`);

    const { data, error } = await supabase.rpc('get_store_reviews_with_meta', { 
            p_store_id: user?.id 
        });
    
    if (error) throw new Error(error.message);
    

    return data ?? null;
}