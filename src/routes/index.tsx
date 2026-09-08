import { createFileRoute } from "@tanstack/react-router";
import { PoolExperience } from "@/components/immersive-pools/PoolExperience";
import { EXPERIENCE_CONFIG } from "@/components/immersive-pools/config";

const title = `${EXPERIENCE_CONFIG.brand.name} — Diseño y construcción de piletas`;
const description =
  "Estudio de diseño, construcción e instalación de piletas de autor. Proyectamos el agua como parte de la arquitectura de tu casa.";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PoolExperience,
});
