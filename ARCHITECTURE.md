# 🕉️ SamSkrithi — Architecture

> Telegram Mini App for daily Sanskrit wisdom, games, streaks, and cultural progression.

## 1. System Overview
- **Frontend**: Next.js 16 (App Router) on Vercel (Edge + Serverless Functions)
- **Backend**: Same Next.js API routes (`/api/*`) using Supabase service role on server
- **Database**: Supabase Postgres (users, mantras, translations, panchanga, game_sessions, user_cards, leaderboards)
- **Auth**: Telegram WebApp `initData` (HMAC-SHA256). No JWT stored; validated on every protected call.
- **Cron / Heavy**: Mac Mini only (panchanga, card gen, translations batch). Never in Vercel.
- **Client**: React 19 + framer-motion + lucide. Max 480px TG-safe container. PWA manifest + basic SW.

Data flow: TG → WebApp → fetch(`/api/...`, {headers or body with initData}) → validate → Supabase (service) → JSON.

## 2. Component Tree
```
RootLayout (fonts, TG script, tg-safe)
└─ Dashboard (app/page)
   ├─ MiniAppShell
   ├─ StreakFlame + LevelBadge
   ├─ WisdomCard (with LanguageTabs inside + CardActions)
   └─ BottomNav
Games
├─ /games/akshara → AksharaBoard + ScoreModal
├─ /games/quiz → QuizRunner + ScoreModal
└─ /games/battle (stub)
Cards
└─ /cards/[id] → WisdomCard (full)
Progress
├─ Garden (AksharaGarden SVG)
└─ Temple (static map)
Me + Family (profile + stubs)
```

Props flow mostly down; game complete bubbles via callbacks → POST submit → modal.

## 3. State Management
- **Supabase (source of truth)**: user (xp, streak, mastered_letters, tier), game_sessions (append only), user_cards, panchanga, mantras, translations, leaderboards.
- **Client local**: useState for game progress (slots, quiz idx), current lang tab, modal open, loading flags.
- **URL**: `?seed=`, `?date=`.
- No global store or URL sync beyond seeds. Daily payload caches in SW.

## 4. Auth Flow
1. TG launches MiniApp with `initData` (string with hash + user JSON).
2. Client passes it via header `x-telegram-init-data` or POST body to protected routes.
3. Server: `lib/tg.ts:validateInitData` → HMAC using TELEGRAM_BOT_TOKEN.
4. On success: upsert user (service role), proceed.
5. RLS on client-anon key protects user data; service role bypasses for writes from API.

Dev fallback: when !BOT_TOKEN && !prod → mock user.

## 5. Game Loop
Daily challenge lifecycle (deterministic):
- /api/daily returns 3 challenges (seeds).
- Akshara: fetch verse → splitDevanagari → tiles + slots → accuracy + elapsed → POST /submit.
- Quiz: 5 Qs (mix daily + static) → acc → submit.
- submit: validate → computeScore (pure) → insert session → return xp + streak snapshot.
- UI: ScoreModal → back to dash (streak/xp optimistic).
- Triggers (DB) or follow-up queries keep user.xp/streak in sync.

## 6. Card Pipeline
Corpus (external JSON) → Mac cron (card_generator) → Supabase mantras + translations (14 langs).
API /cards/[id] or /daily → returns {devanagari, iast, english, source, translations:{lang:text}}.
WisdomCard renders tabs → selected trans. No client cache beyond SW.

## 7. Scoring System (lib/scoring.ts)
- base = accuracy * 50 + max(0, (target-elapsed)/target * 30)
- xp = floor(base * (1 + streak*0.1))
- Levels: Prarambhika 0-49, Madhyama 50-199, Adhyapaka 200-499, Pandita 500-999, Acharya 1000+
- Letter mastery: pure addMasteredLetter (used by garden display + future triggers).
- Edge: zero target, neg time/acc, low xp floor=5.

## 8. 14-Language System
Hardcoded LANGS_14 in WisdomCard.
Translations stored per (content_id, lang) row in Supabase.
Fallback to en or "coming soon".
Lazy: current tab only renders; full fetch via ?all=true when needed.
Future: UI i18n strings separate from card content.

## 9. Deployment Architecture
- Vercel: auto from main. Set env: TELEGRAM_BOT_TOKEN, SUPABASE_*
- Supabase: RLS policies (see docs/RLS-POLICIES.sql). Service key only server-side.
- Mac Mini (cron): runs python generators hourly/daily, uses same Supabase service key.
- PWA: manifest + sw.js registered? (add registration in layout if desired).
- No package changes during review.

## 10. Troubleshooting
- "Invalid initData": wrong bot token or stale launch. Reopen from bot.
- No translations: run translation batch cron or use mock.
- Streak not updating: check game_sessions insert + any DB trigger.
- Build warnings (lockfile): ignore or set turbopack.root.
- Card looks wrong: compare rendered against FORMAT-A-v2.html.
- TTS poor for Sanskrit: browser limitation; future: hosted audio.

**सत्यमेव जयते**
