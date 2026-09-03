"use client";

import { useCallback, useEffect, useState } from "react";
import CoffeeTest from "./CoffeeTest";
import { OPEN_TEST } from "./TestLauncher";

export default function CoffeeTestRoot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setOpen(true);
    window.addEventListener(OPEN_TEST, on);
    return () => window.removeEventListener(OPEN_TEST, on);
  }, []);

  // 뒤로가기로 팝업이 닫히도록 히스토리에 한 칸 쌓는다 (모바일에서 특히 중요)
  useEffect(() => {
    if (!open) return;
    window.history.pushState({ ferment: "test" }, "");
    const pop = () => setOpen(false);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [open]);

  const close = useCallback(() => {
    if (window.history.state?.ferment === "test") window.history.back();
    else setOpen(false);
  }, []);

  return <CoffeeTest open={open} onClose={close} />;
}
