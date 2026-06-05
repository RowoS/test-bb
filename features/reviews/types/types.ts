export type OrderItem = {
    order_item_id: string;
    item_id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    image: string | null;
};

export type CustomerOrder = {
    order_id: string;
    store_id: string;
    store_name: string;
    status: string;
    fulfillment: "pickup" | "delivery";
    subtotal: number;
    delivery_fee: number;
    total: number;
    notes: string | null;
    delivery_landmark: string | null;
    delivery_barangay: string | null;
    delivery_city: string | null;
    address: string;
    latitude: number;
    longitude: number;
    cancel_reason: string | null;
    created_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
    completed_at: string | null;
    payment_status: string;
    review_id: string | null;
    items: OrderItem[];
}

export interface ReviewModalProps {
  order: CustomerOrder;
  onClose: () => void;
  onSubmitted: () => void;
}

export type StoreReview = {
  review_id: string;
  order_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  review: string | null;
  created_at: string;
  username: string;
  avatar_url: string | null;
};

export type StoreReviewsMeta = {
  reviews: StoreReview[] | null;
  average_rating: number | null;
  rating_count: number | null;
};


export type UseStoreReviewsReturn = {
  reviews: StoreReview[];
  averageRating: number | null;
  ratingCount: number | null;
  filteredReviews: StoreReview[];
  visibleReviews: StoreReview[];
  filter: ReviewFilter;
  search: string;
  isLoading: boolean;
  error: string | null;
  showAll: boolean;
  remainingCount: number;
  setFilter: (filter: ReviewFilter) => void;
  setSearch: (search: string) => void;
  expandAll: () => void;
  refetch: () => void;
};

export type ReviewFilter = "all" | "1" | "2" | "3" | "4" | "5";