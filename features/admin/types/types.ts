export type StoreReportSummary = {
    store_id: string;
    store_name: string;
    store_logo: string | null;
    report_count: number;
    latest_report_at: string | null;
};

export type StoreReportDetail = {
    report_id: string;
    reason: string;
    notes: string | null;
    created_at: string;
    customer_username: string;
    customer_avatar: string | null;
};

export interface BanStoreModalProps {
    storeName: string;
    onConfirm: (reason: string) => Promise<void>;
    onClose: () => void;
}

export interface DeleteStoreModalProps {
    storeName: string;
    onConfirm: () => Promise<void>;
    onClose: () => void;
}

export enum BAN_REASONS {
    SCAM_OR_FRAUDULENT_ACTIVITY = "Scam or Fraudulent Activity",
    SELLING_RESTRICTED_OR_ILLEGAL_ITEMS = "Selling Restricted or Illegal Items",
    REPEATED_POLICY_VIOLATIONS = "Repeated Policy Violations",
    HARASSMENT_OF_CUSTOMERS = "Harassment of Customers",
    HEALTH_AND_SAFETY_VIOLATIONS = "Health and Safety Violations",
}

