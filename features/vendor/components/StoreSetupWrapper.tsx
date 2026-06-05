"use client";
import { useRouter } from "next/navigation";
import StoreSetup from "./forms/InitialSetUpForm";

export default function StoreSetupWrapper({ userId }: { userId: string }) {
  const router = useRouter();

  return (
    <StoreSetup
      userId={userId}
      onComplete={() => router.push("/vendor/dashboard")}
    />
  );
}