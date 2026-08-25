"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";

export default function Header() {
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState(false);
  const [prog, setProg] = useState(0);
  const [cur, setCur] = useState("");

  useEffect(() => {
    const f = () => {
      const y = window.scrollY;
      setOn(y > 20);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProg(h > 0 ? Math.min(1, y / h) * 100 : 0);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) setCur(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`hdr ${on ? "on" : ""}`}>
        <div className="hdr__in">
          <a href="#top" className="mark" onClick={() => setOpen(false)}>
            <span className="mark__dot" />
            퍼먼트 커피랩
            <span className="mark__en">Ferment Coffee Lab</span>
          </a>

          <nav className="nav">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={cur === n.id ? "cur" : ""}>
                {n.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className={`burger ${open ? "on" : ""}`}
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
        <div className="bar" style={{ width: `${prog}%` }} />
      </header>

      <div className={`drawer ${open ? "on" : ""}`}>
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}>
            <i>{n.no}</i>
            {n.label}
          </a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)}>
          <i>10</i>
          문의하기
        </a>
      </div>
    </>
  );
}
