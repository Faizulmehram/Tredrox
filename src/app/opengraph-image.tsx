import { ImageResponse } from "next/og";

export const alt = "Tredrox Systems: engineering the intelligence behind what's next";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(60% 70% at 78% 40%, rgba(43,99,245,0.35), rgba(5,8,13,0) 70%), #05080d",
          color: "#edf2f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 64, height: 18, borderRadius: 5, background: "linear-gradient(135deg,#9bbaff,#2b63f5)" }} />
            <div style={{ width: 24, height: 14, borderRadius: 4, background: "rgba(237,242,247,0.92)" }} />
            <div style={{ width: 24, height: 14, borderRadius: 4, background: "rgba(237,242,247,0.5)" }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1 }}>Tredrox Systems</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.02, letterSpacing: -3, maxWidth: 920 }}>
            Engineering the intelligence behind what&apos;s next.
          </div>
          <div style={{ fontSize: 28, color: "#8b95a7" }}>
            AI agents · LLM integrations · SaaS · Business automation
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
