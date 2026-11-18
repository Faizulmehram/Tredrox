import { NextResponse } from "next/server";
import { normalizeContact, validateContact, type ContactInput } from "@/lib/contact";

/**
 * Contact form endpoint.
 *
 * Delivery uses the Resend HTTP API when RESEND_API_KEY, CONTACT_TO_EMAIL and
 * CONTACT_FROM_EMAIL are set (see .env.example). Without them:
 *  - development: the enquiry is logged to the server console and accepted;
 *  - production: the request is refused with 503 so no enquiry is silently lost.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BODY_BYTES = 20_000;

// Best-effort, per-instance rate limit. Use a shared store (e.g. Redis) if you
// run several instances and need a strict limit.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderEmail(input: ContactInput) {
  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Email", input.email],
    ["Company", input.company || "Not given"],
    ["Project type", input.projectType],
    ["Budget", input.budget || "Not given"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${input.message}`;
  const html = `<table cellpadding="6" style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join("")}</table><p style="font-family:system-ui,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
    input.message,
  )}</p>`;
  return { text, html };
}

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return json(413, { ok: false, message: "That message is too large to send." });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, message: "The form could not be read. Refresh the page and try again." });
  }

  const input = normalizeContact(raw);

  // Bots fill the hidden field; accept quietly so they learn nothing.
  if (input.website) return json(200, { ok: true });

  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return json(422, { ok: false, message: "Some fields need a second look.", errors });
  }

  if (rateLimited(clientKey(request))) {
    return json(429, {
      ok: false,
      message: "You have sent several messages in a short time. Wait a few minutes and try again.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email delivery is not configured. Enquiry received:\n", input);
      return json(200, { ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL is missing.");
    return json(503, {
      ok: false,
      message: "The contact form is not connected yet. Please try again later.",
    });
  }

  const { text, html } = renderEmail(input);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()),
        reply_to: input.email,
        subject: `New project enquiry: ${input.projectType} from ${input.name}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("[contact] Email provider error", response.status, detail.slice(0, 500));
      return json(502, {
        ok: false,
        message: "We could not send your message just now. Please try again in a moment.",
      });
    }
  } catch (error) {
    console.error("[contact] Email request failed", error);
    return json(502, {
      ok: false,
      message: "We could not send your message just now. Please try again in a moment.",
    });
  }

  return json(200, { ok: true, delivered: true });
}
