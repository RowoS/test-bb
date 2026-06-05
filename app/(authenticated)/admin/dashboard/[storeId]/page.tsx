import StoreReportWrapper from "@/features/admin/components/StoreReportWrapper";

export default async function Page({ params }: { params: Promise<{ storeId: string }> }) {
    return <StoreReportWrapper params={params} />;
}

