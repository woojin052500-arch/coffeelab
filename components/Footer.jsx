import { COMPANY } from "@/lib/content";

export default function Footer() {
  const c = COMPANY;
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <span>
            {c.name} · {c.ceo} {c.role}
          </span>
          <span>
            {c.tel} · {c.email}
          </span>
          <span>© 2026 {c.en}</span>
        </div>
      </div>
    </footer>
  );
}
