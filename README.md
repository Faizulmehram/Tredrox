# Tredrox Systems website

Marketing site for Tredrox Systems. Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion for React, Lucide icons and three.js for the hero object.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
npm run typecheck  # TypeScript
```

Node 20.9 or newer.

## Configure

Copy `.env.example` to `.env.local` and fill in what you have. Nothing is hardcoded.

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, robots, social cards. Set it before deploying. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown in the contact section, footer and privacy notice. Hidden when empty. |
| `NEXT_PUBLIC_CONTACT_LOCATION` | Optional city or region line. Hidden when empty. |
| `NEXT_PUBLIC_SOCIAL_LINKEDIN` / `_GITHUB` / `_X` | Footer social links. Each one is hidden when empty. |
| `RESEND_API_KEY` | Sends contact-form enquiries via [Resend](https://resend.com). |
| `CONTACT_TO_EMAIL` | Inbox that receives enquiries (comma-separate several). |
| `CONTACT_FROM_EMAIL` | Verified sender, e.g. `Tredrox Website <website@your-domain.com>`. |

**Contact form behaviour:** with the three email variables set, enquiries are emailed with the visitor's address as reply-to. Without them, development logs each enquiry to the server console and accepts it; production answers "not connected yet" so no enquiry is silently lost. Validation runs on both client and server, there is a honeypot field for bots, and a simple per-instance rate limit (5 per 10 minutes per IP).

## Add a project

Everything lives in `src/content/projects.ts`.

1. Put images in `public/work/<slug>/` (any aspect ratio).
2. Add an object to the `projects` array: `slug`, `title`, `category`, `summary`, `tags`, `image` (with real `width`/`height`), and `size` (`"feature"` spans the row; `"wide"` and `"narrow"` pair up side by side).
3. Add a `caseStudy` (`challenge`, `solution`, optional `outcome` and `gallery`) to publish a page at `/work/<slug>` and show the "Read the case study" link. Leave it out and the card shows without a link (or links to `externalUrl` if you set one).

While `projects` is empty, the section shows a designed "case studies are being written up" state. To preview the filled layout, set `SHOW_SAMPLE_PROJECTS = true` (sample cards are badged "Sample"; turn it off before launch).

## Edit content

| What | Where |
| --- | --- |
| Services (8 modules) | `src/content/services.ts`; their illustrations in `src/components/services/ServiceVisuals.tsx` |
| What we build (layers) | `src/content/solutions.ts` |
| Why Tredrox comparison | `src/content/why.ts` |
| Process steps and deliverables | `src/content/process.ts` |
| Technology stack and marquee | `src/content/stack.ts` |
| FAQ (also emitted as FAQPage structured data) | `src/content/faq.ts` |
| Contact form options and "what happens next" | `src/content/contact.ts` |
| Site name, description, nav | `src/config/site.ts` |
| Privacy notice | `src/app/privacy/page.tsx` (have it reviewed before launch) |

## Structure

```
src/
  app/            routes: home, privacy, work/[slug], api/contact, 404, error, sitemap, robots, OG image, icon
  components/
    sections/     one file per home-page section
    hero/         hero layout pieces; heroScene.ts is the three.js glass object (lazy-loaded)
    services/     the eight service illustrations
    projects/     project card and abstract artwork
    contact/      contact form
    layout/       header, footer, motion provider
    ui/           buttons, headings, icons, small helpers
  content/        all editable copy and data
  lib/            shared validation and helpers
public/icons/     technology logos (CC0, see icons-credits.json)
```

## Notes

- **Motion** respects `prefers-reduced-motion` everywhere: the hero renders a still frame, the Solutions stack shows already apart, loops stop, and the technology strip becomes a static row. Moving content longer than five seconds has a pause control.
- **The hero object** loads three.js after the first paint, pauses when off screen or in a background tab, lowers its resolution on small or low-power devices, and falls back to a CSS rendition without WebGL.
- **Technology logos** are their owners' trademarks, used to name the tools the team works with. The footer says so.
- **Design records**: `PRODUCT.md` (product facts), `DESIGN.md` (the visual system) and `.impeccable/` (design-tool settings and the direction brief). Commit them; `.impeccable/config.local.json` stays local.
