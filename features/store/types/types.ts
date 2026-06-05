

export type MenuVariant = {
    id: string;
    name: string;
    option: string;
    price_modifier: number;
};

export type MenuItem = {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    is_available: boolean;
    variants: MenuVariant[] | null;
};

export type MenuCategory = {
    id: string;
    name: string;
    display_order: number;
    items: MenuItem[] | null;
};

export interface StoreHeaderProps {
    name: string;
    description: string | null;
    rating?: number | null;
    storeId: string;
    onSubmitReport: (reason: ReportReason, notes: string, storeId: string) => Promise<void>;
    isSubmittingReport: boolean;
}

export interface MenuGridProps {
    categories: MenuCategory[];
    isLoading: boolean;
    searchQuery: string;
    activeTab: string;
    tabs: string[];
    onSearchChange: (q: string) => void;
    onTabChange: (tab: string) => void;
    onAddToCart: (item: MenuItem) => void;
    
}


export type CartItem = {
    id: string;
    cart_id: string;
    item_id: string;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
};



export interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    total: number;
    count: number;
    onUpdateQty: (cartItemId: string, qty: number) => void;
    onRemoveItem: (cartItemId: string) => void;
    onClearCart: () => void;
    onCheckout?: () => void;
    storeName?: string;
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

export type ReviewFilter = "all" | "1" | "2" | "3" | "4" | "5";

export type Report = {
    storeId: string;
    reason: ReportReason;
    notes?: string | null;
}

export enum ReportReason {
    Scam = "Scam or Fraudulent Activity",
    SellingRestrictedItems = "Selling Restricted or Illegal Items",
    FakeListings = "Fake or Misleading Listings",
    Harassment = "Harassment or Inappropriate Behavior",
    HealthSafety = "Health and Safety Violations",
};

export interface ReportStoreModalProps {
    storeId: string;
    storeName: string;
    onClose: () => void;
    onSubmit: (reason: ReportReason, notes: string, storeId: string) => Promise<void>;
    isSubmitting: boolean;
}


