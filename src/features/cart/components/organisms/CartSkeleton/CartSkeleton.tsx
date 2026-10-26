export default function CartSkeleton() {
  return <div aria-busy="true" aria-label="Loading cart" className="mx-auto max-w-7xl animate-pulse space-y-6 px-6 py-12"><div className="h-10 w-48 rounded bg-muted" /><div className="grid gap-6 lg:grid-cols-[1fr_360px]"><div className="h-96 rounded-2xl bg-muted" /><div className="h-72 rounded-2xl bg-muted" /></div></div>;
}
