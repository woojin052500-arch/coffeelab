"use client";

import { useEffect, useRef, useState } from "react";

/** fires once when the element enters the viewport */
export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.unobserve(e.target);
          }
        }),
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, seen];
}

export function Rv({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const [ref, seen] = useInView(0.12);
  return (
    <Tag
      ref={ref}
      className={`rv ${seen ? "on" : ""} ${className}`.trim()}
      style={{ "--rd": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Head({ title, desc, desc2 }) {
  return (
    <Rv className="head">
      <h2 className="head__t">{title}</h2>
      {desc ? <p className="head__d">{desc}</p> : null}
      {desc2 ? <p className="head__d">{desc2}</p> : null}
    </Rv>
  );
}
