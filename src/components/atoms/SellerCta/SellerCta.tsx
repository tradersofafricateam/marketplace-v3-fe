import Link from "next/link";
import { cn } from "@/lib/utils";

const SellerCta = ({
  href,
  children,
  variant = "orange",
  fullWidth = false,
}: {
  href: string;
  children: string;
  variant?: "orange" | "blue";
  fullWidth?: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "inline-flex min-h-10 items-center justify-center rounded-sm px-7 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
      variant === "blue"
        ? "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600"
        : "bg-(--orange) hover:bg-(--orange-dark) focus-visible:outline-(--orange)",
      fullWidth && "w-full",
    )}
  >
    {children}
  </Link>
);

export default SellerCta;
