import type { Metadata } from "next";
import MainLayout from "@/components/templates/MainLayout/MainLayout";
import CheckoutTemplate from "@/features/checkout/components/templates/CheckoutTemplate/CheckoutTemplate";
export const metadata: Metadata = { title: "Checkout | TOFA", robots: { index: false, follow: false } };
export default function CheckoutPage() { return <MainLayout><CheckoutTemplate /></MainLayout>; }
