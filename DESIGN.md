---
name: Tredrox Systems
description: Engineering partner for AI products and software, drawn as an engineered stack on a near-black ground.
colors:
  ground: "#05080d"
  ground-raised: "#080c13"
  surface: "#0b1119"
  surface-2: "#101824"
  surface-3: "#16202e"
  line: "rgb(237 242 247 / 0.08)"
  line-strong: "rgb(237 242 247 / 0.15)"
  fg: "#edf2f7"
  fg-2: "#c4ccd8"
  muted: "#8b95a7"
  faint: "#6b7588"
  cobalt: "#2b63f5"
  cobalt-bright: "#4d86ff"
  cobalt-soft: "#9bbaff"
  cobalt-deep: "#0d2a7a"
  mint: "#5ef2c0"
  danger: "#ff8a80"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.25rem, 1.6vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.0625rem, 1.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.01em"
  code:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  control: "6px"
  field: "12px"
  panel: "14px"
  plate: "18px"
  frame: "20px"
  pill: "999px"
spacing:
  gutter: "clamp(20px, 4vw, 48px)"
  container: "1360px"
  section: "112px"
  section-lg: "144px"
  panel-pad: "32px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#3a70ff"
  button-primary-md:
    backgroundColor: "{colors.cobalt}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "40px"
  button-secondary:
    backgroundColor: "rgb(255 255 255 / 0.03)"
    textColor: "{colors.fg}"
    rounded: "{rounded.pill}"
    padding: "0 24px"
    height: "48px"
  button-ghost:
    textColor: "{colors.fg-2}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-pad}"
  input:
    backgroundColor: "rgb(255 255 255 / 0.03)"
    textColor: "{colors.fg}"
    rounded: "{rounded.field}"
    padding: "0 16px"
  chip-build:
    textColor: "{colors.fg-2}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
  nav-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  nav-link-active:
    backgroundColor: "rgb(255 255 255 / 0.05)"
    textColor: "{colors.fg}"
---

# Design System: Tredrox Systems

## Overview

**Creative North Star: "The Engineered Stack"**

Tredrox builds systems in layers, so the interface is drawn the way an engineer draws a system: a near-black ground, hairline edges, diagrams and specs instead of brochure cards, and one glass object made of stacked plates. The brand mark (a T built from a wide top plate over two narrow plates) is the same object at every scale: the 24px wordmark glyph, the WebGL glass stack in the hero, and the scroll-driven exploded product stack in Solutions. Reusing that one form is how the system stays recognisable without ornament.

The surface is dark, quiet and dense with real artefacts. Depth comes from tonal layering (ground, surface, surface-2) and 1px low-opacity lines, with light used sparingly: cobalt light falls onto the hero object and pools at the top of a few panels; refraction belongs to the stacked-plate object alone, and backdrop blur is limited to the scrolled header, the secondary button and the readouts that annotate the hero object. Motion is functional and short: content enters once, live readouts tick while on screen, and every loop pauses off screen and under reduced motion.

Owner-confirmed rejections carried into the visual system: purple-heavy gradients, decorative glowing circles, robot illustrations, generic AI stock imagery, Bootstrap-like layouts, a dashboard look, and rows of identical icon cards.

**Key Characteristics:**
- Near-black ground (#05080d) with tonal surfaces, never a light theme.
- Cobalt is the only saturated colour for actions and checks; mint is reserved for live or running state.
- Geist 500 headings, tightly tracked and oversized; Geist Mono only for code and data.
- 1px hairlines at 8% and 15% white; 14px panels inside 20px frames; pill-shaped controls.
- The stacked-plate T is the single brand object, reused at every scale.
- Blueprint grid lives only inside drawing surfaces.

## Colors

A near-black, cool-neutral ground carrying one saturated cobalt and a rationed mint signal.

### Primary
- **Cobalt Light** (cobalt): the primary button fill, the selection tint, the brand mark's lower gradient stop and the light that falls on the hero object. It is the action colour.
- **Bright Cobalt** (cobalt-bright): check icons, focus rings, caret, active diagram nodes, progress fills and the short rule over the hero annotation. Small marks that must read on the ground.
- **Soft Cobalt** (cobalt-soft): text-weight cobalt: inline links ("See how we work"), function names in code readouts, labels inside diagrams.
- **Deep Cobalt** (cobalt-deep): the dark end of the cobalt family, used for depth in the hero glass and stack tints.

### Secondary
- **Signal Mint** (mint): the live dot, a running agent step, a "live" row, a successful tool-call result. It answers one question: is this running right now?

### Neutral
- **Ground** (ground): page background, html, scrollbar track, the ground the hero glass refracts.
- **Ground Raised** (ground-raised) and **Surface / Surface 2 / Surface 3**: the tonal steps for panels, frames and nested blocks inside diagrams.
- **Line** (line) and **Line Strong** (line-strong): all borders and dividers; line for panels and section rules, line-strong for secondary buttons and the menu button.
- **Off-White** (fg): headings and primary text.
- **Mist** (fg-2): lead paragraphs, body copy in panels, FAQ questions at rest.
- **Muted** (muted): labels, nav links at rest, the hero annotation.
- **Faint** (faint): the muted half of a two-tone heading, placeholder text, small metadata.
- **Coral Signal** (danger): form validation errors only.

### Named Rules
**The Mint Means Running Rule.** Mint marks live or running state and nothing else: the pulsing live dot, a running step, a live row, a returned result. Checks, links and actions are cobalt. If nothing is executing, nothing is mint.

**The One Saturated Colour Rule.** Cobalt is the only saturated hue on the page. Everything else is the cool neutral ramp. No purple, no secondary accent gradients.

## Typography

**Display Font:** Geist (with ui-sans-serif, system-ui fallback)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, SFMono-Regular, Menlo fallback)

**Character:** One engineered sans at weight 500 does all the heading work, tracked tight and set large so headlines read as editorial statements; the mono appears only where the content is literally code or data.

### Hierarchy
- **Display** (500, clamp(2.75rem, 6.4vw, 6rem), 0.96, -0.04em): the hero h1 only, set in three lines that enter one after another.
- **Headline** (500, clamp(2.25rem, 4.4vw, 4rem), 1.02, -0.035em): every section h2.
- **Title** (500, clamp(1.25rem, 1.6vw, 1.5rem), 1.2, -0.02em): service names, panel headings, step titles.
- **Lead** (400, clamp(1.0625rem, 1.25vw, 1.1875rem), 1.6, fg-2): the paragraph under a heading; held to 30-38rem.
- **Body** (400, 1rem, 1.6): running copy; panel copy sits at 0.9875rem with relaxed leading, held to about 36-40rem.
- **Label** (400, 0.8125rem, 0.01em, muted): annotations, small captions, chip text. Sentence case, never uppercase.
- **Code** (Geist Mono 400, 0.78rem, 1.55, ligatures off): tool calls, JSON, endpoints, data inside diagrams and readouts.

### Named Rules
**The Contrast From Tone Rule.** When a heading carries two sentences, the second is set in faint, not in a gradient. Gradient text is never used. The shipped instance is the Services heading ("Intelligent solutions. Engineered to scale.").

**The No Kicker Rule.** Headings stand alone. No eyebrow, kicker or small uppercase label above a heading; if the heading needs context, the lead paragraph under it supplies it.

**The Case Rule.** Buttons are Title Case ("Start a Project", "See What We Build"); headings and everything else are sentence case.

## Layout

One container carries every block: max 1360px, centred, with a fluid side gutter of clamp(20px, 4vw, 48px). Desktop compositions sit on a 12-column grid (headings on columns 1-5 to 1-7, supporting content offset to start at column 6, 8 or 9), collapsing to a single column below 1024px. Sections are spaced generously: 112px vertical padding on phones, 144-160px from the large breakpoint. Anchored sections clear the 64px fixed header with a 72px scroll margin.

The hero is a full small-viewport-height screen: the three-line display heading over columns 1-8, the glass object drawn right of centre on a canvas that spans the right ~64% (its light and grid run behind the heading, the object itself never overlaps it; owner feedback 2026-11-18), actions bottom-left, and the technology marquee as its bottom band behind a hairline rule with small crosshairs at its ends. On phones the object drops beneath the copy and bleeds to the screen edges. Hairlines at the content edges frame the hero.

Interactive explorers switch form by breakpoint rather than shrinking: the Services index-plus-panel becomes an accordion on phones; horizontal flow diagrams become vertical ones.

## Elevation & Depth

Depth is tonal first: ground, then surface panels with a 3% white top-wash fading out by 40%, then nested surface-2/3 blocks inside diagrams. Borders, not shadows, define edges. Shadows exist only as light: cobalt glow under primary buttons and lit states, and a dark drop under floating glass readouts. Translucency with backdrop blur is reserved for the scrolled header, the secondary button and the hero readout chips.

### Shadow Vocabulary
- **Button lift** (`box-shadow: 0 1px 0 0 rgb(255 255 255/0.25) inset, 0 10px 30px -10px rgb(43 99 245/0.7)`): primary buttons at rest; hover deepens to `0 14px 36px -10px` at 0.85.
- **Focus halo** (`box-shadow: 0 0 0 4px rgba(43,99,245,0.18)`): focused form fields.
- **Lit node** (`box-shadow: 0 0 0 6px rgba(43,99,245,0.12-0.18)`): the active step in Process and Stack diagrams.
- **Lit plate** (`box-shadow: 0 0 0 1px rgba(77,134,255,0.35), 0 40px 80px -30px rgba(43,99,245,0.55)`): the active layer of the Solutions exploded stack.
- **Floating readout** (`box-shadow: 0 18px 40px -18px rgba(0,0,0,0.9)`): glass chips pinned to the hero object.

### Named Rules
**The Light Falls On Something Rule.** Cobalt glow always belongs to an object: a button, a lit node, the hero glass, the top of a panel. No free-floating glows or orbs on the ground.

**The Blueprint Inside The Drawing Rule.** The 96px blueprint hairline grid (4.5% white) is used only inside drawing surfaces: diagram panels, service visual canvases, project artwork, and the backdrop the hero glass refracts. It is never a decorative page or section background, and never runs behind body text.

## Shapes

A small, consistent radius family that nests: pill controls (999px) for buttons, nav links, chips and status badges; 12px for form fields and floating readouts; 14px panels; 18px plates in the exploded stack; 20px frames around media and large diagrams; 4-6px on tiny elements inside drawn UIs. Every edge is a 1px line at 8% white, 15% for controls that need to read as tappable. The recurring silhouette is the stacked plate: a wide, softly rounded slab above narrower slabs, used in the mark, the hero object and the Solutions stack.

## Components

### Buttons
Confident pills with a lit underside.
- **Shape:** fully rounded (999px), medium weight, -0.01em tracking, Title Case labels, optional up-right arrow that nudges 1px on hover.
- **Primary:** cobalt fill, white text, button-lift shadow; 48px tall with 24px padding (large) or 40px with 18px (header).
- **Hover / Focus:** fill lightens to #3a70ff and the glow deepens; 2px cobalt-bright outline at 4px offset on focus; press scales to 0.97.
- **Secondary:** 3% white fill, line-strong border, light backdrop blur; hover raises border to 25% white and fill to 7%.
- **Ghost / inline link:** soft-cobalt text with an underline that draws left to right on hover.

### Chips
- **Build chips:** pill, 1px line border, fg-2 text at 0.8125rem, led by a cobalt-bright check.
- **Status badges (inside drawn UIs):** pill, mint tint with mint text only when live; 10% white otherwise.

### Cards / Containers
- **Corner Style:** 14px panel; 20px frame for media and large diagrams.
- **Background:** surface with a 3% white top-wash; optional cobalt pool (radial, 14-16%) at the top edge of a featured panel.
- **Shadow Strategy:** none at rest; see Elevation.
- **Border:** 1px line.
- **Internal Padding:** 20px on phones, 28-36px on desktop.

### Inputs / Fields
- **Style:** 12px radius, 3% white fill, 1px border, fg text, faint placeholder, cobalt caret.
- **Focus:** border turns cobalt-bright, fill rises to 5%, 4px cobalt focus halo; no outline.
- **Error / Disabled:** coral text and border for errors; disabled controls drop to 60% opacity.

### Navigation
- **Header:** fixed, 64px; transparent over the hero, then 75% ground with heavy backdrop blur and a hairline once scrolled. Wordmark left, centred pill nav, primary button right.
- **Links:** 0.875rem muted, hover to fg; the active section gets a pill with 5% white fill and a line border that slides between items.
- **Mobile:** a full-height ground panel that wipes down from the header with large 1.75rem links on hairline rows and a full-width primary button.

### Live Readout (signature)
Small glass cards (12px radius, 12% white border, 70% #0a1019 with backdrop blur) pinned to the hero object, showing a running system: an agent run with a mint live dot and a cobalt progress bar, an MCP tool call in mono with a cobalt function and a mint result. They tick while on screen and pause otherwise.

### Stacked-Plate Object (signature)
The brand mark built in 3D: glass plates with a lit cobalt core and an etched circuit, refracting a blueprint grid. It eases apart under the pointer in the hero and is re-staged in Solutions as a scroll-driven exploded stack whose plates name what Tredrox builds, the active plate lit with a cobalt-bright edge.

## Do's and Don'ts

### Do:
- **Do** keep the ground #05080d and build depth from surface steps and 1px lines at 8% / 15% white.
- **Do** use cobalt for every action, check, focus ring and active node.
- **Do** reserve mint for live or running state, paired with motion (the pulsing dot) or a running label.
- **Do** set headings in Geist 500 with tight negative tracking, and give a two-sentence heading its second sentence in faint.
- **Do** show work as drawn artefacts (diagrams, flows, code readouts) inside panels, with the blueprint grid confined to those drawing surfaces.
- **Do** reuse the stacked-plate T for any brand object rather than inventing a new one.
- **Do** pause every loop off screen and under reduced motion.

### Don't:
- **Don't** use gradient text; contrast comes from tone.
- **Don't** put a kicker, eyebrow or uppercase label above a heading.
- **Don't** lay the blueprint grid behind a section or page as decoration, or behind headings and body text.
- **Don't** use mint for checks, success decoration, links or syntax colouring.
- **Don't** introduce purple-heavy gradients, decorative glowing circles, robot illustrations or generic AI stock imagery.
- **Don't** build rows of identical icon cards or a dashboard look.
- **Don't** spread glass: refraction belongs to the stacked-plate object, and backdrop blur stays on the scrolled header, the secondary button and the hero readouts.

## Motion and Material Additions (polish pass, 2026-11-18)

Recorded after the documented build, from the shipped code.

### Material
- **Lit panel edge.** `.panel` uses a gradient border: brighter at the top edge (off-white 16%), fading through the sides, with a cobalt catch (22%) at the bottom, plus a faint top sheen on the face. Panels read as made objects, never as plain outlines.
- **Light pools.** `.light-pool` is a soft cobalt radial placed *under* a focal object (About diagram, Services stage, Stack route, contact form). Never free-floating; it obeys "Light Falls On Something".
- **Film grain.** One fixed fractal-noise layer at 4.5% overlay over the whole page, to remove gradient banding.

### Motion
- **Reveal grammar.** Elements marked `data-reveal` enter once: fade, 22px rise and 8px blur clearing over 900-1100ms on `--ease-out`, ordered by `--i` at 90ms steps. Headings (`data-reveal="heading"`) unmask upward with a clip; large objects (`data-reveal="object"`) settle from 0.975 scale and 12px blur. Hidden states apply only under `html.js`, so nothing is hidden without JavaScript; reduced motion gets a plain 400ms fade.
- **Packets.** Diagrams move information as glowing packets along lit routes (SVG `animateMotion`). A source flashes as it sends, a destination as it receives, and both share their route's duration so they stay in step. SVG motion pauses off screen and under reduced motion.
- **Agent-run trace.** The AI Agents service module is a swimlane trace (Supervisor, Researcher, Writer, Reviewer): hand-offs draw one after another from sender to receiver with their message, the receiver lights, the run reads Running until approved, then holds and replays while on screen; reduced motion shows the finished run.
- **Synced stations.** On the Stack route, each station's ring pulses as the travelling packet passes it (3.2s cycle).
- **Process head light.** A point of light rides the drawing end of the Process timeline.
- **Engraved closing wordmark.** The footer wordmark is an SVG outline lit by a cobalt point that follows the pointer and drifts on its own; it runs only on screen and sits still under reduced motion.

### Don't
- Don't hide content with a reveal that depends on an IntersectionObserver alone: a fast jump can skip it. The shipped observer also sweeps on scroll and reveals anything already above the fold line.
- Don't read the reduced-motion media query during the first client render; use `usePrefersReducedMotion` (hydration-safe).

### Restraint revision (owner feedback, 2026-11-18)
The owner judged the glass-capsule nav and glowing pill buttons as reading "AI-made". Settled since:
- **Navigation** is a plain bar on the page grid: wordmark, then a breadcrumb naming the section being read ("Tredrox / Services", xl and up), text links with a drawn hover underline, a 1px off-white line under the current link, and one flat action. Transparent over the hero; solid ground with one hairline once scrolled. No glass capsule, glow, glowing dots or logo tile.
- **Buttons** are one system: 8px radius (`rounded-lg`), flat cobalt with a 1px top highlight for primary, hairline outline for secondary. No coloured glow shadows and no shimmer sweeps. This supersedes the pill shape listed under Components.
- Glow stays reserved for light that falls on something (the hero object, light pools under focal objects); it never decorates controls.

### Hero object: the processor (owner feedback, 2026-11-18)
The owner found the glass T-stack too abstract for an AI engineering company. The hero object is now an **AI processor on a circuit board** (`src/components/hero/heroScene.ts`):
- A glossy chip package with metal pins and a clear glass lid; through the lid, a die of cores that light as they compute, with the Tredrox T etched at its centre (the brand tie).
- Traces fan out from every pin into the dark; cobalt packets travel in, mint packets (results, live state) travel out.
- Interaction: the board leans toward the pointer and a soft pool of light follows it across the traces; hovering the chip makes the cores work harder and the data run faster (the custom cursor opens over it); a click sends a ripple and a burst of data; scrolling lifts the lid.
- The board is unlit and fades to the exact ground colour, so it never shows an outline; the hero has no separate background tint behind it.
- The stacked-plate form remains the brand mark and the Solutions exploded stack; it is no longer the hero object.

### Hero callouts replace the floating readout cards (owner feedback, 2026-11-18)
The frosted "Agent run" / "MCP server" cards read as AI-generated. They are now **engineering-drawing callouts** (`src/components/hero/HeroCallouts.tsx`): a 4px ring on the exact part, a 1px off-white hairline leader, an underline rule, and two lines of type (11px muted label, 13px value; code values in Geist Mono). No box, fill, blur or border. Anchors are projected from the 3D scene every frame, so leaders stay pinned while the board moves; labels flip sides or clamp to stay inside the hero. Agent callout from tablet up, MCP callout from laptop up, none on phones. This supersedes the "Live Readout" component.
