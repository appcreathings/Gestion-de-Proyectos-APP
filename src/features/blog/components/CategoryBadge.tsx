import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BLOG_CATEGORIES } from "../data/categories";
import type { BlogCategory } from "../types";

type CategoryBadgeProps = {
  category: BlogCategory;
  asLink?: boolean;
};

export function CategoryBadge({ category, asLink = false }: CategoryBadgeProps) {
  const label = BLOG_CATEGORIES[category].label;

  if (asLink) {
    return (
      <Link to={`/blogs?categoria=${category}`}>
        <Badge
          variant="secondary"
          className="font-mono text-[10px] uppercase tracking-widest hover:bg-primary/[0.08]"
        >
          {label}
        </Badge>
      </Link>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="font-mono text-[10px] uppercase tracking-widest"
    >
      {label}
    </Badge>
  );
}
