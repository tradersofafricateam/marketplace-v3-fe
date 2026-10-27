// Shared utility recipes keep navigation controls consistent across native links
// and buttons. Layout and component-specific styling stay with their components.
const interaction = "transition-[background-color,border-color,color,box-shadow] duration-150 ease-[ease] motion-reduce:transition-none [-webkit-tap-highlight-color:transparent]";
const focus = "focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-3";
const disabled = "disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-60";
const hover = "not-disabled:hover:bg-brand-subtle not-disabled:hover:text-brand-hover";
const active = "not-disabled:active:bg-muted not-disabled:active:text-foreground";
const selected = "aria-[current=page]:bg-brand-subtle aria-[current=page]:text-brand-hover";
const control = `inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold leading-[1.35] text-foreground ${interaction} ${focus} ${hover} ${active}`;
const action = `inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4.5 py-2.75 text-center text-sm font-bold leading-[1.3] ${interaction} ${focus} ${disabled}`;

export const navigationControl = `${control} ${disabled} aria-expanded:bg-brand-subtle aria-expanded:text-brand-hover`;
export const navigationLink = `${control} ${selected}`;
export const navigationItem = `flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.75 text-left text-sm font-medium leading-[1.4] text-foreground wrap-anywhere ${interaction} ${focus} ${hover} ${active} ${selected} aria-[current=page]:font-semibold aria-pressed:bg-brand-subtle aria-pressed:text-brand-hover aria-pressed:font-semibold`;
export const navigationPrimary = `${action} border-transparent bg-brand text-primary-foreground not-disabled:hover:bg-brand-hover not-disabled:active:bg-brand-hover not-disabled:active:inset-ring-2 not-disabled:active:inset-ring-foreground/15`;
export const navigationSecondary = `${action} border-border bg-background text-foreground ${hover} hover:border-brand ${active}`;
export const navigationIconButton = `inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-foreground ${interaction} ${focus} ${hover} hover:border-brand ${active}`;
export const navigationDestructive = "text-destructive! hover:bg-destructive/8! hover:text-destructive! not-disabled:active:bg-muted! not-disabled:active:text-foreground!";
export const navigationPanel = "z-80 w-62 max-w-[calc(100vw-32px)] max-h-[min(360px,65dvh)] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover p-2 text-popover-foreground shadow-floating animate-disclosure-fast motion-reduce:animate-none";
export const navigationEyebrow = "text-xs font-semibold leading-normal tracking-[.03em] text-muted-foreground";
export const navigationTitle = "mt-2 font-poppins text-2xl font-semibold leading-[1.3] tracking-[-.02em] wrap-anywhere";
