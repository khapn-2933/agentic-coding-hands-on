import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { DEFAULT_LOCALE, isLocale } from "./locale";

export default getRequestConfig(async () => {
  const stored = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = isLocale(stored) ? stored : DEFAULT_LOCALE;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
