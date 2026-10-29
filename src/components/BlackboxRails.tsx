import React from "react";

export function BlackboxRails({ position = "bottom" }: { position?: "bottom" | "top" | "both" }) {
  return (
    <div className="blackbox-rails blackbox-rail" aria-hidden="true">
      <div style={{ position: "relative", width: "100%", height: "100%", maxWidth: "var(--bx-frame)" }}>
        <span className="blackbox-rail-hatch" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "var(--bx-gutter)" }} />
        <span className="blackbox-rail-hatch" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "var(--bx-gutter)" }} />
        <span className="blackbox-rail-v" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "1px" }} />
        <span className="blackbox-rail-v" style={{ position: "absolute", left: "var(--bx-gutter)", top: 0, bottom: 0, width: "1px" }} />
        <span className="blackbox-rail-v" style={{ position: "absolute", right: "var(--bx-gutter)", top: 0, bottom: 0, width: "1px" }} />
        <span className="blackbox-rail-v" style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "1px" }} />
      </div>
      {(position === "bottom" || position === "both") && (
        <span className="blackbox-rail-h" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "1px" }} />
      )}
      {(position === "top" || position === "both") && (
        <span className="blackbox-rail-h" style={{ position: "absolute", left: 0, right: 0, top: 0, height: "1px" }} />
      )}
      <span style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <span style={{ position: "relative", width: "100%", maxWidth: "var(--bx-frame)" }}>
          {(position === "bottom" || position === "both") && (
            <>
              <span className="blackbox-rail-cross" style={{ position: "absolute", bottom: 0, left: 0 }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", bottom: 0, left: "var(--bx-gutter)" }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", bottom: 0, right: "var(--bx-gutter)" }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", bottom: 0, right: 0 }} />
            </>
          )}
          {(position === "top" || position === "both") && (
            <>
              <span className="blackbox-rail-cross" style={{ position: "absolute", top: 0, left: 0 }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", top: 0, left: "var(--bx-gutter)" }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", top: 0, right: "var(--bx-gutter)" }} />
              <span className="blackbox-rail-cross" style={{ position: "absolute", top: 0, right: 0 }} />
            </>
          )}
        </span>
      </span>
    </div>
  );
}

export default BlackboxRails;
