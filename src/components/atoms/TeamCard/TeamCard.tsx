import Image from "next/image";

const TeamCard = ({
  name,
  url,
  imgUrl,
  role,
}: {
  name: string;
  url: string;
  imgUrl: string | null;
  role: string;
}) => {
  return (
    <div className="min-w-0 space-y-3">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted/40">
        {imgUrl ? <Image
          src={imgUrl}
          fill
          sizes="(max-width: 359px) 100vw, (max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
          alt={`profile pic of ${name}`}
          className="object-cover grayscale"
        /> : (
          <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-3xl font-semibold text-neutral-600" aria-hidden="true">
            {name.split(" ").map((part) => part[0]).join("")}
          </div>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — LinkedIn`}
          className="absolute bottom-2 right-2 flex size-11 items-center justify-center overflow-hidden rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          <Image
            src="/assets/icons/linkedin.svg"
            width={32}
            height={32}
            alt=""
            className="object-contain hover:scale-110 transition-all duration-300 ease-out"
          />
        </a>
      </div>
      <div className="space-y-1 break-words">
        <p className="text-base font-bold leading-snug">{name}</p>
        <p className="text-body text-muted-foreground">{role}</p>
      </div>
    </div>
  );
};

export default TeamCard;
