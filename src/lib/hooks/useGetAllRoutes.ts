"use client";

import { useLocale } from "next-intl";

export const useGetAllRoutes = () => {
  const locale = useLocale();

  const routes = {
    home: `/${locale}`,
    ourImpact: `/${locale}/our-impact`,
    whatWeDo: `/${locale}/what-we-do`,
    ourStory: `/${locale}/our-story`,
    cart: `/${locale}/cart`,
    categories: `/${locale}/categories`,
    categoryInfo: (id: string) => `/${locale}/categories/${id}`,
    login: `/${locale}/login`,
    register: `/${locale}/register`,
    forgotPassword: `/${locale}/forgot-password`,
    resetPassword: `/${locale}/reset-password`,
    overview: `/${locale}/dashboard/overview`,
    product: `/${locale}/product`,
    productInfo: (id: string) => `/${locale}/products/info/${id}`,
    orders: `/${locale}/dashboard/orders`,
    orderInfo: (id: string) => `/${locale}/dashboard/orders/info/${id}`,
    sellerProduct: `/${locale}/dashboard/products`,
    sellerProductInfo: (id: string) =>
      `/${locale}/dashboard/products/info/${id}`,

    quotes: `/${locale}/dashboard/quotes`,
    quoteInfo: (id: string) => `/${locale}/dashboard/quotes/info/${id}`,
    settings: `/${locale}/dashboard/settings`,
    becomeSeller: `/${locale}/become-seller`,
  };
  return { routes };
};
