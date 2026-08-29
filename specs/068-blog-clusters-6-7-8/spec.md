# Spec 068 — Blog: clusters 6, 7 y 8 (12 artículos nuevos por demanda de búsqueda)

## Progreso

- **Estado general: 🟩 IMPLEMENTADO (2026-08-29).** Continúa `ROADMAP_BLOG.md` (specs 040 y 058,
  completos con 56 artículos). Detecta 3 gaps de cobertura validados con demanda real de búsqueda
  (autocompletado de Google, `hl=es`) y los cierra con 12 artículos en 3 clusters nuevos, mismo
  patrón pilar→satélite de spec 040.

### Detección de gaps

El blog no tenía cobertura en tres áreas con demanda comprobada:

1. **Control y métricas** — solo había informes y ruta crítica; sin KPIs, Gantt (volumen masivo),
   burndown ni lecciones aprendidas.
2. **Stakeholders y equipo** — cero artículos: "que son stakeholders", "matriz de stakeholders",
   "gestión de recursos en proyectos" y "que hace un project manager" son consultas de alto
   volumen con intención informacional pura.
3. **Dinero del proyecto** — gap total: presupuesto, costos directos/indirectos, valor ganado
   (EVM) y sobrecosto. El dinero es el ángulo de mayor valor de fondo de embudo para agencias y
   freelancers (público de Hito).

### Cluster 6 — Control y métricas (pilar `kpis-gestion-proyectos`)

| Slug | `publishedAt` | Notas |
|---|---|---|
| `kpis-gestion-proyectos` (pilar, featured) | 2027-07-05 | 8 KPIs con la decisión que dispara cada uno; tabla de 8 filas. CPI/SPI como teaser de valor ganado. |
| `diagrama-de-gantt` | 2027-07-12 | howTo schema (5 pasos). Tensión honesta con `plantilla-cronograma-proyecto` ("sin Gantt eterno") resuelta: el Gantt es visualización, la tabla es el plan. Related recíproco. |
| `burndown-chart` | 2027-07-19 | howTo (4 pasos). 4 patrones de lectura en tabla. Burndown vs burnup. |
| `lecciones-aprendidas-proyecto` | 2027-07-26 | howTo (5 pasos). Formato de 4 columnas. El truco: viven en el kickoff. Related recíproco con `cierre-de-proyecto-checklist`. |

### Cluster 7 — Stakeholders y equipo (pilar `que-son-stakeholders`)

| Slug | `publishedAt` | Notas |
|---|---|---|
| `que-son-stakeholders` (pilar, featured) | 2027-08-02 | Internos/externos en tabla, stakeholders vs shareholders, 4 cuadrantes como teaser de la matriz. FAQ con "stakeholders en español" y "internos y externos". |
| `matriz-de-stakeholders` | 2027-08-09 | Categoría `plantillas`. howTo (llenar en 30 min). Ejemplo completo de 5 stakeholders. Puente a plan de comunicación y RACI. |
| `gestion-de-recursos-proyecto` | 2027-08-16 | howTo (capacidad en 4 pasos). Nominal vs real vs asignable en tabla. Señales de sobrecarga. Conflicto de recursos entre proyectos. |
| `que-hace-un-project-manager` | 2027-08-23 | Día a día real + lo que NO hace. Tabla PM/product manager/scrum master/PMO. Variación por industria (construcción, agencia, producto). Señales de cuándo contratar. |

### Cluster 8 — Dinero del proyecto (pilar `presupuesto-de-proyecto`)

| Slug | `publishedAt` | Notas |
|---|---|---|
| `presupuesto-de-proyecto` (pilar, featured) | 2027-08-30 | howTo (5 pasos). Anatomía en 4 bloques (directos, indirectos, contingencia, margen) + ejemplo numérico completo (49.950). Control mensual con teaser de EVM. |
| `costos-directos-e-indirectos` | 2027-09-06 | La pregunta que clasifica ("¿desaparecería si el proyecto se cancelara?"). 8 ejemplos en tabla. Margen fantasma. Tasa sobre horas directas. |
| `valor-ganado-evm` | 2027-09-13 | howTo (4 pasos). PV/EV/AC en tabla, CPI/SPI/CV/SV, ejemplo numérico completo (BAC 40.000 → EAC ≈ 48.900). Umbrales 0.95/0.85. Versión light para equipos chicos. |
| `sobrecosto-de-proyecto` | 2027-09-20 | 7 causas con antídoto en tabla. Detección: CPI, EAC, contingencia restante. Salidas: recortar alcance, re-baseline, nunca "apretar" como plan. |

## Interlinking con contenido existente

- Cada nuevo artículo enlaza en cuerpo a 2-4 posts existentes (ruta crítica, cronograma, WBS,
  kickoff, cierre, RACI, alcance/scope creep, delegar, WIP, informe de estado, estimar tiempos,
  riesgos, KPIs, agencias, metodologías).
- `plantilla-cronograma-proyecto`: `related` cambia `como-estimar-tiempos-proyecto` →
  `diagrama-de-gantt` (par del mismo tema). Reflejado en el índice y en el archivo.
- `cierre-de-proyecto-checklist`: `related` suma `lecciones-aprendidas-proyecto`. Reflejado en
  índice y archivo.
- Los 3 pilares nuevos van `featured: true` (patrón de los pilares anteriores).

## Estilo de redacción

Español latino neutro, tuteo (tú), sin voseo ni marcas de España — misma regla de specs
040/058. Intro de cada post abre con "En una línea:" (patrón del sitio). FAQ en español
con la redacción literal de las queries reales (alimenta schema FAQPage). howTo schema en los
5 posts procedurales. Contenido agnóstico de herramienta; Hito solo si el CTA final lo pide
(este lote no lo incluye: posts informacionales puros).

## Verificación (gates, estilo spec 035/040/058)

- `npm run typecheck` (tsc --noEmit) ✅
- `npm run lint` (eslint src) ✅ — sin errores nuevos; los warnings/errors señalados por el
  linter en `daily/`, `integrations/` y `hooks/` son preexistentes y fuera de alcance.
- `npm run test` (vitest) ✅ para blog: 64/64 tests de `src/features/blog` pasan, incluido el
  anti-drift. En el run completo hay fallos preexistentes en `.worktrees/063-*` (worktree
  paralelo escaneado por vitest) y un flaky de `webhook-request.test.ts` que pasa en aislamiento.
- `npm run build` (tsc -b + vite build + prerender) ✅ — 99 rutas, incluidas las 12 nuevas.

## Criterios de aceptación

- Los 12 artículos siguen el patrón de 3 archivos (`data/articles/<slug>.tsx` + entrada en
  `articles-index.ts` + loader en `articles/index.ts`) y el test anti-drift pasa.
- Los 3 pilares tienen `featured: true` y sin `pillar`; los 9 satélites apuntan a su pilar.
- Todo `related`/`pillar` apunta a slugs existentes (validado por test).
- Cadencia semanal continua desde 2027-07-05 hasta 2027-09-20 (lunes, igual que las fases previas).
- `ROADMAP_BLOG.md` actualizado: clusters 6-8 en 🟩, Fase 6 en Progreso, calendario editorial.

## Fuera de alcance

- Mejora SEO de los 56 posts existentes (requiere export nuevo de GSC; medir en 4-6 semanas).
- Adaptación/traducción de los posts a otros idiomas.
- Cambios de diseño o infraestructura del blog (ver spec 059).
