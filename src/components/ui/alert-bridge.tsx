"use client";
import * as React from "react";
import { useAlert } from "@components/ui/alert";
import { onAlert, type Sev } from "@components/ui/alert-event";

export default function AlertBridge() {
  const { show } = useAlert();
  React.useEffect(() => {
    const unsub = onAlert((msg: string, sev: Sev) => show(msg, sev));
    return unsub;
  }, [show]);
  return null;
}
