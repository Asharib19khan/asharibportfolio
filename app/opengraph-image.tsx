import { ImageResponse } from "next/og";

export const alt = "Asharib Khan, Full-Stack AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#070809",
          color: "#ecedee",
        }}
      >
        <div style={{ display: "flex", width: 120, height: 6, background: "#ff7a2f" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -4, lineHeight: 0.9, textTransform: "uppercase" }}>
            Asharib Khan
          </div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#969ca3" }}>
            Full-Stack AI Engineer · FAST-NUCES Karachi
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 26, color: "#ecedee" }}>
          {["Developers Day 2026", "Type 19C", "BAAZ"].map((p) => (
            <div key={p} style={{ display: "flex", border: "2px solid #2a2d31", borderRadius: 999, padding: "10px 24px" }}>
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
