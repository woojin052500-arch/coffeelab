"use client";

import { useEffect, useState } from "react";

export default function ToTop() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const f = () => setOn(window.scrollY > window.innerHeight);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <button
      type="button"
      className={`top ${on ? "on" : ""}`}
      aria-label="맨 위로"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
        <path d="M7.5 12.5V3M7.5 3L3.5 7M7.5 3l4 4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
  );
}
