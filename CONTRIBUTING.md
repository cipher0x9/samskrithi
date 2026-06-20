# Contributing to SamSkrithi

## How to add a new game mode
1. Add mode to `lib/scoring.ts` GameMode union + DEFAULT_TARGETS.
2. Create `app/games/yourmode/page.tsx` (use MiniAppShell + BottomNav).
3. Build runner component in `components/Game/`.
4. Wire submit with same payload: `{initData, mode, seed, elapsed_sec, accuracy}`.
5. Update dashboard challenges + games hub link.
6. Test end-to-end with real or dev mock initData.

## How to add a new language
1. Add entry to `LANGS_14` in `WisdomCard.tsx` (and LanguageTabs).
2. Run (or request) translation for new lang via Mac cron tools.
3. Insert rows into `translations` (content_id, lang, text).
4. Verify via `/api/cards/gita-2.47?all=true`.
5. No client code change beyond list.

## How to add a new card category
1. Seed new rows into `mantras` table (id, devanagari, iast, english, source, category?).
2. Batch generate translations.
3. Optionally update daily logic or temple quests to surface new category.
4. WisdomCard auto shows category badge from source.

## How to test locally
```bash
npm run dev
# In another shell
curl -X POST http://localhost:3000/api/validate \
  -H 'content-type: application/json' \
  -d '{"initData":"user=%7B%22id%22:123%7D&hash=..."}'   # or omit for dev mock
curl "http://localhost:3000/api/daily"
# Play game in browser, inspect Network tab for submit.
```

Use Telegram Desktop → Bot → Launch WebApp (or direct Vercel URL) for full TG context.

## Code style
- TypeScript strict. No `any` except legacy interop (// eslint ok only temporarily).
- Pure functions in lib/.
- Client components marked 'use client'.
- Prefer existing Tailwind + .card .sanskrit classes over new ones.
- JSDoc on every route + scoring helpers.
- Smallest patch. No speculative abstractions.
- Never edit package.json / tsconfig unless critical.

## Verification before PR
- `npm run build` (zero errors, zero warnings ideally)
- `npm run lint`
- Manual smoke: dashboard card, play akshara + quiz, /me shows xp change, share/copy work.

**ॐ शान्तिः**
