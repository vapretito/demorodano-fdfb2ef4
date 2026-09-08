import projectImage01 from "@/assets/pileta-proyecto-01.jpg";

/**
 * Single source of truth for every piece of copy, contact detail, colour and
 * asset used by the immersive experience. Nothing content-related should be
 * hardcoded inside the components.
 */
export const EXPERIENCE_CONFIG = {
  brand: {
    name: "Rodano",
    tagline: "Piletas de autor",
    logo: "", // optional image URL; falls back to the wordmark
    accent: "#19C2BB",
  },

  contact: {
    label: "Cotizar proyecto",
    ctaLabel: "Solicitar cotización",
    whatsapp: "543516641124",
    message:
      "Hola, quiero cotizar el diseño y construcción de una pileta para mi casa.",
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
    title: ["Diseñamos el lugar", "donde empieza el verano."],
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
      eyebrow: "01 — Experiencia",
      title: ["Tu pileta,", "tu lugar."],
      body: [
        "No construimos solamente una pileta. Diseñamos el espacio donde vas a pasar tus mejores días.",
        "Cada proyecto se adapta al terreno, la arquitectura y la forma en la que querés vivir tu casa.",
      ],
      position: "lower-left" as const,
    },
    {
      id: "diseno",
      nav: "DISEÑO",
      eyebrow: "02 — Diseño",
      title: ["Diseñada", "para tu espacio."],
      body: [
        "Dimensiones, profundidad, terminaciones y circulación se proyectan alrededor de tu casa, no desde un modelo genérico.",
      ],
      position: "left-column" as const,
      showImage: true,
    },
    {
      id: "materiales",
      nav: "MATERIALES",
      eyebrow: "03 — Materiales",
      title: ["Agua,", "luz y materia."],
      body: [
        "Revestimientos, bordes, iluminación y paisajismo trabajan juntos para transformar la pileta en parte de la arquitectura.",
      ],
      labels: ["REVESTIMIENTOS", "ILUMINACIÓN", "BORDE", "PAISAJISMO"],
      position: "right" as const,
    },
    {
      id: "contacto",
      nav: "CONTACTO",
      eyebrow: "04 — Contacto",
      title: ["Construimos", "tu próximo verano."],
      body: [
        "Contanos qué espacio tenés y te ayudamos a transformar la idea en un proyecto real.",
      ],
      position: "left-column" as const,
      showCta: true,
    },
  ],
} as const;

export type Chapter = (typeof EXPERIENCE_CONFIG)["chapters"][number];

export const whatsappHref = () => {
  const { whatsapp, message } = EXPERIENCE_CONFIG.contact;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
};

/** Total scroll distance of the experience, in viewport heights. */
export const SCROLL_VH = 800;
