import { Suspense } from "react";
import StorePage from "@/features/customers/page";

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <img src="/loader.gif" alt="Loading" className="w-24 h-24" />
        </div>
      }
    >
      <StorePage />
    </Suspense>
  );
}