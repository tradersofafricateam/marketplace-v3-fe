import type { ChangeEvent } from "react";
import type { LucideIcon } from "lucide-react";
import type { LocalizedText, ProductType } from "@/features/products/types";

export type { LocalizedText, ProductType };

export type ProductStatus = "draft" | "active" | "inactive" | "archived" | "deleted";
export type InventoryStatus = "in_stock" | "out_of_stock";

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
};

export type ProductVariantOption = {
  id?: string;
  productId?: string;
  name: string;
  values: string[];
  sortOrder: number;
};

export type ProductVariant = {
  id?: string;
  productId?: string;
  sku?: string;
  attributes: Record<string, string>;
  price: number;
  discount: number | null;
  quantity: number;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type SellerProduct = {
  id: string;
  sellerId: string;
  productName: LocalizedText;
  productDescription: LocalizedText;
  categoryIds: string[];
  countryOfOrigin: string;
  currency: string;
  price: number | null;
  discount: number | null;
  quantity: number | null;
  productType: ProductType;
  barcode?: string | null;
  supplyCapacity: number;
  unitForSupplyCapacity: string;
  minOrdersAllowed: number;
  unitForMinOrder: string;
  minDuration: number;
  maxDuration: number;
  durationUnit: string;
  status: ProductStatus;
  inventoryStatus: InventoryStatus;
  totalStock: number;
  images: ProductImage[];
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type SellerProductListItem = Pick<
  SellerProduct,
  | "id"
  | "productName"
  | "status"
  | "inventoryStatus"
  | "price"
  | "currency"
  | "productType"
  | "totalStock"
  | "images"
  | "updatedAt"
>;

/** Fields the seller supplies. Ids, status, inventoryStatus, totalStock and sku are backend-owned. */
export type CreateProductPayload = {
  productName: LocalizedText;
  productDescription: LocalizedText;
  categoryIds: string[];
  countryOfOrigin: string;
  currency: string;
  productType: ProductType;
  price: number | null;
  discount: number | null;
  quantity: number | null;
  barcode?: string | null;
  supplyCapacity: number;
  unitForSupplyCapacity: string;
  minOrdersAllowed: number;
  unitForMinOrder: string;
  minDuration: number;
  maxDuration: number;
  durationUnit: string;
  variantOptions: Omit<ProductVariantOption, "id" | "productId">[];
  variants: Omit<ProductVariant, "id" | "productId" | "sku" | "createdAt" | "updatedAt" | "image">[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type SellerProductsQuery = {
  status?: ProductStatus;
  search?: string;
  page?: number;
};

export type SellerProductsPage = {
  items: SellerProductListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type { Category } from "@/features/categories/types";

/** In-memory wizard state - values only, no ids and no backend-owned fields. */
export type ProductFormState = {
  productName: string;
  productDescription: string;
  categoryIds: string[];
  countryOfOrigin: string;
  currency: string;
  productType: ProductType;
  price: string;
  discount: string;
  quantity: string;
  barcode: string;
  supplyCapacity: string;
  unitForSupplyCapacity: string;
  minOrdersAllowed: string;
  unitForMinOrder: string;
  minDuration: string;
  maxDuration: string;
  durationUnit: string;
  variantOptions: ProductVariantOption[];
  variants: ProductVariant[];
  galleryImages: File[];
  primaryImageIndex: number;
  variantImagesByColor: Record<string, File>;
};

export type ProductFormErrors = Partial<Record<keyof ProductFormState, string>>;

/** Shared prop shape every wizard step organism receives from ProductWizardTemplate. */
export type ProductFormHandlers = {
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFieldValue: <K extends keyof ProductFormState>(name: K, value: ProductFormState[K]) => void;
};

export type WizardStep = {
  key: string;
  label: string;
  icon: LucideIcon;
};
