# 🕉️ SamSkrithi — PHASE 2 PLAN (Supervisor Edition)

**Status**: Active Execution  
**Supervisor**: Grok (GOD MODE)  
**Builders**: Codex CLI (Tasks 1 & 3), Claude Code / subagent (Task 2)  
**Date**: 2026-06-19  
**Goal**: Make SamSkrithi a living cultural platform. Robo is the star.

---

## 1. Current State (Post-Inspection)

- **Repo**: `/Users/cypher0x9/Build/samskrithi` (cipher0x9/samskrithi)
- **Live**: https://samskrithi-omega.vercel.app
- **Tech**: Next.js 16 App Router, React 19, Tailwind 4, lucide-react, framer-motion, Supabase (fihrssxryzmfbipgmlva)
- **Tables** (12): users (has tz_offset + language_code + prefs), panchanga, mantras, translations, game_sessions, daily_challenges, user_cards, leaderboards, families, family_members, tournaments, nft_claims. Indexes and streak triggers present (UTC-based; app layer must adjust).
- **No**:
  - wisdom_facts table
  - data/wisdom.json
  - Robo components
  - Onboarding
  - Theme switching (single Temple Dark in globals.css)
  - Week view or /api/weekly
  - Channels page
  - tz_offset respected in daily
- **Strengths**:
  - Noto Sans Devanagari preloaded in layout
  - BottomNav uses lucide icons
  - Good separation: lib/, components/, api/
  - CardActions has basic TTS via speechSynthesis
  - /api/daily + /me functional (with mocks)
- **Files**: ~38 in source. Clean TS.

**Git**: One untracked GROK-PHASE2.md (the prompt mirror).

---

## 2. Phase 2 Scope (Prioritized)

1. **First-Time Onboarding Flow** (Critical path)
2. **Theme System** (Temple Dark / Saffron Light / Forest Green)
3. **Icon System** (lucide + custom Om SVG etc.; reduce emoji surface)
4. **SamSkrithi Robo** (THE star feature — floating, animated, wisdom popup)
5. **Timezone-Aware Panchangam + Cards + Week View**
6. **Multi-Channel Telegram + Share Tracking**
7. **Performance Optimization** (lazy, cache, fonts already strong)

All must fit existing architecture (TG initData auth, Vercel Edge/Functions + Supabase service role, client-only TG WebApp).

---

## 3. Architecture Decisions (Supervisor)

### 3.1 Timezone & Personalization
- Client always detects `Intl.DateTimeFormat().resolvedOptions().timeZone` and computes `tz_offset = -new Date().getTimezoneOffset()` (minutes from UTC).
- Pass to API: `GET /api/daily?date=...&tz_offset=330`
- New helper in `lib/utils.ts`:
  ```ts
  export function getLocalDateISO(tzOffsetMinutes: number = 0): string { ... }
  ```
- Server computes user's "today" for panchanga query and challenges.
- Dashboard shows:
  - Local weekday + date
  - Panchanga for local today
  - "This Week" (WeekView component)
- Streak trigger remains DB UTC; personalization (deity_of_day, special) uses local.
- Onboarding stores tz_offset + language_code (override TG default) + prefs.onboarded = true.

### 3.2 Themes
- Pure CSS custom properties + `data-theme` on `<html>`.
- Three theme objects defined in globals.css.
- ThemeToggle reads/writes `user.prefs.theme` (or local fallback) + `document.documentElement.setAttribute('data-theme', value)`.
- Smooth `transition: background 200ms, color 200ms`.
- Respect TG `WebApp.colorScheme` on first load if no saved pref.
- Default: `temple` (current dark).

CSS vars example (to be expanded by builders):
```css
[data-theme="saffron"] {
  --bg-deep: #fff8e8;
  --bg-card: #fff1d6;
  --gold: #c45c26;
  /* ... */
}
```

### 3.3 Icons
- lucide-react (already dep) for generic: Home, Gamepad2, Sprout, User, Sun, Moon, Star, Flame etc.
- Custom for cultural:
  - `components/Icons/Om.tsx` (simple SVG, gold stroke, small glow)
  - Later: crescent, trishul, lotus if needed.
- Replace surface emojis in header, nav, robo, buttons where obvious. Do not over-patch all at once.

### 3.4 Robo + Wisdom
- Floating ~80px cute robot (copper/gold, tilak, glowing ॐ chest).
- Pure CSS keyframes in component (float, blink, wave, celebrate, special-glow).
- Click → WisdomPopup modal (beautiful temple card).
- WisdomPopup:
  - Shows title + body in current user lang (en/hi/te priority; fallback chain).
  - [🔊 Listen] = speechSynthesis (rate tuned for Sanskrit).
  - Language switcher (3 primary).
  - Next (random or category cycle).
  - Share (TG + copy).
- Data:
  - `data/wisdom.json` (source of truth, checked into repo).
  - Supabase `wisdom_facts` table (for future admin / random queries).
  - `lib/wisdom.ts`: `getRandomFact(category?, lang?)`, `getFactById`.
- **Authenticity rule** (non-negotiable): Every fact has real source citation (Rig Veda 10.121, Chandogya Upanishad 6.8.7, etc.). No invented "quotes". 12 categories balanced. ≥100 facts.
- Trigger celebration: after successful game submit (pass prop or context event).

### 3.5 API Surface Additions
- `GET /api/daily?tz_offset=...` — returns localized `date`, panchanga for local day.
- `GET /api/weekly?tz_offset=...&weeks=1` — 7 (or 14) days of {date, panchanga, is_special}.
- `POST /api/onboard` or extend `/api/me` — accepts {tz_offset, language_code, display_name?, theme?}.
- `/api/wisdom/random?category=creation&lang=te` (optional, for Robo; can be client-only from JSON for speed).

### 3.6 Channels
- New route: `app/channels/page.tsx` (protected, shows inside tg-safe).
- 5 channel definitions (hardcoded list for v1):
  1. Main (@SamSkritham or placeholder)
  2. Games
  3. Festivals
  4. Learn
  5. Global
- Each card: description, deep-link subscribe (https://t.me/CHANNEL?start=subscribe), last teaser (static for now or future API).
- Share tracking: CardActions increments `user_cards.shares_count` (add column if needed? use meta or separate later; start with client count or simple).
- Actual posting to channels = Mac cron side (outside this build; bot must be admin).

### 3.7 Performance
- `dynamic(() => import(...))` for game runners if heavy (currently route-level good).
- SWR (add `swr` if critical) or simple stale-while-revalidate in dashboard (useSWR or React Query not forced if native + cache works).
- Keep Noto preload.
- Use `next/image` for future statics (none critical now).
- API: return ETag or Cache-Control for daily when safe.
- Dashboard: fetch with tz, cache user prefs lightly.
- Measure: `npm run build` → report first-load JS.

**Package edit rule**: Only if strictly required for perf (SWR). Document in PR.

### 3.8 Onboarding Flow
- Steps (beautiful, progress dots):
  1. Welcome (Om + tagline)
  2. Timezone (auto-detect prominent + manual searchable list of cities/timezones)
  3. Language (EN / हिंदी / తెలుగు + others from LANGS)
  4. Name (prefill from TG first_name, allow edit)
  5. Done + "Let's begin" (saves + reloads personalized dash)
- Never show again once `prefs.onboarded === true` or tz_offset meaningfully set.
- Can be re-entered from /me "Edit Preferences".
- Component: `components/Onboarding/` (WelcomeScreen, TimezonePicker, LanguagePicker, NameStep).
- Trigger: In `app/page.tsx`, after user load, if needsOnboard(user) render full-screen flow instead of dash (or modal that blocks).

### 3.9 Data Model Additions
New table (create migration or run via service):

```sql
CREATE TABLE public.wisdom_facts (
  id TEXT PRIMARY KEY,           -- 'wisdom-001'
  category TEXT NOT NULL,
  title_en TEXT, title_hi TEXT, title_te TEXT,
  body_en TEXT NOT NULL, body_hi TEXT, body_te TEXT,
  source TEXT,
  tags TEXT[] DEFAULT '{}',
  difficulty SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_wisdom_category ON public.wisdom_facts(category);
```

Seed via one-time script or `data/wisdom.json` → INSERT (Codex delivers the migration + seed).

Users `prefs` extended: `{ "onboarded": true, "theme": "temple", "robo_enabled": true }`

---

## 4. File Deliverables (Map to Delegations)

### Task 1 — Codex (Robo + Wisdom DB)
- `data/wisdom.json` (≥100 facts, authentic)
- `lib/wisdom.ts`
- `components/Robo/SamSkrithiRobo.tsx`
- `components/Robo/WisdomPopup.tsx`
- SQL migration file or comment in docs (or direct inserts via script)
- Optional: seed script `scripts/seed-wisdom.ts`

### Task 2 — Claude Code (Onboarding + TZ + Theme)
- `components/Onboarding/WelcomeScreen.tsx`
- `components/Onboarding/TimezonePicker.tsx`
- `components/Onboarding/LanguagePicker.tsx` (or reuse)
- `components/Settings/ThemeToggle.tsx`
- Updates: `app/globals.css` (3 themes), `app/layout.tsx` (apply data-theme), `app/page.tsx` (onboard gate), `/api/daily` (tz support), `lib/utils.ts` (local date fn)

### Task 3 — Codex (Week + Channels + Perf)
- `components/Dashboard/WeekView.tsx`
- `app/channels/page.tsx`
- `components/Channels/ChannelList.tsx`
- `app/api/weekly/route.ts`
- Perf: dynamic imports (if gaps), layout font already good, fetch improvements, SWR or equiv.
- Updates to BottomNav (add channels entry or link from Me), CardActions (share count + TG share), dashboard (embed Robo + WeekView)

Cross-cutting:
- Small updates to `app/me/page.tsx` (theme toggle, re-onboard)
- `CardActions.tsx` enhancements for share
- Possibly `app/layout.tsx` for theme + preload confirm

---

## 5. Exact Delegation Commands (Execute These)

### Codex Task 1 (Robo + Wisdom)
From repo root:

```bash
/Users/cypher0x9/bin/codex exec "
Task: Build the complete SamSkrithi Robo component + wisdom database.

Follow EVERY rule in CONTRIBUTING.md and ARCHITECTURE.md. Use existing Tailwind + card classes. TypeScript strict. No package.json changes unless you document why critical.

Deliverables (create exactly):
1. components/Robo/SamSkrithiRobo.tsx
   - 80px cute round robot, copper/gold + saffron, tiny tilak + glowing ॐ on chest.
   - Pure CSS keyframes: float, blink, wave (on mount), celebrate (prop celebrate?: boolean), specialStreak.
   - Idle random timers (blink/look).
   - onClick opens WisdomPopup (state or callback).
   - Accessible, mobile friendly, fixed position corner on dash.
2. components/Robo/WisdomPopup.tsx
   - Modal matching temple aesthetic.
   - Renders fact (title + body) in user's preferred language (prop or context: en/hi/te).
   - Buttons: Listen (speechSynthesis), lang switcher (EN/HI/TE), Next wisdom, Share (TG + copy), Close.
3. data/wisdom.json — array of ≥100 objects.
   - All 12 categories covered roughly evenly.
   - Fields: id, category, title_en/hi/te, body_en/hi/te, source, tags[], difficulty.
   - 100% authentic citations only (Rig Veda X.Y, Gita ch.v, Chandogya Up. etc.). No hallucinations.
4. lib/wisdom.ts — pure helpers: getRandomWisdomFact(filters), getWisdomFact(id), getCategories().
5. Supabase migration snippet + one-time seed instructions (add to docs/migrations/ or inline comment).
6. Bonus: small demo hook or usage example in a temp page if needed.

Greet in user's language when possible (use title or simple body start). Make it magical and delightful.
"
```

### Claude Code Task 2 (Onboard + TZ + Theme) — via subagent
Prompt the builder agent with the exact Task 2 deliverable block from the original query + these constraints:
- Inspect current files first.
- Respect existing components (MiniAppShell, card styles).
- Add `getLocalDateISO` + update daily route for `tz_offset`.
- Implement theme via data-theme + CSS vars in globals.css.
- Onboarding must set user prefs via API call (extend /api/me or new lightweight route).
- Use existing validation pattern.

### Codex Task 3
Similar `codex exec` block for WeekView + channels/page + perf items + new /api/weekly.

---

## 6. Integration & Wiring Order (Supervisor Only)

1. After builders deliver, review each file (authenticity of wisdom first!).
2. Wire Robo into `app/page.tsx` (after daily data; pass celebrate on game return).
3. Wire onboarding gate in dashboard (before other UI).
4. Add WeekView below today's card.
5. Add ThemeToggle to /me.
6. Add Channels link in BottomNav or Me (add route, update nav carefully — keep 5-tab limit or make Me submenu).
7. Update /api/daily + add /api/weekly.
8. Update layout to hydrate theme from user (or client effect + TG scheme).
9. Small icon swaps (header Om, etc.).
10. CardActions: enhance share to use `window.Telegram?.WebApp?.share` or URL + increment.
11. Update ARCHITECTURE.md with new sections.
12. Add any missing indexes or RLS comments (if wisdom_facts public readable).

Use smallest patches.

---

## 7. Verification Checklist (Non-negotiable)

- [ ] `npm run lint` — clean
- [ ] `npm run build` — ZERO errors, zero critical warnings. Note bundle sizes.
- [ ] Manual smoke:
  - First load (mock) → shows onboarding flow → completes → personalized header (local date shown).
  - Robo visible, tap → popup, Listen works, Next cycles facts, lang switch.
  - Theme toggle switches instantly, persists preference.
  - /api/daily?tz_offset=330 returns sensible local date + panchanga.
  - WeekView shows 7 days, taps work.
  - /channels lists 5, links open t.me.
  - Play a game → celebrate on Robo if wired.
  - Build still <480px friendly.
- [ ] Wisdom facts: sample 5 random, verify at least one from each major category has real source.
- [ ] No new heavy deps unless justified.

---

## 8. Commit / Deploy

After verification:
```bash
git add -A
git commit -m "feat(phase2): Robo, onboarding, themes, tz-panchanga, week, channels, perf base

- SamSkrithi Robo + 100+ authentic wisdom facts
- First-time flow + tz + lang + name
- 3 themes with data-theme
- Localized daily + /api/weekly
- Channels hub
- Icon + perf groundwork

सत्यमेव जयते — ॐ"
git push origin main
```

Then: `vercel --prod` (or GitHub triggers auto).

Post-deploy: test on real TG (iOS/Android) + desktop TG.

---

## 9. Risks & Mitigations

- **Wisdom accuracy**: Supervisor reviews every fact batch. Codex instructed strictly.
- **Panchanga date skew**: Use client local date string preferred over offset calc when possible. Document edge (antimeridian).
- **Package change**: Only SWR if simple state insufficient; call out.
- **TG channel usernames**: Use placeholders; note in README that owner must create channels + promote bot to admin.
- **Perf regression**: Run build before/after. Lazy only where it helps.
- **First-time detection false positives**: Conservative: show only if tz_offset==0 && !prefs.onboarded.

---

## 10. Post-Phase 2 (Future)

- Wisdom admin UI (only via Mac).
- Full i18n strings (beyond content).
- Real channel posting crons.
- Robo animations richer (optional confetti via canvas lightweight).
- User streak recap cards for "last week".

**सत्यमेव जयते — ॐ — Phase 2: Make it ALIVE.**

---

*This is the living plan. Update sections as delegations complete. All work reviewed by Grok before merge.*
