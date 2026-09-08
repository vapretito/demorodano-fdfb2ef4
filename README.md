# Aqua Horizon Studio

Create a premium, full-screen cinematic 3D storytelling website for a swimming pool design, construction and installation company.

The final experience should feel like a luxury architectural presentation rather than a traditional commercial website.

Adapt everything to the existing project instead of copying the original demo.

IMPORTANT:

* Detect and reuse the existing company name, logo, color palette, navigation, contact information, WhatsApp number and visual identity when available.
* Do not reuse any original demo brand or exhibition terminology.
* Keep all text, images, contact details, colors and project data inside one simple configuration object.
* The final site must clearly sell swimming pool design and construction services while preserving a minimal, immersive, editorial aesthetic.

CORE CONCEPT

The central visual element should be a premium modern residential swimming pool rather than a sculpture.

Create a 3D architectural scene consisting of:

* A modern rectangular swimming pool.
* Realistic animated water.
* Pale stone or microcement deck.
* Minimal architectural landscaping.
* Optional lounge chairs, vegetation and subtle architectural elements.
* Soft reflections and realistic lighting.
* A luxury residential atmosphere.

The pool should remain the visual focus during the complete scrolling experience.

If an existing `.glb` pool or architectural model exists in the project, use it.

Otherwise structure the component so the 3D model URL can easily be replaced through:

const EXPERIENCE_CONFIG = {
modelUrl: "...",
...
}

Do not hardcode project-specific content throughout the components.

The page should have approximately 700–900vh of scroll distance while:

* WebGL canvas remains fixed.
* Interface remains fixed.
* Scene fills 100vw × 100vh.
* Browser scrollbar is visually hidden.
* Horizontal overflow is disabled.

VISUAL DIRECTION

The visual identity should feel:

* Architectural.
* Luxurious.
* Minimal.
* Mediterranean.
* Premium.
* Contemporary.
* Cinematic.

Avoid the feeling of a technology demo.

The experience should resemble a high-end architecture studio presenting one of its most exclusive pool projects.

COLOR PALETTE

Prefer the existing brand palette when available.

Otherwise use:

Background:
#071012

Dark blue:
#071B22

Water blue:
#0B7084

Turquoise:
#19C2BB

Soft aqua:
#82E4DF

Warm stone:
#D8D1C5

White:
#F5F5F2

The turquoise tone #19C2BB can be used selectively as an accent.

Do not oversaturate the scene.

OPENING EXPERIENCE

When the page first loads:

* Begin almost completely dark.
* Slowly reveal reflections on the water.
* Fade the architecture into view.
* Smoothly move the camera toward the pool.
* Fade and scale the environment into place.
* Make the introduction feel deliberate and cinematic.

Optional opening copy:

“Diseñamos el lugar
donde empieza el verano.”

or use existing project copy when available.

3D WATER

The swimming pool water should be one of the most important elements.

Create realistic animated water using shaders or a custom material.

Include:

* Large slow waves.
* Smaller secondary ripples.
* Animated surface normals.
* Refraction-like distortion.
* Fresnel reflections.
* Soft cyan reflections.
* Darker deep-water tones.
* Moving caustic-style lighting if performance permits.
* Very subtle pointer interaction.
* Continuous slow autonomous movement.

The water must not resemble a flat animated texture.

Use layered sine waves, noise or compatible procedural deformation.

Keep motion slow and premium.

SCROLL-DRIVEN CAMERA

Scrolling should move the camera through one complete cinematic architectural journey around the swimming pool.

The camera should NOT feel mechanically tied to scroll pixels.

Smooth scroll progress using interpolation / damping.

Camera movement:

Opening:

* Begin near one corner of the pool.
* Camera relatively low.
* Frame both water and architecture.
* Slight asymmetrical composition.

Chapter 2:

* Move toward a lateral perspective.
* Slightly raise the camera.
* Reveal the pool length and edge detail.

Chapter 3:

* Move closer to the water.
* Travel near the opposite side.
* Allow reflections and water material to dominate.

Chapter 4:

* Pull back into a wider architectural hero composition.
* Finish with the entire project visible.
* Create a strong final commercial image.

The overall journey can represent approximately a 220–300 degree orbit rather than mechanically forcing a perfect circle if a better composition results.

Always keep the pool visually dominant.

CAMERA MOTION

Use:

* Smooth lerp / damping.
* Weighted delayed scroll.
* Smooth lookAt interpolation.
* Slight camera elevation changes.
* Small distance changes throughout the experience.
* Very subtle pointer-based parallax.

The scene should continue easing for a short moment after scrolling stops.

ENVIRONMENT TRANSITION

Create a subtle environmental transition through scroll.

Opening:

* Dark blue-black atmosphere.
* Early morning / twilight.
* Low brightness.
* Turquoise water reflections.
* Slight atmospheric haze.

Middle:

* Brighter aqua reflections.
* Warmer architectural surfaces.
* More visible stone texture.

Closing:

* Elegant warm sunset lighting.
* Soft golden highlights.
* Deep turquoise water.
* Architectural elements clearly visible.

The transition must happen continuously rather than switching between scenes.

LIGHTING

Use cinematic architectural lighting.

Recommended:

* Soft environment light.
* Warm directional sunlight.
* Cool light reflecting from the pool.
* Soft fill.
* Very subtle rim light.
* Contact shadows if practical.
* Soft realistic shadows.

Use ACES cinematic tone mapping.

Keep exposure controlled.

Avoid blown-out whites.

PARTICLES / ATMOSPHERE

Do NOT use obvious fantasy sparks.

Instead create subtle premium environmental particles such as:

* Small floating dust particles.
* Tiny moisture reflections.
* Very subtle glowing points near the water.
* Slow drifting atmospheric particles.

Around 150–250 particles is enough.

Use:

* Very low opacity.
* Slow movement.
* Slight vertical drift.
* Occasional soft cyan or warm reflections.

When scrolling quickly, increase turbulence slightly.

Keep this effect almost subliminal.

ARCHITECTURAL GRID

Overlay a thin fixed editorial grid above the canvas.

Desktop:

* One horizontal line below the header.
* Five vertical divisions.
* Extremely low-opacity white or aqua lines.
* Small moving dots along some grid lines.

Mobile:

* Reduce to approximately three useful vertical lines.

The grid must feel architectural rather than futuristic.

HEADER

Create a fixed minimal header.

Left:

* Company logo or brand name.
* Small uppercase text when a text logo is used.
* Wide letter spacing.

Center:
Four navigation items corresponding to chapters.

Suggested labels:

PROYECTO
DISEÑO
MATERIALES
CONTACTO

or use the project's existing navigation.

Separate items using tiny faded circular dots.

Right:
Create a compact contact CTA.

Preferred label:

COTIZAR PROYECTO

or:

HABLAR POR WHATSAPP

Use existing CTA when available.

Style:

* White or warm-white pill.
* Dark uppercase text.
* Small outlined circle after label.
* Subtle hover scale.
* Strong keyboard focus state.

Clicking the CTA should use the existing WhatsApp/contact destination when available.

STORY CHAPTERS

Create four chapters controlled by scroll.

Only one chapter should be strongly visible at a time.

Never allow chapter text to overlap.

CHAPTER 1 — EXPERIENCE

Position:
Lower-left.

Large heading:

“Tu pileta,
tu lugar.”

Alternative:

“El verano
empieza acá.”

Supporting copy example:

“No construimos solamente una pileta.
Diseñamos el espacio donde vas a pasar tus mejores días.”

Second text column:

“Cada proyecto se adapta al terreno, la arquitectura y la forma en la que querés vivir tu casa.”

Use actual company content when available.

CHAPTER 2 — DESIGN

Position:
Starting near the second vertical grid column.

Heading:

“Diseñada
para tu espacio.”

Description:

“Dimensiones, profundidad, terminaciones y circulación se proyectan alrededor de tu casa, no desde un modelo genérico.”

Reveal one editorial project image in the upper-left.

Use an existing pool/project image from the project when available.

Otherwise make the image source configurable.

Example:

projectImage1: "/images/pileta-proyecto-01.webp"

Image animation:

* Square or slightly architectural crop.
* Vertical clip-path reveal.
* Start scale around 1.12–1.15.
* Finish at scale 1.
* Very subtle border.
* Slow refined transition.

CHAPTER 3 — MATERIALS

Position:
Right half of viewport.

Heading:

“Agua,
luz y materia.”

Description:

“Revestimientos, bordes, iluminación y paisajismo trabajan juntos para transformar la pileta en parte de la arquitectura.”

As this chapter enters:

* Camera should move closer to the water.
* Increase reflections slightly.
* Highlight water movement.
* Warm stone surfaces should become more visible.

Optional small labels:

REVESTIMIENTOS
ILUMINACIÓN
BORDE
PAISAJISMO

Keep these minimal.

CHAPTER 4 — CLOSING / COMMERCIAL CTA

Position:
Around the second grid column.

Large heading:

“Construimos
tu próximo verano.”

Description:

“Contanos qué espacio tenés y te ayudamos a transformar la idea en un proyecto real.”

Add one small CTA underneath:

SOLICITAR COTIZACIÓN →

This should trigger the existing WhatsApp/contact action.

Do not add a traditional footer section.

The final camera frame should already function as the closing hero.

TEXT TYPOGRAPHY

Use an elegant editorial combination.

Suggested fonts:

https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@1,500&display=swap

Headings:

* Italiana or Playfair Display.
* High contrast.
* Large.
* Elegant.
* Strong line-height control.

Body / navigation:

* Outfit.
* Small.
* Spacious.
* Architectural.

TEXT ANIMATION

Animate each heading character individually.

Initial state:

* translateY(45–55px)
* blur(7–10px)
* opacity: 0

Final:

* translateY(0)
* blur(0)
* opacity: 1

Stagger characters:

0.025–0.04 seconds.

Use a refined cinematic easing.

Descriptions should appear after headings with:

* 15–25px upward movement.
* Opacity fade.
* Slight delay.

When a chapter exits:

* Fade it out cleanly.
* Reduce pointer interaction.
* Avoid displaying two strong headings simultaneously.

PROGRESS INDICATOR

Use the far-right grid line.

At the center place four small vertical capsules.

Each represents one chapter.

Fill sequentially according to total scroll:

0–25%
25–50%
50–75%
75–100%

Use white, turquoise or the existing brand accent.

Keep inactive segments low opacity.

CUSTOM CURSOR

Desktop only.

Create:

* Tiny white center dot.
* Larger outlined ring.
* Ring follows with damping.

On hover over:

* Links.
* CTA.
* Images.
* Clickable elements.

Increase outer ring size and add an extremely subtle translucent aqua fill.

Disable entirely on touch/mobile.

POINTER PARALLAX

Pointer movement should subtly affect:

* Camera look direction.
* Water deformation.
* Reflections.
* Optional scene rotation.

Do NOT rotate the complete pool aggressively.

The effect should feel like looking around a physical architectural model.

Maximum movement should remain restrained.

SCROLL VELOCITY

Track scroll speed.

Use it subtly to influence:

* Water turbulence.
* Atmospheric particles.
* Camera easing.
* Shader distortion.

Fast scrolling may temporarily increase energy.

Values should smoothly return to calm after scrolling stops.

RESPONSIVE

Desktop should preserve the architectural multi-column composition.

Mobile:

* Keep the 3D canvas fixed fullscreen.
* Hide center navigation.
* Keep brand + contact button.
* Reduce grid lines.
* Place chapter content lower-left.
* Ensure headings do not exceed screen width.
* Clamp font sizes.
* Reduce paragraph widths.
* Hide secondary text when vertical space is limited.
* Project image approximately 42vw.
* Simplify particles if performance drops.
* Preserve water animation.
* Preserve scroll camera movement.
* Disable custom cursor.
* Use touch movement for subtle parallax where practical.

PERFORMANCE

Target stable 60fps where practical.

Requirements:

* requestAnimationFrame.
* Cap renderer DPR at 2.
* Consider DPR 1–1.5 on lower-performance mobile devices.
* Reuse vectors instead of creating them each frame.
* Avoid React state updates inside animation loops.
* Use refs for rapidly changing values.
* Dispose geometry/materials when appropriate.
* Lazy-load heavy assets.
* Use Suspense where appropriate.
* Preload the main model.
* Compress models with Draco or Meshopt if supported.
* Prefer KTX2 compressed textures where available.
* Do not create unnecessary post-processing passes.

REDUCED MOTION

Respect prefers-reduced-motion.

When enabled:

* Remove individual character staggering.
* Greatly reduce pointer parallax.
* Reduce water deformation.
* Reduce camera easing intensity.
* Keep content readable and functional.

FALLBACK

If WebGL or the model fails:

Display:

* Deep #071012 background.
* Large soft turquoise radial lighting around the center.
* Subtle warm light near the horizon.
* Existing project imagery if available.
* All text/navigation/contact controls must remain usable.

TECHNICAL IMPLEMENTATION

Use the technology already present in the project.

Preferred when using React/Next.js:

* React Three Fiber.
* @react-three/drei.
* Three.js.
* Motion / Framer Motion for DOM animations.

Suggested architecture:

components/
immersive-pools/
PoolExperience.tsx
PoolScene.tsx
PoolWater.tsx
AtmosphericParticles.tsx
ArchitecturalGrid.tsx
CinematicCamera.tsx
StoryChapter.tsx
ChapterNavigation.tsx
CustomCursor.tsx
LoadingExperience.tsx
config.ts

Keep the main page component clean.

Create one configuration object:

export const EXPERIENCE_CONFIG = {
brand: {
name: "...",
logo: "...",
accent: "#19C2BB"
},

contact: {
label: "Cotizar proyecto",
whatsapp: "...",
},

model: {
url: "...",
},

images: {
project01: "...",
},

chapters: [
{
nav: "PROYECTO",
title: ["Tu pileta,", "tu lugar."],
body: [...]
},
...
]
}

Do not spread copy throughout JSX.

ACCESSIBILITY

* Navigation must remain keyboard accessible.
* CTA must have proper aria-label.
* Decorative canvas should not interfere with screen readers.
* Maintain adequate text contrast.
* Use semantic links/buttons.
* Do not disable focus outlines without replacing them.
* Respect reduced motion.

DO NOT ADD

Do not add:

* Pricing cards.
* Testimonials cards.
* Feature cards.
* Generic icon grids.
* FAQ.
* Traditional footer.
* Large floating panels.
* Glassmorphism cards.
* Excessive buttons.
* Neon cyberpunk visuals.
* Generic blue gradients behind text.
* Fake metrics.
* Ecommerce UI.
* Dashboard UI.

The whole page should feel like ONE continuous immersive architectural presentation.

FINAL FEEL

The experience should communicate:

“Esta empresa no instala una pileta genérica.
Diseña una parte importante de tu casa.”

The final website should feel comparable to a premium architecture studio, luxury real-estate project or high-end pool manufacturer.

It should make someone stop scrolling and think:

“Quiero algo así en mi casa.”

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://demorodano.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1d7df446-652f-448a-b9ce-ba98853e097c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
