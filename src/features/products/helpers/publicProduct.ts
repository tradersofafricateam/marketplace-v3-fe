import type { ProductData, ProductDetail, LocalizedText, ProductSeller } from "../types";
import type { PublicProductRecord } from "../api";
const localized = (value: unknown): LocalizedText => typeof value === "string" ? { en: value } : value && typeof value === "object" ? value as LocalizedText : {};
const name = (value: unknown, locale: string) => { const names = localized(value); return names[locale] || names.en || Object.values(names)[0] || ""; };
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" ? value as Record<string, unknown> : {};
const number = (value: unknown, fallback = 0) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
export function publicProductCard(product: PublicProductRecord, locale: string): ProductData {
  const seller = record(product.seller);
  const images = Array.isArray(product.images) ? product.images : [];
  const primary = images.find((image) => record(image).isPrimary) || images[0];
  const image = product.mainImage || (typeof primary === "string" ? primary : record(primary).url);
  if (typeof product.id !== "string") throw new Error("Invalid product response.");
  const productType = String(product.productType).toUpperCase();
  return { ...(productType === "SIMPLE" || productType === "VARIABLE" ? { productType } : {}), id: product.id, slug: product.id, productName: name(product.productName, locale), storeName: String(seller.storeName || seller.companyName || ""),
    currency: String(product.currency || ""), amount: typeof product.finalPrice === "number" ? product.finalPrice : typeof product.price === "number" ? product.price : null, imgUrl: typeof image === "string" ? image : "",
    unit: String(product.unitForMinOrder || ""), totalReviews: number(product.totalReviews), categoryIds: Array.isArray(product.categoryIds) ? product.categoryIds as string[] : [],
    ...(typeof product.isSaved === "boolean" ? { isInWishList: product.isSaved } : {}),
  };
}
export function publicProductDetail(product: PublicProductRecord): ProductDetail {
  const seller = record(product.seller);
  const images = (Array.isArray(product.images) ? [...product.images].sort((a, b) => Number(!!record(b).isPrimary) - Number(!!record(a).isPrimary) || number(record(a).sortOrder) - number(record(b).sortOrder)) : []).map((image) => typeof image === "string" ? image : String(record(image).url || "")).filter(Boolean);
  const type = String(product.productType).toUpperCase();
  if (type !== "SIMPLE" && type !== "VARIABLE") throw new Error("Unsupported product type.");
  return {
    ...product, id: String(product.id), slug: String(product.id), productName: localized(product.productName), productDescription: localized(product.productDescription),
    categoryIds: Array.isArray(product.categoryIds) ? product.categoryIds as string[] : [], countryOfOrigin: String(product.countryOfOrigin || ""), currency: String(product.currency || ""), productType: type,
    price: product.price == null ? null : number(product.price), discount: product.discount == null ? null : number(product.discount), quantity: product.quantity == null ? null : number(product.quantity),
    supplyCapacity: number(product.supplyCapacity), unitForSupplyCapacity: String(product.unitForSupplyCapacity || ""), minOrdersAllowed: number(product.minOrdersAllowed, 1), unitForMinOrder: String(product.unitForMinOrder || ""),
    minDuration: number(product.minDuration), maxDuration: number(product.maxDuration), durationUnit: String(product.durationUnit || "days"), images,
    variantOptions: (product.variantOptions || []) as ProductDetail["variantOptions"], variants: (product.variants || []) as ProductDetail["variants"],
    seller: { ...seller, id: String(seller.id || product.sellerId || ""), slug: String(seller.slug || ""), storeName: String(seller.storeName || seller.companyName || "") } as ProductSeller,
    reviews: (product.reviews || []) as ProductDetail["reviews"], totalReviewCount: number(product.totalReviews), totalAverageReviews: number(product.averageRating),
    ...(typeof product.isSaved === "boolean" ? { isSaved: product.isSaved } : {}),
  };
}
