import type { InventoryStatus, ProductStatus, SellerProductListItem, SellerProductsPage } from "../types";

type RecordValue = Record<string, unknown>;
function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid products response. Please try again.");
  return value as RecordValue;
}
function nonNegativeInteger(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error("Invalid products pagination or stock value.");
  return value;
}
function text(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("Invalid product details.");
  return value;
}
function amount(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw new Error("Invalid product price.");
  return value;
}
const statuses: ProductStatus[] = ["draft", "active", "inactive", "archived", "deleted"];
const inventoryStatuses: InventoryStatus[] = ["in_stock", "out_of_stock"];

/** Convert the wire envelope to the list view model; never turn malformed data into an empty catalogue. */
export function normalizeSellerProducts(value: unknown): SellerProductsPage {
  const response = record(value);
  if (response.success === false) throw new Error("Could not load your products. Please try again.");
  if (!Array.isArray(response.data)) throw new Error("Invalid products response. Please try again.");
  const pagination = record(response.pagination);
  const page = nonNegativeInteger(pagination.page);
  const pageSize = nonNegativeInteger(pagination.limit);
  const total = nonNegativeInteger(pagination.total);
  const totalPages = nonNegativeInteger(pagination.totalPages);
  if (!page || !pageSize) throw new Error("Invalid products pagination.");
  const items = response.data.map((entry): SellerProductListItem => {
    const product = record(entry);
    const names = record(product.productName);
    if (!Object.keys(names).length || Object.values(names).some((name) => typeof name !== "string")) throw new Error("Invalid product name.");
    const productType = text(product.productType).toUpperCase();
    if (productType !== "SIMPLE" && productType !== "VARIABLE") throw new Error("Unsupported product type.");
    if (!statuses.includes(product.status as ProductStatus) || !inventoryStatuses.includes(product.inventoryStatus as InventoryStatus)) throw new Error("Unsupported product status.");
    if (!Array.isArray(product.images)) throw new Error("Invalid product images.");
    return {
      id: text(product.id), productName: names as Record<string, string>,
      status: product.status as ProductStatus, inventoryStatus: product.inventoryStatus as InventoryStatus,
      productType, currency: text(product.currency), price: amount(product.price), finalPrice: amount(product.finalPrice),
      totalStock: nonNegativeInteger(product.totalStock), updatedAt: text(product.updatedAt),
      mainImage: product.mainImage == null ? null : text(product.mainImage),
      images: product.images.map((image) => { const data = record(image); return { url: text(data.url), isPrimary: data.isPrimary === true }; }),
    };
  });
  return { items, page, pageSize, total, totalPages };
}
