import { ImageResponse } from "next/og";

export const alt =
  "Felix Nampanya — Software Engineer · Evenmint household expense splitting";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #0f172a 0%, #1e40af 42%, #38bdf8 100%)",
          color: "#f8fafc",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Felix Nampanya
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 500,
            opacity: 0.92,
            maxWidth: 900,
            lineHeight: 1.35,
          }}
        >
          Software engineer · Android, web & backend
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            fontWeight: 500,
            opacity: 0.88,
            paddingTop: 28,
            borderTop: "1px solid rgba(248,250,252,0.35)",
            maxWidth: 920,
            lineHeight: 1.4,
          }}
        >
          Evenmint — household expense splitting & settlement without spreadsheet chaos
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
