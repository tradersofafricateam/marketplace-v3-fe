import CategoryArtwork from "@/features/categories/components/atoms/CategoryArtwork/CategoryArtwork";
import Link from "next/link";

const MainCategoryCard = ({
  href,
  image,
  category,
}: {
  href: string;
  image?: string;
  category: string;
}) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 sm:max-w-37.5 sm:min-w-37.5 max-w-24 min-w-24 rounded-xl transition-all duration-300 shrink-0 group hover:shadow-sm bg-background sm:pb-2"
    >
      <div className="sm:w-37.5 sm:h-37.5 w-24 h-24 overflow-hidden bg-muted/40 shrink-0 rounded-xl">
        <CategoryArtwork src={image} className="size-full transition-transform group-hover:scale-110" />
      </div>
      <span className="sm:text-sm text-[11px] text-center leading-tight group-hover:text-(--orange) transition-all duration-300">
        {category}
      </span>
    </Link>
  );
};

export default MainCategoryCard;
