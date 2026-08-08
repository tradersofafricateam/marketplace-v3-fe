import { Check, X } from "lucide-react";

import SellerCta from "@/components/atoms/SellerCta/SellerCta";

const SellerPlanCard = ({
  name,
  description,
  price,
  period,
  cta,
  href,
  features,
  unavailableFeature,
}: {
  name: string;
  description: string;
  price: string;
  period?: string;
  cta: string;
  href: string;
  features: string[];
  unavailableFeature?: string;
}) => (
  <article className="flex h-full flex-col rounded-lg border border-border bg-background p-6 shadow-sm max-w-90">
    <span
      aria-hidden="true"
      className="mb-4 block size-4 shrink-0 rounded-full border-2 border-blue-500"
    />
    <h3 className="font-bold">{name}</h3>
    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    <p className="my-5 text-3xl font-bold">
      {price}
      {period && (
        <span className="text-xs font-normal text-muted-foreground">
          {period}
        </span>
      )}
    </p>
    <SellerCta href={href} variant="blue" fullWidth>
      {cta}
    </SellerCta>
    <ul className="mt-6 space-y-3 text-xs">
      {unavailableFeature && (
        <li className="flex gap-2 text-muted-foreground">
          <X size={14} className="shrink-0 text-red-500" /> {unavailableFeature}
        </li>
      )}
      {features.map((feature) => (
        <li key={feature} className="flex gap-2">
          <Check size={14} className="shrink-0 text-emerald-500" /> {feature}
        </li>
      ))}
    </ul>
  </article>
);

export default SellerPlanCard;
