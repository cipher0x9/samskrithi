# 🕉️ SamSkrithi — EMERGENCY FIX: INSPECT + REPAIR

> **To:** Grok Build (INSPECTOR MODE)
> **From:** CypHer_M0Nk3Y
> **Mission:** The app is deployed but broken. Inspect every file. Fix every bug. Make it work.

---

## CURRENT STATE (Verified by CypHer)

- **Live:** https://samskrithi-omega.vercel.app
- **API /daily:** ✅ 200, real panchanga data
- **API /validate:** ✅ 401 for invalid auth (correct)
- **API /me:** ❌ 401 when no initData (expected outside TG)
- **Supabase:** ✅ Connected
- **User reports:** "buttons features not working at all"

---

## PHASE 1: INSPECT (Read every file, find every bug)

Read ALL source files in `/Users/cypher0x9/Build/samskrithi/`. Specifically check for:

### Critical Bug Patterns to Find:
1. **Missing null/undefined checks** — accessing `.map()` or `.length` on undefined
2. **Import errors** — wrong paths, missing exports
3. **API call failures** — not handling 401 gracefully (should show mock data, not crash)
4. **Event handler bugs** — onClick handlers that throw errors
5. **Supabase query errors** — queries to tables that don't exist, wrong column names
6. **TypeScript errors** — any `as` casts hiding bugs
7. **CSS issues** — invisible elements, overlapping, z-index
8. **React hook violations** — hooks in wrong order, missing deps

### Specific Components to Inspect:
- `components/Game/AksharaBoard.tsx` — does it actually work? Drag-drop?
- `components/Game/QuizRunner.tsx` — does it render questions?
- `components/Card/WisdomCard.tsx` — does language switch work?
- `components/Robo/SamSkrithiRobo.tsx` — does it animate? Does popup open?
- `components/Onboarding/*` — does it block the app correctly?
- `app/page.tsx` — dashboard, does it handle no-auth state?
- All `app/api/*` routes — do they handle edge cases?

---

## PHASE 2: FIX (Repair everything)

For every bug found, fix it. Rules:
- **Noauth/outside-TG mode:** App must work WITHOUT auth. Show mock/guest experience. Don't crash.
- **Error boundaries:** Every page needs try/catch or error boundary.
- **Loading states:** Show spinner while fetching, not blank screen.
- **Empty states:** Show friendly message when no data, not error.
- **Button handlers:** Every onClick must have error handling.

### Specific Fixes Required:

1. **Dashboard must work without auth** — show guest panchanga + guest card
2. **Games must be playable without auth** — just don't save scores (show "Login to save" toast)
3. **Robo must appear and work** — test: tap Robo → popup opens with wisdom
4. **Theme toggle must work** — test: switch theme → colors change
5. **Language tabs must work** — test: tap Hindi → Hindi translation shows
6. **WeekView must scroll** — test: swipe → 7 days visible
7. **Onboarding must complete** — test: go through flow → reaches dashboard

---

## PHASE 3: COMPLETE WISDOM FACTS

Codex crashed and only delivered 15 facts. Fix: read `data/wisdom.json`, add 85+ more facts. All 12 categories. Min 3 languages per fact (en, hi, te). Cite real sources. No AI hallucinations.

Target: **100+ facts total.**

---

## PHASE 4: VERIFY + DEPLOY

After all fixes:
1. `npm run build` — MUST pass with ZERO errors  
2. `npm run lint` — MUST pass
3. Test locally: `npm run dev` → open in browser → every button works
4. Commit + push to GitHub
5. Deploy to Vercel
6. Test on live URL

---

## OUTPUT

When done, report:
- Bugs found: [count]
- Bugs fixed: [count]  
- Wisdom facts: [before → after count]
- Build: [pass/fail]
- What was broken and why

---

## RULES
- **Read before you write.** Inspect the actual files.
- **Test every fix.** Don't assume.
- **The app must work WITHOUT Telegram.** Guest mode is mandatory.
- **No new features.** Only fixes. This is a repair mission.

**सत्यमेव जयते — Fix it.**
