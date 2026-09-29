import { Suspense } from "react";
import MessageCenterTemplate from "@/features/messages/components/templates/MessageCenterTemplate";
import MessageLoading from "@/features/messages/components/atoms/MessageLoading";
export default function SellerMessagesPage() {
  return <Suspense fallback={<MessageLoading />}><MessageCenterTemplate /></Suspense>;
}
