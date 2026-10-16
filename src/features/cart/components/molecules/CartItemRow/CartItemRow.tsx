"use client";
import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import type { CartItem } from "../../../types";
import { validCartQuantity } from "../../../helpers/cartRules";
import CartMoney from "../../atoms/CartMoney/CartMoney";

type Props = { item: CartItem; disabled: boolean; onUpdate: (id: string, quantity: number) => void; onRemove: (id: string) => void };
function CartItemRow({ item, disabled, onUpdate, onRemove }: Props) {
  const t = useTranslations("CartPage");
  const { routes } = useGetAllRoutes();
  const [value, setValue] = useState(String(item.quantity));
  const quantity = Number(value);
  const valid = value.trim() !== "" && validCartQuantity(quantity, item);
  const currentValid = validCartQuantity(item.quantity, item);
  return <article className="grid gap-4 py-6 sm:grid-cols-[96px_minmax(0,1fr)_auto]">
    <Link href={routes.productInfo(item.productId)} className="relative flex size-24 items-center justify-center overflow-hidden rounded-xl bg-muted/50">
      {item.mainImage ? <Image src={item.mainImage} alt={item.productName} fill sizes="96px" className="object-contain p-2" /> : <Package aria-hidden size={28} className="text-muted-foreground" />}
    </Link>
    <div className="min-w-0 space-y-2">
      <Link href={routes.productInfo(item.productId)} className="font-semibold hover:text-(--orange)">{item.productName}</Link>
      {item.attributes && <p className="text-xs text-muted-foreground">{Object.entries(item.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p>}
      <p className="text-sm"><CartMoney amount={item.finalUnitPrice} currency={item.currency} /> <span className="text-muted-foreground">/ {item.minimumOrder.unit}</span> {item.unitPrice > item.finalUnitPrice && <del className="ml-2 text-xs text-muted-foreground"><CartMoney amount={item.unitPrice} currency={item.currency} /></del>}</p>
      <p className="text-xs text-muted-foreground">{t("minimum", { quantity: item.minimumOrder.quantity, unit: item.minimumOrder.unit })} · {t("available", { quantity: item.availableQuantity })}</p>
      {!currentValid && <p role="alert" className="text-xs text-destructive">{t("stockChanged")}</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <label className="sr-only" htmlFor={`qty-${item.cartItemId}`}>{t("quantityFor", { name: item.productName })}</label>
        <input id={`qty-${item.cartItemId}`} type="number" inputMode="decimal" step="any" min={item.minimumOrder.quantity} max={item.availableQuantity} value={value} onChange={(event) => setValue(event.target.value)} disabled={disabled} aria-invalid={!valid} aria-describedby={!valid ? `qty-error-${item.cartItemId}` : undefined} className="h-10 w-24 rounded-lg border border-border bg-background px-3 text-sm disabled:opacity-50" />
        <button type="button" disabled={disabled || !valid || quantity === item.quantity} onClick={() => onUpdate(item.cartItemId, quantity)} className="rounded-lg px-3 py-2 text-xs font-semibold text-(--orange) hover:bg-(--orange-light) disabled:opacity-40">{t("update")}</button>
        <button type="button" disabled={disabled} onClick={() => onRemove(item.cartItemId)} aria-label={t("removeName", { name: item.productName })} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-xs text-muted-foreground hover:text-destructive disabled:opacity-40"><Trash2 size={14} />{t("remove")}</button>
      </div>
      {!valid && <p id={`qty-error-${item.cartItemId}`} className="text-xs text-destructive">{t("quantityError", { min: item.minimumOrder.quantity, max: item.availableQuantity })}</p>}
    </div>
    <div className="text-right text-sm font-bold"><CartMoney amount={item.subtotal} currency={item.currency} /></div>
  </article>;
}
export default memo(CartItemRow);
