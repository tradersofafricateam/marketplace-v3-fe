import { axiosInstance } from "@/lib/axiosInstance";
import type {
  CreateProductPayload,
  ProductImage,
  SellerProduct,
  SellerProductsPage,
  SellerProductsQuery,
  ProductStatus,
  UpdateProductPayload,
} from "../types";

function unwrapData<T>(response: T | { data: T }): T {
  return typeof response === "object" && response !== null && "data" in response
    ? (response as { data: T }).data
    : (response as T);
}

export const getSellerProducts = async (
  query: SellerProductsQuery = {},
): Promise<SellerProductsPage> => {
  const { data } = await axiosInstance.get<SellerProductsPage | { data: SellerProductsPage }>(
    "/seller/products",
    { params: query },
  );
  return unwrapData(data);
};

export const getSellerProduct = async (id: string): Promise<SellerProduct> => {
  const { data } = await axiosInstance.get<SellerProduct | { data: SellerProduct }>(
    `/seller/products/${id}`,
  );
  return unwrapData(data);
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<SellerProduct> => {
  const { data } = await axiosInstance.post<SellerProduct | { data: SellerProduct }>(
    "/products/",
    payload,
  );
  return unwrapData(data);
};

export const updateProduct = async ({
  id,
  payload,
}: {
  id: string;
  payload: UpdateProductPayload;
}): Promise<SellerProduct> => {
  const { data } = await axiosInstance.patch<SellerProduct | { data: SellerProduct }>(
    `/seller/products/${id}`,
    payload,
  );
  return unwrapData(data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/seller/products/${id}`);
};

export const updateProductStatus = async ({
  id,
  status,
}: {
  id: string;
  status: ProductStatus;
}): Promise<SellerProduct> => {
  const { data } = await axiosInstance.patch<SellerProduct | { data: SellerProduct }>(
    `/seller/products/${id}/status`,
    { status },
  );
  return unwrapData(data);
};

export const uploadProductImages = async ({
  productId,
  files,
  primaryIndex,
}: {
  productId: string;
  files: File[];
  primaryIndex?: number;
}): Promise<ProductImage[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  if (primaryIndex !== undefined) formData.append("primaryIndex", String(primaryIndex));

  const { data } = await axiosInstance.post<ProductImage[] | { data: ProductImage[] }>(
    `/seller/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": undefined } },
  );
  return unwrapData(data);
};

export const deleteProductImage = async ({
  productId,
  imageId,
}: {
  productId: string;
  imageId: string;
}): Promise<void> => {
  await axiosInstance.delete(`/seller/products/${productId}/images/${imageId}`);
};

export const setPrimaryProductImage = async ({
  productId,
  imageId,
}: {
  productId: string;
  imageId: string;
}): Promise<void> => {
  await axiosInstance.patch(`/seller/products/${productId}/images/${imageId}/primary`);
};

export const uploadVariantImage = async ({
  productId,
  color,
  file,
}: {
  productId: string;
  color: string;
  file: File;
}): Promise<{ color: string; url: string }> => {
  const formData = new FormData();
  formData.append("color", color);
  formData.append("image", file);

  const { data } = await axiosInstance.post<
    { color: string; url: string } | { data: { color: string; url: string } }
  >(`/seller/products/${productId}/variant-images`, formData, {
    headers: { "Content-Type": undefined },
  });
  return unwrapData(data);
};


