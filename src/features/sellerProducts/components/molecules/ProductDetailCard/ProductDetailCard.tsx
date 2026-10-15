const ProductDetailCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-border bg-background p-5 sm:p-6">
    <h2 className="text-xs font-bold tracking-wide text-muted-foreground uppercase">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

export default ProductDetailCard;
