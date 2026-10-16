import type { Metadata } from "next";
import MainLayout from "@/components/templates/MainLayout/MainLayout";
import CartPageTemplate from "@/features/cart/components/templates/CartPageTemplate/CartPageTemplate";
export const metadata: Metadata = { title: "Your cart | TOFA", robots: { index: false, follow: false } };
export default function CartPage() { return <MainLayout><CartPageTemplate /></MainLayout>; }
