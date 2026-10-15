import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZES = [10, 20, 30, 40, 50];
const controlClass = "inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--orange) focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-muted-foreground/35";

interface ProductPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function ProductPagination({ page, limit, total, totalPages, onPageChange, onLimitChange }: ProductPaginationProps) {
  const lastPage = Math.max(1, totalPages);
  const start = total === 0 || page > lastPage ? 0 : (page - 1) * limit + 1;
  const end = start === 0 ? 0 : Math.min(page * limit, total);
  const pages = Array.from(new Set([
    1,
    ...Array.from({ length: 5 }, (_, index) => Math.min(Math.max(page - 2, 1), Math.max(lastPage - 4, 1)) + index)
      .filter((number) => number <= lastPage),
    lastPage,
  ])).sort((a, b) => a - b);

  return (
    <nav aria-label="Product pagination" className="flex flex-col gap-4 rounded-2xl border border-border bg-background px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:justify-start">
        <p className="text-sm tabular-nums text-muted-foreground">
          <span className="font-medium text-foreground">{start.toLocaleString()}–{end.toLocaleString()}</span> of <span className="font-medium text-foreground">{total.toLocaleString()}</span> products
        </p>
        <label className="flex items-center gap-2.5 text-sm text-muted-foreground">
          Per page
          <span className="relative">
            <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))} className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-9 text-sm font-medium tabular-nums text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--orange) focus-visible:ring-offset-2">
              {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
            </select>
            <ChevronDown aria-hidden="true" size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
          </span>
        </label>
      </div>
      <div className="flex items-center justify-between gap-1 border-t border-border pt-3 sm:justify-end sm:border-0 sm:pt-0">
        <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={`${controlClass} border border-border enabled:hover:bg-muted`}><ChevronLeft aria-hidden="true" size={18} /></button>
        <span className="px-3 text-sm tabular-nums text-muted-foreground sm:hidden">Page <span className="font-semibold text-foreground">{page}</span> of {lastPage}</span>
        <div className="hidden items-center gap-1 px-1 sm:flex">
          {pages.map((number, index) => <span key={number} className="flex items-center gap-1">
            {index > 0 && number - pages[index - 1] > 1 && <span aria-hidden="true" className="flex size-10 items-center justify-center text-muted-foreground">…</span>}
            <button type="button" aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => onPageChange(number)} className={`${controlClass} ${page === number ? "bg-(--orange) font-semibold text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{number}</button>
          </span>)}
        </div>
        <button type="button" aria-label="Next page" disabled={page >= lastPage} onClick={() => onPageChange(page + 1)} className={`${controlClass} border border-border enabled:hover:bg-muted`}><ChevronRight aria-hidden="true" size={18} /></button>
      </div>
    </nav>
  );
}
