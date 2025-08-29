import { Suspense } from "react";
import InformasiUmum from "@components/sections/perencanaan-data/informasi-umum/informasi-umum";

export default function Page() {
  return (
    <div className="p-8">
      <Suspense fallback={null}>
        <InformasiUmum />
      </Suspense>
    </div>
  );
}
