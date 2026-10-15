import { normalizeSellerProducts } from "../helpers/normalizeSellerProducts";
import { axiosInstance } from "@/lib/axiosInstance";
import type {
  CreateProductPayload,
  SellerProduct,
  SellerProductsPage,
  SellerProductsQuery,
  ProductStatus,
  UpdateProductPayload,
} from "../types";

/** Product endpoints may wrap their result in multiple success/data envelopes. */
function unwrapData<T>(response: T | { data: T }): T {
  let result: unknown = response;
  while (typeof result === "object" && result !== null) {
    if ("success" in result && result.success === false) {
      throw new Error("Product request failed. Please try again.");
    }
    if (!("data" in result)) break;
    result = result.data;
  }
  return result as T;
}

export const getSellerProducts = async (
  query: SellerProductsQuery = {},
  signal?: AbortSignal,
): Promise<SellerProductsPage> => {
  const { search, ...filters } = query;
  const term = search?.trim();
  const { data } = await axiosInstance.get<unknown>("/products/mine", {
    params: { ...filters, ...(term ? { search: term } : {}) },
    signal,
  });
  return normalizeSellerProducts(data);
};

export const getSellerProduct = async (
  id: string,
  lang?: string,
  signal?: AbortSignal,
): Promise<SellerProduct> => {
  const { data } = await axiosInstance.get<
    SellerProduct | { data: SellerProduct }
  >(`/products/mine/${encodeURIComponent(id)}`, { params: { lang }, signal });
  const product = unwrapData(data);
  return {
    ...product,
    productType: String(
      product.productType,
    ).toUpperCase() as SellerProduct["productType"],
    images: product.images ?? [],
    variants: product.variants ?? [],
    variantOptions: product.variantOptions ?? [],
  };
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<SellerProduct> => {
  const { data } = await axiosInstance.post<
    SellerProduct | { data: SellerProduct }
  >("/products/", payload, { headers: { "Content-Type": undefined } });
  const product = unwrapData(data);
  if (typeof product?.id !== "string" || !product.id.trim()) {
    throw new Error("The product response did not include a product ID. Check your products before trying again.");
  }
  return product;
};

export const updateProduct = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateProductPayload;
}): Promise<SellerProduct> => {
  const { data } = await axiosInstance.patch<
    SellerProduct | { data: SellerProduct }
  >(`/products/${encodeURIComponent(id)}`, payload, { headers: { "Content-Type": undefined } });
  return unwrapData(data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${encodeURIComponent(id)}`);
};

export const updateProductStatus = async ({
  id,
  status,
}: {
  id: string;
  status: ProductStatus;
}): Promise<SellerProduct> => {
  const { data } = await axiosInstance.patch<
    SellerProduct | { data: SellerProduct }
  >(`/products/${encodeURIComponent(id)}/status`, { status });
  return unwrapData(data);
};

export const deleteProductImage = async ({
  productId,
  imageId,
}: {
  productId: string;
  imageId: string;
}): Promise<void> => {
  await axiosInstance.delete(
    `/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
  );
};

export type InventoryPayload = {
  quantity?: number;
  variants?: { variantId: string; quantity: number }[];
};
export const updateProductInventory = async (
  id: string,
  payload: InventoryPayload,
) => {
  const { data } = await axiosInstance.patch(
    `/products/${encodeURIComponent(id)}/inventory`,
    payload,
  );
  return unwrapData(data);
};
