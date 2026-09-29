import Image from "next/image";

type Stat = { value: string; label: string; icon: string };

export default function ImpactStats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3">
      {stats.map(({ value, label, icon }) => (
        <div key={label} className="flex items-start gap-2.5">
          <Image src={`/assets/icons/our-impact/${icon}`} alt="" width={32} height={32} className="mt-0.5 size-8 shrink-0 object-contain" />
          <div className="flex min-w-0 flex-col">
            <dt className="mt-1 text-[11px] leading-relaxed text-neutral-600">{label}</dt>
            <dd className="-order-1 whitespace-nowrap text-sm font-semibold text-neutral-800">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
