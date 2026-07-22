import { Link } from "react-router-dom";
import { getRelatedMeta } from "../data/articles-index";
import type { BlogCategory } from "../types";

type RelatedPostsProps = {
  currentSlug: string;
  category: BlogCategory;
};

export function RelatedPosts({ currentSlug, category }: RelatedPostsProps) {
  const related = getRelatedMeta(currentSlug, category);

  if (related.length === 0) return null;

  return (
    <aside className="border-t border-border/60 bg-muted/20 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Relacionados
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {related.map((article) => (
            <Link
              key={article.slug}
              to={`/blogs/${article.slug}`}
              className="group rounded-xl border border-border/60 bg-background p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/[0.02]"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {article.categoryLabel}
              </span>
              <h4 className="mt-2 text-sm font-semibold tracking-tight transition-colors group-hover:text-primary">
                {article.title}
              </h4>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {article.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
