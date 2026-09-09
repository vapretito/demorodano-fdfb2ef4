import projectImage01 from "@/assets/pileta-proyecto-01.jpg";

/**
 * Single source of truth for every piece of copy, contact detail, colour and
 * asset used by the immersive experience. Nothing content-related should be
 * hardcoded inside the components.
 */
export const EXPERIENCE_CONFIG = {
  brand: {
    name: "GMV",
    tagline: "Construcción & desarrollo",
    logo: "", // optional image URL; falls back to the wordmark
    accent: "#19C2BB",
  },

  contact: {
    label: "Conocé GMV",
    ctaLabel: "Ver GMV Construcción",
    instagram: "https://www.instagram.com/gmv.construccion/",
  },

  model: {
    // Optional .glb of a pool / architectural scene. When empty, the scene is
    // built procedurally. Replace with a URL or /models/pool.glb to override.
    url: "",
  },

  images: {
    project01: projectImage01,
  },

  intro: {
    title: ["Construimos espacios", "para vivirlos."],
    hint: "Desplazá para recorrer el proyecto",
  },

  palette: {
    background: "#071012",
    deepBlue: "#071B22",
    water: "#0B7084",
    turquoise: "#19C2BB",
    aqua: "#82E4DF",
    stone: "#D8D1C5",
    white: "#F5F5F2",
  },

  chapters: [
    {
      id: "proyecto",
      nav: "PROYECTO",
      eyebrow: "01 — Construcción",
      title: ["De una idea", "a un proyecto."],
      body: [
        "En GMV convertimos cada idea en un proyecto pensado para la forma en que querés vivir.",
        "Arquitectura, obra y terminaciones se integran desde el primer plano.",
      ],
      position: "lower-left" as const,
    },
    {
      id: "diseno",
      nav: "PROCESO",
      eyebrow: "02 — Cada etapa",
      title: ["Cuidamos", "cada paso."],
      body: [
        "Acompañamos el proceso completo: proyecto, planificación, ejecución y entrega de tu obra.",
      ],
      position: "left-column" as const,
    },
    {
      id: "materiales",
      nav: "DESARROLLO",
      eyebrow: "03 — Diseño y detalle",
      title: ["Diseñamos y", "desarrollamos."],
      body: [
        "Materiales, proporciones y detalles constructivos trabajan juntos para lograr espacios durables y contemporáneos.",
      ],
      labels: ["PROYECTO", "DIRECCIÓN DE OBRA", "CONSTRUCCIÓN", "TERMINACIONES"],
      position: "right" as const,
    },
    {
      id: "contacto",
      nav: "CONTACTO",
      eyebrow: "04 — GMV Construcción",
      title: ["Construir puede", "ser simple."],
      body: [
        "Conocé nuestros proyectos y el proceso que transforma una idea en tu próximo espacio.",
      ],
      position: "left-column" as const,
      showCta: true,
    },
  ],
} as const;

export type Chapter = (typeof EXPERIENCE_CONFIG)["chapters"][number];

export const contactHref = () => EXPERIENCE_CONFIG.contact.instagram;

/** Total scroll distance of the experience, in viewport heights. */
export const SCROLL_VH = 650;
