export type Barangay = {
    id: string;
    barangay: string;
    city: string;
};

export type StoreResult = {
    id: string;
    store_name: string;
    store_description: string | null;
    store_logo: string | null;
    address: string;
    phone_numbers: string[];
    latitude?: number;
    longitude?: number;
    barangay_id?: string;
    barangay_name?: string;
    average_rating?: number | null;
};

export type Tab = "shops" | "delivery" | "cart" | "chats";

export type TabBarProps = {
    activeTab: Tab;
    onChange: (tab: Tab) => void;
    rightSlot?: React.ReactNode;
};



export type SearchTabProps = {
    searchMode: "barangay" | "text";
    textQuery: string;
    barangays: Barangay[];
    selectedBarangay: Barangay | null;
    isLoadingBarangays: boolean;
    isLoadingStores: boolean;
    onModeSwitch: (mode: "barangay" | "text") => void;
    onSelectBarangay: (barangay: Barangay) => void;
    onClearSelection: () => void;
    onTextChange: (value: string) => void;
    onSearch: () => void;
};

export type StoreCardProps = {
    store: StoreResult;
    onHover: (id: string) => void;
    onLeave: () => void;
};

export type CartsViewProps = {
    cartsByStore: CartByStore[];
    isLoading: boolean;
    totalItems: number;
    onUpdateQty: (cartItemId: string, cartId: string, qty: number) => void;
    onRemoveItem: (cartItemId: string, cartId: string) => void;
};

export type CartByStore = {
    store_id: string;
    cart_id: string;
    store_name: string;
    items: AllCartItem[];
    subtotal: number;
};

export type AllCartItem = {
    id: string;
    cart_id: string;
    item_id: string;
    name: string;
    price: number;
    image: string | null;
    quantity: number;
    store_id: string;
    store_name: string;
};
 
export interface CheckoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cart: CartByStore;
}

export enum FulfillmentType {
    pickup, 
    delivery
}

export enum delivery_methods {
    pickup = "Pick-up",
    delivery = "Food-Delivery",
    both = "both"
}

export const barangayCache = { data: null as Barangay[] | null };