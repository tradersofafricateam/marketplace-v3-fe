import Download from "@/components/atoms/icons/Download";

const SellerPolicyCard = ({
  title,
  description,
  downloadLabel,
  downloadHref,
}: {
  title: string;
  description: string;
  downloadLabel: string;
  downloadHref: string;
}) => (
  <article className="space-y-5">
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="border-l-2 border-(--orange) pl-5 leading-7">{description}</p>
    <a
      href={downloadHref}
      download
      className="flex w-fit items-center gap-2 text-xs text-muted-foreground hover:text-(--orange)"
    >
      <Download />
      {downloadLabel}
    </a>
  </article>
);

export default SellerPolicyCard;
