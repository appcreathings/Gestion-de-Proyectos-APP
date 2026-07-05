const STATS = [
  { value: "100%", label: "open source (MIT)" },
  { value: "0", label: "suscripciones ni cuentas" },
  { value: "∞", label: "usuarios por carpeta" },
  { value: "Offline", label: "funciona sin internet" },
];

export function TrustBar() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">
                {s.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
