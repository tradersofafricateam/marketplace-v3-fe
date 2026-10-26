"use client";
import { useEffect, useState } from "react";
import type { DeliveryOptions } from "../types";

/** Schedule one update at each quote expiry instead of polling the page. */
export function useQuoteClock(options?: DeliveryOptions) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const current = Date.now();
      setNow(current);
      const expiries = options?.sellerGroups.flatMap((group) => group.integratedOptions.map((quote) => new Date(quote.expiresAt).getTime())).filter((expiry) => expiry > current) ?? [];
      if (expiries.length) {
        timer = setTimeout(tick, Math.min(Math.min(...expiries) - current + 20, 2_147_483_647));
      }
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [options]);
  return now;
}
