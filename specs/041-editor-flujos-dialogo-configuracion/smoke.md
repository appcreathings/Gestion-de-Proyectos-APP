# Smoke 041 — Editor de flujos: diálogo de configuración acorde al nodo

> Guion de verificación visual. El repo no tiene Playwright: el ancho de diálogos, overflow
> horizontal y modales apilados se confirman en el navegador (~1280px de viewport de escritorio).

## 1. Tamaño del diálogo por tipo de nodo (HU-01, Fase A)

Preparación: abrir un flujo existente o crear uno con los cuatro tipos de nodo (trigger,
condición, transformar, acción).

- [ ] **Trigger:** clic en el nodo trigger → el diálogo es tamaño **mediano** (~672px de ancho en
      escritorio), no el cuadrado pequeño de antes. El contenido de `TriggerStep` entra sin scroll
      horizontal.
- [ ] **Condición:** clic en un nodo condición → mismo tamaño mediano; campos de regla legibles.
- [ ] **Transformar:** clic en nodo transformar → diálogo **grande** (~896px). Las filas de
      mapeo origen→destino (`grid sm:grid-cols-2`) muestran dos columnas cómodas, no aplastadas.
- [ ] **Transformar — preview:** si hay código de transformación, el bloque `<pre>` no fuerza
      scroll horizontal en condiciones normales (viewport ~1280px).
- [ ] **Acción:** clic en nodo acción → diálogo grande. Selector de conexión, muestras y picker de
      variables entran sin overflow horizontal.
- [ ] Comparación visual: transform/action se ven claramente más anchos que trigger/condition.

## 2. Guía Apps Script desde el editor de flujos (HU-02, Fase B) — caso roto

Preparación: flujo con nodo trigger → tipo "Al recibir un webhook (Make/Zapier)" o integración
que muestre "Ver guía paso a paso".

- [ ] Abrir configuración del trigger desde el **editor de flujos** (`/app/flows/:id`).
- [ ] Pulsar **"Ver guía paso a paso"**.
- [ ] La guía **cubre toda la pantalla** (overlay oscuro edge-to-edge), no queda encerrada dentro
      del recuadro pequeño del diálogo de nodo.
- [ ] Se puede navegar pasos (Anterior / Siguiente), copiar código y cerrar con ✕ o Finalizar.
- [ ] Al cerrar la guía, el diálogo de configuración del trigger sigue abierto y usable.

## 3. Guía Apps Script desde Integraciones (regresión)

- [ ] `Integraciones` → proveedor con proxy (HubSpot, Google Sheets, Email o Webhook inbox) →
      abrir la misma guía paso a paso.
- [ ] Se comporta igual que antes (pantalla completa, pasos navegables) — sin regresión por la
      migración a `Dialog`.

## 4. WebhookSignatureGuide (no regresión)

- [ ] Desde un nodo **acción** con salida webhook, abrir la guía de firma HMAC ("¿Cómo verificar…").
- [ ] Sigue abriendo a pantalla completa con tabs Express/Python/Apps Script/Zapier/Make.
- [ ] No se rompió por cambios en `FlowCanvas.tsx` ni en `dialog.tsx`.

## 5. Consola y accesibilidad rápida

- [ ] Abrir cada uno de los cuatro diálogos de nodo: **cero** avisos nuevos de Radix en consola.
- [ ] Abrir guía Apps Script: se anuncia contexto (descripción del diálogo) con inspector de
      accesibilidad.

---

## Nota para quien ejecute: orden recomendado

Verificar §1 (tamaños) primero — es el cambio más visible. Luego §2 (el bug original de guía
anidada). §3 y §4 confirman que no hubo regresiones en otros puntos de entrada.
