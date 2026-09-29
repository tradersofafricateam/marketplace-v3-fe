import { Suspense } from "react";
import BuyerMessagesShell from "@/features/messages/components/templates/BuyerMessagesShell";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";
export default function MessagesPage() {
  return <Suspense fallback={<DashboardSkeleton />}><BuyerMessagesShell /></Suspense>;
}
