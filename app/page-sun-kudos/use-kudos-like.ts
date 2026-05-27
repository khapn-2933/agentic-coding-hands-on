"use client";

import { useState, useTransition } from "react";
import { toggleLike } from "@/lib/sun-kudos/actions";
import type { KudosEntry } from "./mock-data";

/**
 * Optimistic like toggle shared by the Highlight + All Kudos cards.
 * Reverts on server error; disabled for the user's own kudos.
 */
export function useKudosLike(kudos: KudosEntry) {
  const [liked, setLiked] = useState(kudos.isLiked);
  const [count, setCount] = useState(kudos.likeCount);
  const [pending, startTransition] = useTransition();
  const disabled = !!kudos.isOwn;

  function toggle() {
    if (disabled || pending) return;
    const next = !liked;
    // Optimistic update (+/- 1; special-day 2× handled server-side later).
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const res = await toggleLike(kudos.id);
      if (!res.ok) {
        setLiked(!next);
        setCount((c) => c + (next ? -1 : 1));
      } else if (typeof res.liked === "boolean" && res.liked !== next) {
        // Reconcile if the server disagreed (e.g. duplicate state).
        setLiked(res.liked);
        setCount((c) => c + (res.liked ? 1 : -1) - (next ? 1 : -1));
      }
    });
  }

  return { liked, count, toggle, disabled };
}
