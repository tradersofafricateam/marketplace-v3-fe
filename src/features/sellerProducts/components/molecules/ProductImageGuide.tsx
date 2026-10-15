export default function ProductImageGuide({ preview }: { preview?: string }) {
  return <aside className="grid gap-5 rounded-2xl border border-border bg-muted/30 p-5 sm:grid-cols-[1fr_160px]">
    <div><h3 className="font-semibold">Make your product the focus</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground"><li>Use a plain white, light grey, or neutral background.</li><li>Place the actual product in the centre and leave a little space around it.</li><li>Use a sharp, well-lit photo. Avoid busy backgrounds, text overlays, borders, and collages.</li><li>Choose the star on the photo you want buyers to see first.</li></ul><p className="mt-2 text-xs text-muted-foreground">The preview shows the thumbnail framing. Upload a photo with the right background; this does not remove or change it.</p></div>
    <div><div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview ? <img src={preview} alt="Marketplace thumbnail preview" className="h-full w-full object-contain" /> : <span className="flex h-2/3 w-2/3 items-center justify-center rounded-lg border border-dashed border-neutral-300 px-3 text-center text-xs text-neutral-500">Centre your product here</span>}
    </div><p className="mt-2 text-center text-xs text-muted-foreground">Buyer thumbnail preview</p></div>
  </aside>;
}
