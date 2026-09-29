import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const SellerProductsEmptyState = () => {
  const { routes } = useGetAllRoutes();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-(--brown) p-8 text-white sm:p-14">
      <Image
        src="/assets/images/seller-products-empty.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none object-cover"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(25,15,8,0.92)_0%,rgba(25,15,8,0.78)_45%,rgba(25,15,8,0.35)_100%)]"
      />
      <div className="relative max-w-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-(--orange)">Your catalog is empty</p>
        <h2 className="heading-font mt-3 text-2xl font-bold sm:text-3xl">List your first product</h2>
        <p className="mt-3 text-sm leading-6 text-white/75">
          Add a product to start reaching buyers across African markets - it saves as a draft first, so you can
          review before publishing.
        </p>
        <Link
          href={routes.sellerProductNew}
          className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold transition hover:bg-(--orange-dark)"
        >
          <Plus size={18} /> Add your first product
        </Link>
      </div>
    </div>
  );
};

export default SellerProductsEmptyState;
