import Link from "next/link";
import { itemCount } from "@/lib/brand";
import type { Group } from "@/lib/types";
import { categoryPath } from "@/lib/urls";
import { Rail } from "./rail";
import { StoreImage } from "./store-image";

/** Round photo shortcuts to every category: quick to scan and tap */
export function CategoryStrip({ categories }: { categories: Group[] }) {
  return (
    <Rail label="Categories" itemClassName="w-[5.5rem] sm:w-[7rem]">
      {categories.map((category) => (
        <Link key={category.id} href={categoryPath(category)} className="group flex flex-col items-center gap-2.5 text-center">
          <span className="relative block aspect-square w-full overflow-hidden rounded-full bg-surface ring-2 ring-line transition duration-300 group-hover:-translate-y-1 group-hover:ring-accent group-hover:ring-offset-2 group-hover:ring-offset-bg">
            <StoreImage
              src={category.image}
              alt=""
              fallback={category.name}
              fallbackClassName="text-2xl"
              fill
              sizes="7rem"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          </span>
          <span className="line-clamp-2 text-[0.8rem] font-medium leading-tight group-hover:text-accent-strong sm:text-sm">{category.name}</span>
          <span className="-mt-1.5 hidden text-[0.7rem] text-muted sm:block">{itemCount(category.products)}</span>
        </Link>
      ))}
    </Rail>
  );
}
