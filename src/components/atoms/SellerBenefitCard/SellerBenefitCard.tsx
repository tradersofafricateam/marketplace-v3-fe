import type { LucideIcon } from "lucide-react";

const SellerBenefitCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) => (
  <article className="space-y-4">
    <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
      <Icon size={16} aria-hidden="true" />
    </div>
    <div className="space-y-2">
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  </article>
);

export default SellerBenefitCard;
