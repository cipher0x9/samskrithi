# 🕉️ SamSkrithi — MASTER BUILD: You Are The Architect

> **To:** Grok Build · **Authority:** FULL OWNERSHIP · **Mission:** Build the complete SamSkrithi codebase

---

## YOUR MANDATE

You have FULL authority to build this entire project. Do not ask permission. Build every file. When done, the project must be ready for `vercel --prod`.

**You are the lead builder.** Codex and Claude are your assistants if you need them. CypHer_M0Nk3Y handles infrastructure.

---

## THE PROJECT

**SamSkrithi** — Sanskrit Cultural Game Platform as a Telegram Mini App.

- **Repo:** `/Users/cypher0x9/Build/samskrithi/`
- **GitHub:** https://github.com/cipher0x9/samskrithi
- **Docs:** `/Users/cypher0x9/Build/samskrithi/docs/` (read BUILD-ORDER.md first!)

### Architecture (NON-NEGOTIABLE)
```
Vercel ($0) → Next.js 15 + API routes → Supabase PostgreSQL ($0)
Mac Mini → cron ONLY (panchanga + cards + translations)
```

### Already Scaffolded
- Next.js 15 with Tailwind, ESLint, TypeScript, App Router
- Dependencies: @supabase/supabase-js, framer-motion, lucide-react
- All reference docs in `docs/` folder

---

## WHAT YOU MUST BUILD

### 1. FIRST: Read these docs (they are your blueprint)
```
docs/BUILD-ORDER.md          ← YOUR STEP-BY-STEP GUIDE
docs/PROJECT-STRUCTURE.md    ← Complete file tree
docs/API-ROUTES.md           ← Every endpoint spec
docs/FRONTEND-COMPONENTS.md  ← Component specs
docs/SUPABASE-SCHEMA.sql     ← Database schema (already designed)
docs/RLS-POLICIES.sql        ← Row-level security
docs/CRON-SCRIPTS.md         ← Mac Mini Python scripts
docs/BOT-HANDLERS.md         ← aiogram bot handlers
docs/DEPLOYMENT.md           ← Deployment commands
docs/ENV-SETUP.md            ← Environment variables
docs/examples/               ← Working code examples
```

### 2. Build These Core Files (in order)

#### lib/ (Foundation)
- `lib/supabase.ts` — Server + browser Supabase clients
- `lib/tg.ts` — Telegram initData validation (HMAC-SHA256)
- `lib/scoring.ts` — Game scoring formulas (XP, accuracy, streaks)
- `lib/panchanga.ts` — TypeScript types for daily data
- `lib/utils.ts` — Helper functions

#### app/api/ (Backend — Vercel Serverless)
- `app/api/validate/route.ts` — Auth endpoint (validate Telegram initData)
- `app/api/daily/route.ts` — Today's panchangam + free card + 3 challenges
- `app/api/games/submit/route.ts` — Submit game score → XP + streak
- `app/api/leaderboard/route.ts` — Top players (weekly/global/family)
- `app/api/cards/[id]/route.ts` — Get card with 14 translations
- `app/api/me/route.ts` — Full user profile + stats

#### app/ (Pages — Frontend)
- `app/layout.tsx` — Root layout with TG theme + fonts
- `app/page.tsx` — Dashboard: streak, today's card, daily games CTA
- `app/games/akshara/page.tsx` — Drag-drop Devanagari puzzle
- `app/games/quiz/page.tsx` — Daily Cosmic Quiz
- `app/games/battle/page.tsx` — PvP Shloka Battle (stub)
- `app/cards/[id]/page.tsx` — Full card viewer with language switcher
- `app/garden/page.tsx` — Akshara Garden (SVG visual progress)
- `app/temple/page.tsx` — Temple Quest map (12 Jyotirlingas)
- `app/me/page.tsx` — User profile + stats + collection
- `app/family/page.tsx` — Family Sangha (stub)

#### components/ (Reusable UI)
- `components/Card/WisdomCard.tsx` — THE card renderer (dark temple theme, 14-lang tabs)
  - REUSE CSS from existing templates: docs/examples/components/WisdomCard.tsx
  - Colors: dark indigo (#141428) + gold (#d4a853) + amber (#ff6b35)
  - Fonts: Noto Sans Devanagari for Sanskrit, Inter for UI
- `components/Card/LanguageTabs.tsx` — 14 language selector (P0 first)
- `components/Card/CardActions.tsx` — 🔊 Play, 📋 Copy, 💾 Save, 🔗 Share
- `components/Game/AksharaBoard.tsx` — Draggable letter tiles + target slots
- `components/Game/QuizRunner.tsx` — Multiple choice quiz renderer
- `components/Game/ScoreModal.tsx` — XP + streak animation after game
- `components/Progress/StreakFlame.tsx` — 🔥 streak display
- `components/Progress/LevelBadge.tsx` — Level indicator
- `components/Progress/AksharaGarden.tsx` — SVG plant growth visual
- `components/Layout/MiniAppShell.tsx` — Safe area + TG back button
- `components/Layout/BottomNav.tsx` — 5-tab bottom navigation
- `components/ui/Button.tsx` — shadcn-style button component

#### public/
- `public/manifest.json` — PWA manifest
- `public/sw.js` — Service worker for offline cache
- `public/icons/` — App icons (use placeholder SVG)

### 3. Environment File
- `.env.local.example` — All required vars (SUPABASE_URL, NEXT_PUBLIC_SUPABASE_URL, etc.)

### 4. Root Config
- `.env.local` — Actual values (read from ~/.hermes/profiles/cyphermonkey/config/superbase.env for SUPABASE key)

---

## DESIGN SYSTEM (NON-NEGOTIABLE)

### Colors
```css
--bg-deep: #0a0a1a;           /* Deepest background */
--bg-card: #141428;           /* Card/dashboard surface */
--gold: #d4a853;              /* Sanskrit text, highlights */
--amber: #ff6b35;             /* CTAs, buttons, streak */
--indigo: #4B0082;            /* Yoga/meditation cards */
--emerald: #2ECC71;           /* Ayurveda/garden */
--purple: #7B2D8E;            /* Panchanga/cosmic */
--text-primary: #e8e0d0;      /* Main text */
--text-muted: #8a8578;        /* Secondary text */
```

### Fonts
- Sanskrit: `Noto Sans Devanagari`
- UI: `Inter` (from next/font)
- IAST: `Noto Serif` with diacritics

### Layout
- Telegram Mini App safe area: `env(safe-area-inset-*)`
- Max width: 480px centered
- Bottom nav: 5 tabs (Home, Games, Cards, Garden, Me)

---

## DATA SOURCES (USE THESE EXACT FILES)

All authentic content comes from:
```
~/Build/cypher-academy/sanskrit-wisdom-engine/data/
├── gita_verses.json           # 85 verses
├── rigveda_mantras.json       # 31,781 mantras
├── rigveda_famous.json        # Curated famous verses
├── atharvaveda_mantras.json   # 10K+ Atharva Veda
├── festivals.json             # 100+ festivals
└── learnsloka_texts.json      # 7 stotras
```

Reference Python scripts (logic to port):
```
~/Build/cypher-academy/sanskrit-wisdom-engine/
├── panchanga_calc.py          # Port panchanga logic to TypeScript
└── card_generator.py          # Card generation logic
```

**STRICT RULE:** Never invent shlokas. All mantra content MUST reference existing JSON files.

---

## GAME LOGIC (IMPLEMENT THESE)

### Akshara Puzzle
- Fetch a verse from gita_verses.json
- Split Devanagari into syllables/letters
- Render as draggable tiles → target slots
- Score: accuracy × time bonus
- XP awarded on completion

### Daily Cosmic Quiz
- Generate 5 questions from panchangam + Gita facts
- Deterministic seed per (user_id, date)
- Multiple choice
- XP per correct answer

### Scoring Formula
```
accuracy = correct / total
time_bonus = max(0, (target_seconds - elapsed) / target_seconds) × 30
xp = floor(50 × accuracy + time_bonus)
streak_multiplier = 1 + (streak_current × 0.1)
```

### Progression
- Levels: Prarambhika (0-49) → Madhyama (50-199) → Adhyapaka (200-499) → Pandita (500-999) → Acharya (1000+)
- Streaks: Login + complete 1 daily challenge
- Garden: Track mastered letters in user.mastered_letters JSON

---

## OUTPUT REQUIREMENTS

1. **Write EVERY file** listed above. No stubs. Working code.
2. **Use TypeScript** throughout. No `any` types.
3. **Supabase queries** must work with PostgreSQL (not SQLite).
4. **All API routes** must validate initData and return proper JSON.
5. **All components** must render correctly with the design system.
6. **Do NOT modify** `package.json`, `next.config.js`, or `tailwind.config.js` unless necessary.

---

## VERIFICATION

After writing all files:
1. `npm run build` must succeed with zero errors
2. `npm run lint` must pass
3. The dashboard (`/`) must render a beautiful card
4. `/api/daily` must return valid JSON (with mock data if no Supabase yet)

---

## FILES YOU MUST NOT TOUCH
- `package.json` (unless adding a critical dependency)
- `next.config.js`
- `tsconfig.json`

---

## BEGIN

Read `docs/BUILD-ORDER.md` first. Then build EVERY file in order.

**You have full ownership. No gaps. No "coming soon." Every file must be production-ready.**

**सत्यमेव जयते — ॐ — BUILD.**
