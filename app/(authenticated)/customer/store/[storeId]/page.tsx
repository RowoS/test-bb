import StoreCatalogPage from "@/features/store/pages/StoreCatalogPage";

interface Props {
    params: Promise<{ storeId: string }>;
}

export default async function StorePage({ params }: Props) {
    const { storeId } = await params;

    return <StoreCatalogPage storeId={storeId} />;
}