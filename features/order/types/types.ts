export type OrderItem = {
    order_item_id: string;
    item_id: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
    image: string | null;
};

export type VendorOrder = {
    order_id: string;
    customer_id: string;
    customer_name: string | null;
    customer_avatar: string | null; 
    status: string;
    fulfillment: "pickup" | "delivery";
    subtotal: number;
    delivery_fee: number;
    total: number;
    notes: string | null;
    delivery_landmark: string | null;
    delivery_barangay: string | null;
    delivery_city: string | null;
    latitude: number;
    longitude: number;
    cancel_reason: string | null;
    created_at: string;
    confirmed_at: string | null;
    cancelled_at: string | null;
    completed_at: string | null;
    payment_status: string;
    items: OrderItem[];
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

export interface OrderMapProps {
  isOpen: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  address: string;
}