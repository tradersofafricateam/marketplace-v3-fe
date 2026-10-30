"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle, Package, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { purchaseFocus, purchaseInput, purchaseText } from "@/lib/constants/purchaseStyles";
import type { CartItem } from "../../../types";
import { validCartQuantity } from "../../../helpers/cartRules";
import { useCartActions } from "../../../hooks/useCartActions";
import CartMoney from "../../atoms/CartMoney/CartMoney";

export default function CartItemRow({ item, disabled }: { item: CartItem; disabled: boolean }) {
  const t = useTranslations("CartPage");
  const { routes } = useGetAllRoutes();
  const action = useCartActions();
  const [value, setValue] = useState(String(item.quantity));
  const quantity = Number(value);
  const valid = value.trim() !== "" && validCartQuantity(quantity, item);
  const currentValid = validCartQuantity(item.quantity, item);
  const updating = action.isPending && action.variables?.type === "update";
  const removing = action.isPending && action.variables?.type === "remove";
  const blocked = disabled || action.isPending;
  return <article data-cart-line={item.cartItemId} aria-busy={action.isPending} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-3 py-6 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-x-5">
    <Link href={routes.productInfo(item.productId)} className={`relative block aspect-square overflow-hidden rounded-xl bg-muted/40 ${purchaseFocus}`}>
      {item.mainImage ? <Image src={item.mainImage} alt={item.productName} fill sizes="(max-width: 639px) 72px, 96px" className="object-contain" /> : <Package aria-hidden size={24} className="absolute inset-0 m-auto text-muted-foreground" />}
    </Link>
    <div className="min-w-0">
      <Link href={routes.productInfo(item.productId)} className={`line-clamp-2 rounded-sm text-sm font-semibold leading-6 transition-colors hover:text-brand ${purchaseFocus}`}>{item.productName}</Link>
      {item.attributes && Object.keys(item.attributes).length > 0 && <p className="mt-1 text-xs leading-5 text-muted-foreground">{Object.entries(item.attributes).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p>}
      <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 text-sm"><CartMoney amount={item.finalUnitPrice} currency={item.currency} /><span className="text-xs text-muted-foreground">/ {item.minimumOrder.unit}</span>{item.unitPrice > item.finalUnitPrice && <del className="text-xs text-muted-foreground"><CartMoney amount={item.unitPrice} currency={item.currency} /></del>}</p>
      <p className="mt-2 text-[0.6875rem] leading-5 text-muted-foreground">{t("minimum", { quantity: item.minimumOrder.quantity, unit: item.minimumOrder.unit })}<span className="mx-1.5">·</span>{t("available", { quantity: item.availableQuantity })}</p>
    </div>
    <p className="col-start-2 text-sm font-bold sm:col-start-3 sm:row-start-1 sm:pt-1 sm:text-right"><span className="mr-2 text-xs font-normal text-muted-foreground sm:sr-only">{t("lineTotal")}</span><CartMoney amount={item.subtotal} currency={item.currency} /></p>
    <div className="col-span-2 sm:col-span-2 sm:col-start-2">
      {!currentValid && <p role="alert" className="mb-2 text-xs leading-5 text-destructive">{t("stockChanged")}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`qty-${item.cartItemId}`}>{t("quantityFor", { name: item.productName })}</label>
        <input id={`qty-${item.cartItemId}`} type="number" inputMode="decimal" step="any" min={item.minimumOrder.quantity} max={item.availableQuantity} value={value} onChange={(event) => setValue(event.target.value)} disabled={blocked} aria-invalid={!valid} aria-describedby={!valid ? `qty-error-${item.cartItemId}` : undefined} className={`${purchaseInput} w-24! min-w-0`} />
        <button type="button" disabled={blocked || !valid || quantity === item.quantity} aria-busy={updating} onClick={() => action.mutate({ type: "update", id: item.cartItemId, quantity })} className={`${purchaseText} px-2`}>{updating && <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" />}{t(updating ? "updating" : "update")}</button>
        <button type="button" disabled={blocked} aria-busy={removing} onClick={() => action.mutate({ type: "remove", id: item.cartItemId })} aria-label={t("removeName", { name: item.productName })} className={`${purchaseText} ml-auto px-2 text-muted-foreground! hover:text-destructive!`}>{removing ? <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" /> : <Trash2 size={14} aria-hidden="true" />}<span className="text-xs">{t(removing ? "removing" : "remove")}</span></button>
      </div>
      {!valid && <p id={`qty-error-${item.cartItemId}`} className="mt-2 text-xs leading-5 text-destructive">{t("quantityError", { min: item.minimumOrder.quantity, max: item.availableQuantity })}</p>}
    </div>
  </article>;
}
