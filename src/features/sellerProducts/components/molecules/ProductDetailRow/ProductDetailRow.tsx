const ProductDetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 text-sm last:border-0 last:pb-0">
    <dt className="text-muted-foreground">{label}</dt>
    <dd className="text-right font-semibold">{value}</dd>
  </div>
);

export default ProductDetailRow;
