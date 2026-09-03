"use client";

import { useEffect, useState } from "react";
import { COMPANY } from "@/lib/content";
import { openTest } from "./TestLauncher";

export default function MobileBar() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const f = () => setOn(window.scrollY > window.innerHeight * 0.7);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <div className={`mbar ${on ? "on" : ""}`}>
      <a href={`tel:${COMPANY.telRaw}`} className="mbar__a mbar__a--red">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="M4.2 1.8 6 4.4 4.6 6c.7 1.5 2 2.8 3.4 3.4L9.6 8l2.6 1.8-.5 2.3c-.1.5-.6.9-1.1.8C5.9 12.3 2.7 9.1 2 4.4c-.1-.5.3-1 .8-1.1l1.4-1.5Z"
            fill="currentColor"
          />
        </svg>
        전화 문의
      </a>
      <a href={`mailto:${COMPANY.email}`} className="mbar__a">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <rect x="1.5" y="3" width="12" height="9" stroke="currentColor" strokeWidth="1.3" />
          <path d="M1.9 3.6 7.5 8l5.6-4.4" stroke="currentColor" strokeWidth="1.3" />
        </svg>
        이메일
      </a>
      <button type="button" className="mbar__a mbar__a--dark" onClick={openTest}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
          <path
            d="M3.4 2.2h7.1v3.3a3.55 3.55 0 0 1-7.1 0V2.2Zm7.4 1h.9a1.5 1.5 0 0 1 0 3h-.9M2.6 12.8h9.8"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
        취향 테스트
      </button>
    </div>
  );
}
