import { useCallback } from "react";

export default function useIframeResize(setIframeHeight: (h: number) => void) {
  const handleIframeResize = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.height) {
        setIframeHeight(event.data.height);
      }
    },
    [setIframeHeight]
  );

  return { handleIframeResize };
}
