import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr", "es", "ar", "sw", "pt"],
  defaultLocale: "en",
});
