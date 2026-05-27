## Code Review Summary

### Scope
- `app/page-sun-kudos/add-link-box.tsx` (185 LOC, new)
- `app/page-sun-kudos/write-kudo-modal.tsx` (629 LOC, modified)
- `messages/vi.json`, `messages/en.json` (AddLink namespace)

### Overall Assessment
Functional, clean code with good type safety. One confirmed critical UX bug (Esc double-close). Everything else is minor or a suggestion.

---

### Critical Issues

None (security/data-loss class).

---

### High Priority

**[HIGH] Esc double-close confirmed — both modals close on a single Esc press**

`write-kudo-modal.tsx` line 165–171 registers a `keydown` listener on `document` that fires `onClose()` whenever `open && e.key === "Escape"`.

`add-link-box.tsx` line 47–54 registers its own `keydown` listener on `document` that fires `onClose()` (→ `setLinkBoxOpen(false)`) whenever `open && e.key === "Escape"`.

Both listeners are attached to `document` simultaneously. When the user presses Esc while the link box is open:
1. The AddLinkBox handler fires → `setLinkBoxOpen(false)` (correct)
2. The WriteKudoModal handler also fires → `onClose()` on the compose modal (wrong — compose closes too)

Fix: In `write-kudo-modal.tsx` Esc handler, guard against the link box being open:
```ts
function onKey(e: KeyboardEvent) {
  if (e.key === "Escape" && open && !linkBoxOpen) onClose();
}
```
Dependency array becomes `[open, onClose, linkBoxOpen]`.

---

### Medium Priority

**[MEDIUM] Inline error cleared too eagerly on text change (text field only)**

`add-link-box.tsx` line 114–116: the `onChange` for the text input clears the error as soon as the value is non-empty after trim. But if the user types `   ` (spaces), `trim()` returns `""` → error is NOT cleared and stays visible mid-typing. That's actually correct. However the URL field (line 143–145) clears the error on any truthy `e.target.value.trim()` before the user finishes typing, including values that are still invalid (e.g., typing `http` which is < 5 chars). Premature error clearing is a UX inconsistency: clear-on-fix is better than clear-on-any-input. Not a functional bug but noticeable.

**[MEDIUM] `selectionStart` fallback uses `current.length` which may differ from `el?.selectionStart`**

`write-kudo-modal.tsx` lines 128–129:
```ts
const start = el?.selectionStart ?? current.length;
const end   = el?.selectionEnd   ?? current.length;
```
`el` is typed `HTMLTextAreaElement | null`. The only case `el` is null is when `bodyRef.current` is null (i.e., the textarea is unmounted). In that case falling back to `current.length` (append at end) is acceptable and the code is correct. However, there is a subtler edge: `selectionStart`/`selectionEnd` can be `null` (not just `undefined`) on non-text inputs per the spec, but for `<textarea>` they are always numeric when the element is focused. This is safe in practice; no change needed, but worth a comment.

---

### Low Priority

**[LOW] `requestAnimationFrame` focus/cursor restore is best-effort**

`write-kudo-modal.tsx` lines 134–139: if the compose modal scrolls or another event re-focuses before the rAF callback fires, the `setSelectionRange` call still runs but the cursor may visually jump. Extremely rare; acceptable for this use case.

**[LOW] `isValidHttpUrl` passes `"http://"` (bare protocol, no host)**

`new URL("http://")` does NOT throw — it parses successfully with an empty host. `u.protocol` is `"http:"` so `isValidHttpUrl` returns `true`. The URL length check (≥5) passes too (`"http://"` is 7 chars). A user could save `[text](http://)` into the body. Fix: add `|| !u.hostname` to the return condition:
```ts
return (u.protocol === "http:" || u.protocol === "https:") && !!u.hostname;
```

**[LOW] Compose modal backdrop onClick does not stop Esc propagation**
Already covered by the HIGH fix above.

**[LOW] No `aria-describedby` linking inputs to their error messages**
The error `<p>` elements have no `id`, and the inputs have no `aria-describedby`. Screen readers will not announce the error text on focus. Add matching `id`/`aria-describedby` pairs.

---

### Edge Cases Found

- `new URL("http://")` → valid (see LOW above)
- Textarea never focused (e.g., opened via keyboard shortcut, no click): `selectionStart` defaults to `current.length` → inserts at end. Acceptable per spec.
- Inserting when `form.content` already has a selection: the selected text is replaced by the markdown link snippet — this is standard editor behavior, not a bug.
- `linkBoxOpen` is not reset when the compose modal itself closes (no `setLinkBoxOpen(false)` in the compose reset effect). If someone opens the link box, closes the compose modal (via backdrop/Esc), then reopens compose — `linkBoxOpen` starts as `false` (initial state), so this is fine. Not a bug.

---

### Positive Observations
- Validation logic is clean, well-split, and covers all required cases.
- `trim()` used consistently before validation and before passing to `onInsert`.
- `aria-modal`/`aria-label` on both dialogs is good practice.
- `role="dialog"` correctly placed on the inner container, not the backdrop.
- i18n complete and consistent across both locales; all keys present.
- `insertLink` correctly clears the content validation error (`setErrors` line 132).
- File sizes are well within the 200-line guideline.

---

### Metrics
- Type Coverage: high — no `any` usage detected
- Linting Issues: 0 critical; 1 potential (missing aria-describedby)
- Build: green per task description

---

### Score: 7.5 / 10

**Critical bugs: 0. High: 1 (Esc double-close). Low/medium bugs: 3.**

---

**Status:** DONE_WITH_CONCERNS
**Summary:** Feature is functionally correct and ships clean code. One confirmed HIGH bug: pressing Esc while the link box is open also closes the compose modal. One LOW correctness gap: `http://` (empty host) passes URL validation.
**Concerns:** The Esc double-close will be immediately noticeable to users — recommend fixing before merge.
