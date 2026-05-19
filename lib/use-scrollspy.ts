"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section id is currently in view via IntersectionObserver.
 * On mount, if `window.location.hash` matches one of `ids`, scrolls that
 * section into view and seeds active state. Designed for in-page anchor nav.
 */
export function useScrollspy(
  ids: readonly string[],
  rootMargin = "-120px 0px -55% 0px"
) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = ids.join(",");

  useEffect(() => {
    if (ids.length === 0) return;

    const initialHash = window.location.hash.slice(1);
    if (initialHash && ids.includes(initialHash)) {
      requestAnimationFrame(() => {
        const el = document.getElementById(initialHash);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
        setActiveId(initialHash);
      });
    }

    let lastActiveId: string | null = initialHash && ids.includes(initialHash) ? initialHash : null;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target.id);
        if (visible.length === 0) return;
        const firstInOrder = ids.find((id) => visible.includes(id));
        if (!firstInOrder || firstInOrder === lastActiveId) return;
        lastActiveId = firstInOrder;
        setActiveId(firstInOrder);
        window.history.replaceState(null, "", `#${firstInOrder}`);
      },
      { rootMargin, threshold: 0 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // idsKey is the stable representation of the ids array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey, rootMargin]);

  return { activeId, setActiveId };
}
