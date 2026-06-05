import { AdminStoreReportDetail } from "./AdminStoreReportDetails";
import { createClient } from "@/lib/supabase/server";

export default async function StoreReportWrapper({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("stores")
        .select("store_name, is_banned")
        .eq("id", storeId)
        .single();

    return (
        <AdminStoreReportDetail
            storeId={storeId}
            storeName={data?.store_name ?? "Unknown Store"}
            isBanned={data?.is_banned ?? false}
        />
    );
}