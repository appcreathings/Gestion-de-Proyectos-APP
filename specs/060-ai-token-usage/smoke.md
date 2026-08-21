# Smoke 060 — uso de tokens y RAG fresco

Requisitos: API key Gemini válida, workspace con ≥2 proyectos, RAG indexado (estado Actualizado).

- [ ] Settings `#uso`: empty state o totales del día; copy de privacidad visible.
- [ ] Chat en un proyecto (URL `/app/projects/:id`): enviar “resumí este proyecto”. Chip aparece al terminar (`N req · X tok`). Popover muestra rondas e “índice recortado” + RAG inyectado.
- [ ] Mismo texto otra vez en la misma pestaña: el popover marca skip cache-hit **o** no aparece un evento embedding nuevo en la card.
- [ ] Editar una tarea (dirty RAG → Parcial). Enviar una pregunta larga: Network no llama `embedContent`; chip/popover dice skip stale; la respuesta sigue saliendo.
- [ ] Continuación “sí”: no hay embedding (050 + 060).
- [ ] RateLimitStatus TPM se mueve en miles si el proveedor mandó usage (no saltos de 500). Diario (RPD) sube ~1 por ronda, no 1 por send.
- [ ] Settings card: Hoy / por modelo / últimos eventos / export JSON abre un archivo sin apiKey / vaciar pide confirmación y deja la sesión de la pestaña.
- [ ] Deep-link `/app/settings#uso` hace scroll a la card.
