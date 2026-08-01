import { Helmet } from "react-helmet-async";
import { ScrollToHash } from "@/components/ScrollToHash";
import { LandingNav } from "@/features/landing/components/LandingNav";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { StickyCta } from "@/features/landing/components/StickyCta";

export type SeoBreadcrumbItem = { label: string; path: string };

type SeoPageProps = {
  title: string;
  description: string;
  path: string;
  ogImageAlt?: string;
  schemaJson?: object | object[];
  /** `"article"` para posts de blog; por defecto `"website"`. */
  ogType?: "website" | "article";
  /** Trail from home to the current page (inclusive) — emits BreadcrumbList JSON-LD. */
  breadcrumb?: SeoBreadcrumbItem[];
  children: React.ReactNode;
};

/**
 * Layout shell for SEO satellite pages. Reuses the landing chrome (nav/footer)
 * and centralises <Helmet> meta so the same canonical, OG, and Twitter patterns
 * are applied everywhere.
 */
export function SeoPage({
  title,
  description,
  path,
  ogImageAlt,
  schemaJson,
  ogType = "website",
  breadcrumb,
  children,
}: SeoPageProps) {
  const url = `https://hito.autos${path}`;
  const schemas = schemaJson ? (Array.isArray(schemaJson) ? schemaJson : [schemaJson]) : [];
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content={ogType} />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:site_name" content="Hito" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://hito.autos/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {ogImageAlt ? <meta property="og:image:alt" content={ogImageAlt} /> : null}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://hito.autos/og-image.png" />
        {schemas.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
        {breadcrumb ? (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breadcrumb.map((item, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: item.label,
                item: `https://hito.autos${item.path}`,
              })),
            })}
          </script>
        ) : null}
      </Helmet>
      <ScrollToHash />
      <div className="min-h-screen flex flex-col">
        <LandingNav />
        <StickyCta />
        <main className="flex-1">{children}</main>
        <LandingFooter />
      </div>
    </>
  );
}
