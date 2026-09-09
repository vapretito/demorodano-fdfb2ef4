import { contactHref } from "./config";

const offers = [
  {
    number: "01",
    title: "Consulta de proyecto",
    price: "USD 300",
    description: "Una primera mirada profesional para ordenar la idea, el alcance y los próximos pasos.",
    items: ["Relevamiento inicial", "Brief de necesidades", "Orientación de factibilidad"],
  },
  {
    number: "02",
    title: "Anteproyecto",
    price: "USD 450",
    description: "La propuesta espacial para visualizar tu obra antes de avanzar a la etapa técnica.",
    items: ["Distribución y volumetría", "Criterio de materiales", "Presentación de propuesta"],
  },
  {
    number: "03",
    title: "Proyecto ejecutivo",
    price: "USD 600",
    description: "Documentación clara para construir con precisión y tomar decisiones con confianza.",
    items: ["Planos de obra", "Detalles principales", "Cómputo orientativo"],
  },
];

export function ServicesIndex() {
  return (
    <section className="relative z-30 overflow-hidden bg-[#071012] px-6 py-20 text-[#f5f5f2] md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 border-b border-white/15 pb-14 md:grid-cols-[1.1fr_0.9fr] md:items-end">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#82e4df]">
              Servicios GMV
            </p>
            <h2 className="mt-5 max-w-[12ch] font-display text-5xl leading-[0.94] md:text-7xl">
              Proyectar bien es construir mejor.
            </h2>
          </div>
          <p className="max-w-[38ch] font-body text-base leading-relaxed text-white/70">
            Elegí el punto de partida que tu proyecto necesita. Todos los servicios se adaptan al terreno, al programa y a la escala de tu obra.
          </p>
        </div>

        <div className="grid divide-y divide-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
          {offers.map((offer) => (
            <article key={offer.number} className="group flex min-h-[360px] flex-col px-0 py-10 md:px-8 md:py-12 first:md:pl-0 last:md:pr-0">
              <p className="font-body text-[10px] tracking-[0.3em] text-[#82e4df]">{offer.number}</p>
              <h3 className="mt-5 font-display text-4xl leading-none">{offer.title}</h3>
              <p className="mt-7 font-body text-2xl text-white">{offer.price}</p>
              <p className="mt-5 max-w-[28ch] font-body text-sm leading-relaxed text-white/62">{offer.description}</p>
              <ul className="mt-auto space-y-3 pt-8 font-body text-[10px] uppercase tracking-[0.18em] text-white/62">
                {offer.items.map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-[#82e4df]">—</span>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2">
          <figure className="overflow-hidden bg-[#18272a]">
            <img src="/gmv-duplex-exterior.png" alt="Vivienda contemporánea terminada" className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            <figcaption className="px-5 py-4 font-body text-[10px] uppercase tracking-[0.24em] text-white/60">Obra terminada · vivienda contemporánea</figcaption>
          </figure>
          <figure className="overflow-hidden bg-[#18272a] md:mt-16">
            <img src="/gmv-construction-process.png" alt="Proceso de construcción de una vivienda" className="aspect-[3/2] h-full w-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            <figcaption className="px-5 py-4 font-body text-[10px] uppercase tracking-[0.24em] text-white/60">Proceso de obra · control y detalle</figcaption>
          </figure>
        </div>

        <div className="mt-20 flex flex-col gap-7 border-t border-white/15 pt-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.38em] text-[#82e4df]">¿Hablamos de tu obra?</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">Construir puede ser simple.</h2>
          </div>
          <a href={contactHref()} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-4 rounded-full border border-white/35 px-6 py-3 font-body text-[11px] uppercase tracking-[0.2em] transition-colors hover:border-[#82e4df] hover:text-[#82e4df]">
            Ver GMV Construcción <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
