import { redirect } from "next/navigation";
import { getStoreProfile } from "@/features/shared/libs/route/route";
import VendorDashboard from "@/features/vendor/components/VendorDashboard";
import StoreSetupWrapper from "@/features/vendor/components/StoreSetupWrapper";

export default async function VendorPage() {
  const { userId, hasStore } = await getStoreProfile();

  if (!userId) redirect("/login");
  if (!hasStore) return <StoreSetupWrapper userId={userId} />;

  return <VendorDashboard />;
}