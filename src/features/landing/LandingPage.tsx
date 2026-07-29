import { Helmet } from "react-helmet-async";
import { ScrollToHash } from "@/components/ScrollToHash";
import { FAQS } from "./data/faqs";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { ProductMockup } from "./components/ProductMockup";
import { ValueProps } from "./components/ValueProps";
import { HowItWorks } from "./components/HowItWorks";
import { FeatureHighlights } from "./components/FeatureHighlights";
import { Comparison } from "./components/Comparison";
import { UseCases } from "./components/UseCases";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { LandingNav } from "./components/LandingNav";
import { LandingFooter } from "./components/LandingFooter";
import { StickyCta } from "./components/StickyCta";
import { TrustBadges } from "./components/TrustBadges";
import { Reveal } from "./components/Reveal";
import { AiAssistantSection } from "./components/AiAssistantSection";
import { FlowsIntegrationsSection } from "./components/FlowsIntegrationsSection";
import { BlogTeaser } from "./components/BlogTeaser";

/**
 * LandingPage — Página pública de marketing/onboarding en "/".
 *
 * Arquitectura de secciones (orden de aparición):
 * ┌─────────────────────────────────────────────────────────┐
 * │ LandingNav          → Nav fijo con CTA y dark-mode      │
 * │ StickyCta           → Barra sticky mobile con CTA       │
 * │ Hero                → Propuesta de valor principal       │
 * │ TrustBadges         → Badges de confianza (MIT, etc.)    │
 * │ TrustBar            → Logos/señales de confianza         │
 * │ ProductMockup       → Mockup visual del producto         │
 * │ ValueProps          → 4 pilares: privacidad, JSON, etc.  │
 * │ HowItWorks          → 4 pasos + jerarquía de entidades   │
 * │ FeatureHighlights   → 7 features (Kanban, IA, SOPs…)    │
 * │ FlowsIntegrationsSection → Detalle Flujos: builder, HubSpot/Sheets/Email/Webhooks │
 * │ AiAssistantSection  → Detalle IA: MCP, RAG, embeddings   │
 * │ Comparison          → Tabla vs Trello/Notion/ClickUp     │
 * │ UseCases            → 4 casos de uso por industria       │
 * │ Faq                 → Acordeón con 8 preguntas           │
 * │ BlogTeaser          → CTA a /blogs con 3 artículos       │
 * │ FinalCta            → CTA final con métricas             │
 * │ LandingFooter       → Footer con links y legal           │
 * └─────────────────────────────────────────────────────────┘
 *
 * SEO: Helmet inyecta title, meta, OG, Twitter Cards y bloques JSON-LD
 * (Organization, WebSite, SoftwareApplication, SoftwareSourceCode, FAQPage)
 * para rich snippets. FAQPage se genera desde ./data/faqs.ts, la misma
 * fuente que renderiza <Faq />, para que el schema nunca quede desincronizado
 * del contenido visible.
 *
 * El asistente IA (Gemini) se destaca en dos secciones:
 * - FeatureHighlights: tarjeta resumen con icono Sparkles
 * - AiAssistantSection: detalle técnico de MCP tools + RAG embeddings
 *   que muestra cómo la IA gestiona proyectos sin enviar datos a la nube.
 */
export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Hito — Gestión de proyectos, procesos (SOPs) y checklists 100% local-first</title>
        <meta name="description" content="Hito gestiona proyectos, procesos, checklists y tareas con privacidad total. Local-first: tus datos nunca salen de tu equipo. Sin nube, sin cuenta, sin suscripción. Kanban, automatizaciones, asistente IA y PWA offline. Gratuito y open source (MIT)." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_CO" />
        <meta property="og:site_name" content="Hito" />
        <meta property="og:title" content="Hito — Gestión de proyectos, procesos y checklists 100% local-first" />
        <meta property="og:description" content="Gestiona productos, proyectos, SOPs y checklists con privacidad total. Tus datos viven en tu equipo, no en la nube. Gratuito, open source, offline-first." />
        <meta property="og:url" content="https://hito.autos/" />
        <meta property="og:image" content="https://hito.autos/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hito" />
        <meta name="twitter:creator" content="@hito" />
        <meta name="twitter:title" content="Hito — Gestión de proyectos, procesos y checklists 100% local-first" />
        <meta name="twitter:description" content="Gestiona proyectos, SOPs y checklists sin rendir cuentas a la nube. Local-first, open source, offline." />
        <meta name="twitter:image" content="https://hito.autos/og-image.png" />
        <meta name="application-name" content="Hito" />
        <link rel="canonical" href="https://hito.autos/" />
        <meta name="og:image:alt" content="Hito — gestor de proyectos local-first. Vista del Kanban con árbol de proyectos." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hito",
            "url": "https://hito.autos/",
            "logo": "https://hito.autos/icon.svg",
            "description": "Gestor de proyectos, procesos y checklists local-first y open source.",
            "sameAs": [
              "https://github.com/appcreathings/Gestion-de-Proyectos-APP"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "technical support",
              "url": "https://github.com/appcreathings/Gestion-de-Proyectos-APP/issues/new"
            }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hito",
            "url": "https://hito.autos/",
            "inLanguage": "es-CO",
            "publisher": { "@type": "Organization", "name": "Hito" }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Hito",
            "description": "Gestor de proyectos, procesos (SOPs) y checklists local-first. Tus datos viven en archivos .json en tu equipo, no en la nube.",
            "applicationCategory": "ProductivityApplication",
            "operatingSystem": "Web, PWA, Windows, macOS, Linux",
            "url": "https://hito.autos/",
            "screenshot": "https://hito.autos/og-image.png",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "category": "Free"
            },
            "author": { "@type": "Organization", "name": "Hito" },
            "publisher": { "@type": "Organization", "name": "Hito" }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            "name": "Hito",
            "description": "Código fuente de Hito, gestor de proyectos local-first open source.",
            "codeRepository": "https://github.com/appcreathings/Gestion-de-Proyectos-APP",
            "programmingLanguage": ["TypeScript", "React"],
            "license": "https://github.com/appcreathings/Gestion-de-Proyectos-APP/blob/main/LICENSE",
            "author": { "@type": "Organization", "name": "Hito" }
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map((faq) => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": { "@type": "Answer", "text": faq.a },
            })),
          })}
        </script>
      </Helmet>
      <ScrollToHash />
      <div className="min-h-screen flex flex-col">
      <LandingNav />
      <StickyCta />
      <main className="flex-1">
        <Hero />
        <Reveal>
          <div className="mx-auto -mt-12 max-w-3xl px-6 pb-2">
            <TrustBadges />
          </div>
        </Reveal>
        <Reveal><TrustBar /></Reveal>
        <Reveal delay={100}><ProductMockup /></Reveal>
        <Reveal delay={50}><ValueProps /></Reveal>
        <Reveal delay={100}><HowItWorks /></Reveal>
        <Reveal delay={150}><FeatureHighlights /></Reveal>
        <Reveal delay={175}><FlowsIntegrationsSection /></Reveal>
        <Reveal delay={200}><AiAssistantSection /></Reveal>
        <Reveal delay={250}><Comparison /></Reveal>
        <Reveal delay={300}><UseCases /></Reveal>
        <Reveal delay={350}><Faq /></Reveal>
        <Reveal delay={375}><BlogTeaser /></Reveal>
        <Reveal delay={200}><FinalCta /></Reveal>
      </main>
      <LandingFooter />
    </div>
    </>
  );
}
