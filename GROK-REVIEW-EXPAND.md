# 🕉️ SamSkrithi — QUALITY REVIEW + EXPAND + TEACH

> **To:** Grok Build (Master Architect)
> **Mission:** Review every file you built. Find gaps. Fix them. Use Codex + Claude. Teach.

---

## THE SITUATION

You built 35 files in ~15 minutes solo. That's suspiciously fast. The user wants you to:
1. **REVIEW** every file for completeness, bugs, edge cases
2. **DELEGATE** specific components to Codex + Claude for quality comparison
3. **EXPAND** anything that's stubbed, thin, or missing
4. **TEACH** — document the architecture, patterns, and decisions

---

## PHASE 1: SELF-REVIEW (Do This First)

Read every file you created in `/Users/cypher0x9/Build/samskrithi/`. Grade each one:

| Grade | Meaning | Action |
|-------|---------|--------|
| ✅ SOLID | Production-ready, handles edge cases, TypeScript strict, error handling | Keep |
| ⚠️ THIN | Works but missing error states, loading states, edge cases, types | Fix |
| ❌ STUB | Placeholder only, doesn't actually work | Rebuild |

For each file rated ⚠️ or ❌, note what's missing.

---

## PHASE 2: DELEGATE TO CODEX + CLAUDE (Parallel)

You MUST delegate these specific tasks. Do NOT build them yourself:

### Delegate to CODEX CLI:
```
Task: "Review and rebuild the WisdomCard component at /Users/cypher0x9/Build/samskrithi/components/Card/WisdomCard.tsx.

Requirements:
- Must port the EXACT CSS from the proven card templates at ~/Build/cypher-academy/sanskrit-wisdom-engine/cards/FORMAT-A-v2.html and V3-01-sunrise-panchanga.html
- Dark temple theme: deep indigo (#141428) + gold (#d4a853) + amber (#ff6b35)
- Must render: Devanagari (Noto Sans Devanagari), IAST transliteration, English translation
- 14-language tab selector (en, hi, te, ta, id, pt, ru, th, vi, tl, bn, ne, si)
- Language tabs must show the selected translation below
- Footer: source reference + category badge
- Loading state (skeleton), error state, empty state
- TypeScript strict, no 'any'
- Responsive 480px max-width, Telegram safe area aware
- Audio button (play TTS of Sanskrit), Copy button, Share button (Telegram WebApp share)"
```

### Delegate to CLAUDE CODE:
```
Task: "Review and rebuild ALL API routes in /Users/cypher0x9/Build/samskrithi/app/api/

Files to review:
- app/api/validate/route.ts
- app/api/daily/route.ts
- app/api/games/submit/route.ts
- app/api/leaderboard/route.ts
- app/api/cards/[id]/route.ts
- app/api/me/route.ts
- app/api/family/route.ts

Requirements for each route:
- Proper Telegram initData validation (HMAC-SHA256 with TELEGRAM_BOT_TOKEN from env)
- Extract user ID from validated initData
- Input validation (Zod or manual type guards)
- Error handling: 400 (bad input), 401 (invalid auth), 404 (not found), 500 (server error)
- Rate limiting consideration (at minimum, document where it should go)
- Proper Supabase queries with service role key on server
- TypeScript strict, typed request/response
- Test with mock data so they work without Supabase during development
- DOCUMENT: Add JSDoc comments explaining each route's purpose, inputs, outputs"
```

### Delegate to CODEX CLI (Second task):
```
Task: "Build the game scoring engine at /Users/cypher0x9/Build/samskrithi/lib/scoring.ts

Requirements:
- XP calculation: accuracy * 50 + time_bonus (time_bonus = max(0, (target - elapsed)/target * 30))
- Streak multiplier: 1 + (streak_current * 0.1)
- Level calculation: Prarambhika (0-49), Madhyama (50-199), Adhyapaka (200-499), Pandita (500-999), Acharya (1000+)
- Letter mastery tracking for garden
- All pure functions, no side effects, fully typed
- Unit test examples in comments
- Edge cases: negative XP, max level cap, division by zero"
```

---

## PHASE 3: EXPAND MISSING FEATURES

After Codex + Claude return their work, identify what's still missing. Likely gaps:

1. **Loading states** — every page needs skeleton/spinner
2. **Error boundaries** — React error boundaries for game crashes
3. **Offline support** — PWA service worker for card caching
4. **Animation** — framer-motion for game transitions, XP popup
5. **Sound** — TTS playback for Sanskrit audio
6. **Accessibility** — aria labels, keyboard navigation
7. **Dark mode toggle** — respect Telegram theme
8. **i18n** — UI strings in user's language (not just card translations)

For each gap, either fix it yourself or delegate it.

---

## PHASE 4: TEACH (Document Everything)

Create `/Users/cypher0x9/Build/samskrithi/ARCHITECTURE.md` containing:

1. **System Overview** — Vercel + Supabase + Mac Mini, data flow diagram
2. **Component Tree** — Parent-child relationships, props flow
3. **State Management** — What lives in Supabase vs local state vs URL params
4. **Auth Flow** — initData → validate → JWT → RLS
5. **Game Loop** — Daily challenge lifecycle: generate → play → submit → reward
6. **Card Pipeline** — Corpus JSON → Supabase → API → WisdomCard component
7. **Scoring System** — XP formula, streak logic, level progression
8. **14-Language System** — Translation table, caching, lazy loading
9. **Deployment Architecture** — Vercel config, env vars, Supabase RLS
10. **Troubleshooting** — Common issues and fixes

Also create `/Users/cypher0x9/Build/samskrithi/CONTRIBUTING.md`:
- How to add a new game mode
- How to add a new language
- How to add a new card category
- How to test locally
- Code style guide

---

## PHASE 5: FINAL VERIFICATION

After all fixes and expansions:
1. Run `npm run build` — must pass with zero errors AND zero warnings
2. Run `npm run lint` — must pass
3. Verify every page renders (check for import errors)
4. Verify every API route returns valid JSON (test with curl mock)
5. Commit all changes with clear message
6. Push to GitHub

---

## RULES

- **You MUST delegate** to Codex and Claude. Do not build everything yourself again.
- **You MUST review** their output. Pick the best parts. Merge intelligently.
- **You MUST expand** thin areas. No stubs left behind.
- **You MUST teach**. The ARCHITECTURE.md is as important as the code.
- **Do NOT modify** package.json or tsconfig.json unless absolutely necessary.
- **All existing working code** should be preserved unless it has bugs.

---

## OUTPUT

When complete, report:
- Files reviewed: [count]
- Files fixed by you: [count, list]
- Files rebuilt by Codex: [count, list]
- Files rebuilt by Claude: [count, list]
- New files created: [count, list]
- Build status: [pass/fail + any errors]
- Key improvements made
- Architectural decisions documented

---

**Quality over speed. This is the real build.**
**सत्यमेव जयते — ॐ**
