import type { OrderItem } from "@/features/reviews/types/types";
import {
  Home,
  Boxes,
  List,
  Coffee,
  Star,
  MessageCircle,
  LucideIcon
} from "lucide-react";

export type SidebarMenuItemType = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export type DeliveryOption = "Pick-up" | "Food-Delivery" | "both";

export const data: SidebarMenuItemType[] = [
  { icon: Home, label: "Dashboard", href: "/vendor/dashboard" },
  { icon: Boxes, label: "Catalog", href: "/vendor/catalog" },
  { icon: List, label: "Orders", href: "/vendor/orders" },
  { icon: Star, label: "Reviews", href: "/vendor/reviews" },
  { icon: MessageCircle, label: "Messages", href: "/vendor/messages" },
];

export interface StoreFormData {
  storeName: string;
  storeDescription: string;
  address: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  latitude: number | null; 
  longitude: number | null;
  deliveryOptions: DeliveryOption;
}
 
export const INITIAL_FORM: StoreFormData = {
  storeName: '',
  storeDescription: '',
  address: '',
  phone: '',
  openingTime: '',
  closingTime: '',
  latitude: null, 
  longitude: null,
  deliveryOptions: 'Pick-up',
};


export interface StoreSetupProps {
  onComplete?: () => void;
  onSkip?: () => void;
  userId: string;
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