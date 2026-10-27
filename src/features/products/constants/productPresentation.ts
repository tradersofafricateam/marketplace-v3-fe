// Shared geometry keeps cards, loading states and every listing context aligned.
export const productGridClassName =
  "grid grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),17.5rem))] justify-start gap-x-6 gap-y-6";
export const productCardClassName = "group relative flex min-w-0 flex-col";
export const productMediaClassName =
  "relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted/40";
export const productBodyClassName = "flex min-w-0 flex-1 flex-col p-3";
export const productNameClassName =
  "line-clamp-2 text-[0.9375rem] font-medium leading-[1.375rem]";
export const productActionClassName =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-semibold leading-5 text-primary-foreground transition-colors duration-150 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 active:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none";
export const productActionContainerClassName = "mt-2";
