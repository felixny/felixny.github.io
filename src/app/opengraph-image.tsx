import { ImageResponse } from "next/og";

export const alt =
  "Felix Product Lab by Felix Nampanya";

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
          background: "#12100e",
          color: "#f7f0e4",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.15 }}>
          Felix Product Lab
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
          Felix Nampanya · Software Engineer
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            fontWeight: 500,
            opacity: 0.88,
            paddingTop: 28,
            borderTop: "1px solid rgba(247,240,228,0.35)",
            maxWidth: 920,
            lineHeight: 1.4,
          }}
        >
          Working micro-demos for product software, Android systems, automation tooling, and data-heavy UI.
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
