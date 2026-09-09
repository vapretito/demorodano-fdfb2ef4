import { createFileRoute } from "@tanstack/react-router";
import { PoolExperience } from "@/components/immersive-pools/PoolExperience";
import { EXPERIENCE_CONFIG } from "@/components/immersive-pools/config";

const title = `${EXPERIENCE_CONFIG.brand.name} — Construcción y desarrollo`;
const description =
  "GMV Construcción: proyecto, dirección de obra, construcción y terminaciones para espacios contemporáneos.";

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
