import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale;

  const [messages, defaultMessages] = await Promise.all([
    import(`../../messages/${locale}.json`).then((module) => module.default),
    import("../../messages/en.json").then((module) => module.default),
  ]);

  return {
    locale,
    messages: { ...defaultMessages, ...messages },
  };
});
