# Design System Strategy: High-End Cinematic Editorial

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Monolith & The Void."** 

This system moves away from the cluttered, component-heavy aesthetic of standard SaaS platforms and moves toward a cinematic, high-end editorial experience. It is inspired by the precision of Japanese technical design and the sprawling, atmospheric layouts of luxury fashion and high-concept entertainment. 

We break the "template" look through **extreme negative space**, **asymmetric balance**, and **intentional typographic scaling**. Layouts should feel like a film’s title sequence—stable but emotionally charged. We favor hard edges, monolithic blocks of color, and high-contrast transitions to create a sense of scale and institutional authority.

---

## 2. Colors
The palette is a disciplined exploration of monochromatic depth. It relies on subtle temperature shifts between cool whites and deep, light-absorbing blacks.

*   **Primary (#FFFFFF):** Used for critical high-contrast typography and "active" monolithic surfaces.
*   **Surface (#131313):** The "Void." This is the base layer for all immersive experiences.
*   **Neutral-Tone (#4A4A4A):** Used for secondary editorial text and metadata, providing a softer contrast against the dark background.
*   **Background-Light (#F5F6F7):** Reserved for high-light, high-legibility document sections or inverted "Gallery" modes.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited for sectioning.** To separate content, you must use:
1.  **Background Shifts:** Transition from `surface` to `surface_container_low`.
2.  **Negative Space:** Use the `20` (7rem) or `24` (8.5rem) spacing tokens to create a psychological boundary.
3.  **Hard Tonal Steps:** A solid block of `surface_bright` against `surface_dim`.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of technical materials.
*   **Base:** `surface` (#131313)
*   **Nested Containers:** Place `surface_container_lowest` (#0E0E0E) cards on a `surface` background to create "recessed" depth. Use `surface_container_high` (#2A2A2A) for elements that should feel physically closer to the user.

### Signature Textures
Main CTAs or Hero elements should utilize a subtle gradient transition from `primary` to `primary_container`. This adds a "metallic" or "technological" sheen that prevents the interface from feeling flat or sterile.

---

## 3. Typography
Typography is the voice of this system. It is divided into **Technical Branding** (Rajdhani) and **Editorial Content** (Geom-Graphic/Space Grotesk).

*   **Display & Headline (Geom-Graphic / Space Grotesk):** These should be treated as graphic elements. Use wide tracking and all-caps for `display-lg` to mimic film title cards. The high x-height and geometric forms convey a sense of modern engineering.
*   **Body (Inter / Rajdhani):** Body copy is designed for high-density information. `body-md` (0.875rem) provides a clean, technical contrast to the massive headlines.
*   **Labels (Space Grotesk):** Used for micro-copy and technical data points. These should always be uppercase with `0.1em` letter spacing to maintain the "interface" aesthetic.

---

## 4. Elevation & Depth
In this system, elevation is a matter of **light and opacity**, not structure.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card on a `surface` background creates a natural, soft lift without the need for visual "noise" like borders.
*   **Ambient Shadows:** If an element must float (e.g., a modal), use an ultra-diffused shadow: `box-shadow: 0 20px 50px rgba(0,0,0, 0.5)`. The shadow color must be a darker version of the surface color, never a generic gray.
*   **Glassmorphism & Depth:** For navigation bars or floating menus, use a `backdrop-blur: 20px` combined with a 40% opaque `surface` color. This allows the cinematic imagery beneath to bleed through, integrating the UI into the content.
*   **The Ghost Border Fallback:** If accessibility requires a border, use the `outline_variant` at 15% opacity. It should be barely perceptible, felt rather than seen.

---

## 5. Components

### Buttons
*   **Primary:** Sharp 0px corners. Solid `primary` (#FFFFFF) background with `on_primary` (#1A1C1C) text. Hover state: slight shift to `primary_container`.
*   **Secondary:** Ghost style. Transparent background with a `Ghost Border` (outline-variant at 20%).
*   **Tertiary:** All-caps text with a 1px `primary` underline that expands on hover.

### Cards & Lists
*   **Forbidden:** Dividers or horizontal lines.
*   **Implementation:** Group list items using background-color nesting (`surface_container_low`). Use `spacing-6` (2rem) as the minimum padding between logical groups.
*   **Media Cards:** Images should use a "Ken Burns" subtle zoom effect on hover to maintain the cinematic feel.

### Input Fields
*   **Style:** Minimalist. No containing box. Only a bottom-border using `outline_variant` at 30% opacity. 
*   **States:** On focus, the bottom border scales to 2px and becomes `primary` white.

### Additional Signature Component: The "Angled Monolith"
Use the `45-degree clip-path` on header containers or buttons (as seen in the reference logo/nav area) to break the 90-degree monotony. This creates a "forward-leaning" technical aesthetic.

---

## 6. Do's and Don'ts

### Do:
*   **Embrace the Void:** Let content breathe. If you think there is enough white space, add 20% more.
*   **Use Hard Edges:** Keep all `border-radius` tokens at `0px`. Roundness undermines the technical authority of this system.
*   **Scale Typographic Contrast:** Pair a `display-lg` (3.5rem) headline with `body-sm` (0.75rem) technical labels for high visual impact.

### Don't:
*   **No Default Shadows:** Never use standard "drop shadows." They look "cheap" and "web-like."
*   **No Dividers:** If you need a line to separate content, you have failed the layout. Use tonal shifts or space.
*   **No Vibrant Colors:** This is a monochromatic system. The only color should come from the imagery/photography. The UI must remain a neutral, sophisticated frame for the content.
