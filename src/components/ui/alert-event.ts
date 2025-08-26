export type Sev = "success" | "error" | "info" | "warning";

const EVENT_NAME = "app:alert";

export function emitAlert(message: string, severity: Sev = "info") {
  if (typeof window === "undefined") return;
  const evt = new CustomEvent(EVENT_NAME, { detail: { message, severity } });
  window.dispatchEvent(evt);
}

export function onAlert(handler: (msg: string, sev: Sev) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const { message, severity } = (e as CustomEvent).detail || {};
    if (message) handler(message, severity);
  };
  window.addEventListener(EVENT_NAME, listener as EventListener);
  return () =>
    window.removeEventListener(EVENT_NAME, listener as EventListener);
}
