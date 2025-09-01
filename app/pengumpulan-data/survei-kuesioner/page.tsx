import { Suspense } from "react";
import ClientPage from "./client-page";

export const dynamic = "force-static";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Memuat…</div>}>
      <ClientPage />
    </Suspense>
  );
}
