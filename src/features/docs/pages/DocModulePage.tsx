import { useParams, Navigate } from "react-router-dom";
import { SeoPage } from "@/features/seo/SeoPage";
import { SeoArticle } from "@/features/seo/SeoArticle";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getModuleBySlug } from "../data/modules";

export function DocModulePage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getModuleBySlug(slug) : undefined;

  if (!doc) {
    return <Navigate to="/docs" replace />;
  }

  return (
    <SeoPage
      title={doc.seo.title}
      description={doc.seo.description}
      path={`/docs/${doc.slug}`}
      ogImageAlt={doc.seo.ogImageAlt}
      schemaJson={{
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: doc.title,
        description: doc.excerpt,
        author: { "@type": "Organization", name: "Hito" },
        publisher: { "@type": "Organization", name: "Hito" },
        mainEntityOfPage: `https://hito.autos/docs/${doc.slug}`,
      }}
    >
      <article className="border-b border-border/60">
        <div className="mx-auto max-w-3xl px-6 pt-24 sm:pt-32">
          <Breadcrumb
            items={[{ label: "Documentación", href: "/docs" }, { label: doc.title }]}
          />
        </div>

        <SeoArticle
          eyebrow={doc.content.eyebrow}
          title={doc.title}
          intro={doc.content.intro}
          sections={doc.content.sections}
          cta={{ label: "Probar Hito — sin registro" }}
        />
      </article>
    </SeoPage>
  );
}
