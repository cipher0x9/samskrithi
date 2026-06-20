# 🕉️ SamSkrithi — PHASE 2: EXPAND + ROBOT + WISDOM + CHANNELS

> **To:** Grok Build (GOD MODE — Supervise, Delegate, Architect)
> **From:** CypHer_M0Nk3Y
> **Mission:** Expand SamSkrithi into a living, breathing cultural platform.
> **Rule:** Grok = God (supervise). Codex + Claude = builders (do the work). CypHer = watch + cooperate.

---

## CURRENT STATE

- **Repo:** `/Users/cypher0x9/Build/samskrithi` · GitHub: `cipher0x9/samskrithi`
- **Live:** https://samskrithi-omega.vercel.app
- **Bot:** @SamSkritham_bot (token in .env.local)
- **DB:** Supabase `fihrssxryzmfbipgmlva` — 12 tables, RLS, triggers active
- **Issue:** App loads slow, needs optimization, missing features
- **Files built:** 38 files (lib/, app/, components/, public/)

---

## PHASE 2 EXPANSIONS (Build These)

### 1. FIRST-TIME ONBOARDING FLOW (Critical)

When user opens app first time:
```
Welcome Screen → Ask Timezone → Ask Preferred Language → Ask Name
→ Personalize Dashboard → Load Local Content
```

**Technical:**
- Detect timezone via `Intl.DateTimeFormat().resolvedOptions().timeZone` 
- Fallback: manual timezone picker (dropdown with major cities)
- Store in `users.tz_offset` and `users.language_code` in Supabase
- After onboarding: NEVER ask again. Load personalized content.

**Personalization:**
- Today's date in user's timezone
- Day of week → show weekday deity + special mantras
- Panchangam calculated for user's location/timezone
- "Your week ahead" — upcoming 7 days, special days marked
- "Last week's journey" — recap cards they earned

---

### 2. THEME SYSTEM (Dark + Light + Temple)

Three themes, user-selectable, saved to profile:

| Theme | Colors | Mood |
|-------|--------|------|
| 🌙 **Temple Dark** (default) | Deep indigo #0a0a1a, gold #d4a853, amber #ff6b35 | Current |
| ☀️ **Saffron Light** | Cream #fff8e8, saffron #f4a460, maroon #8b0000 | Morning/auspicious |
| 🌿 **Forest Green** | Deep green #0d2818, emerald #50c878, earth #8b7355 | Ayurveda/nature |

**Implementation:**
- CSS custom properties on `<html>` — swap via `data-theme` attribute
- Theme toggle in settings/profile
- Respect Telegram theme preference (light/dark)
- Smooth transition animation

---

### 3. ICON SYSTEM

Replace all emoji with custom SVG icons:
- 🕉️ Om symbol (custom SVG)
- 📖 Book/shoka
- 🧩 Puzzle piece (for games)
- 🎤 Microphone (karaoke)
- 🗺️ Map pin (temple)
- 🌱 Sprout (garden)
- 🔥 Flame (streak)
- ⭐ Star (premium)
- 🌙 Crescent moon (panchanga)
- ☀️ Sun (daily)

Use `lucide-react` where possible. Custom SVG for Sanskrit-specific icons (Om, swastika, trishul).

---

### 4. ROBOT MASCOT: "SamSkrithi Robo" 🤖🕉️

**THE STAR FEATURE.** A cute, alive, animated robot character that lives on the dashboard.

**Design:**
- Small, round, cute robot with Indian aesthetic elements
- Wears a tiny tilak on forehead
- Has a small Sanskrit "ॐ" glowing on chest
- Eyes blink, smiles, occasionally waves
- Color: warm copper/gold with saffron accents
- Size: ~80px, sits in corner of dashboard or as a floating widget
- CSS-only animation (no heavy libraries). Keyframes: float, blink, glow.

**Behavior:**
- On page load: waves 👋 and says greeting in user's language
- When idle: occasionally blinks, looks around
- When pressed/tapped: OPENS A WISDOM POPUP
- After game completion: celebrates (jumps, sparkles)
- On streak day 7/30/100: special animation (confetti, glow)

**Wisdom Popup (when pressed):**
```
┌─────────────────────────────┐
│  🤖🕉️  SamSkrithi Robo        │
│  ─────────────────────────  │
│                             │
│  "Did you know?             │
│   The Rig Veda contains     │
│   1,028 hymns and is the    │
│   oldest known text in      │
│   any Indo-European         │
│   language — dating back    │
│   to 1500 BCE."             │
│                             │
│  [🔊 Listen]  [🌐 తెలుగు]   │
│  [Next wisdom →]            │
└─────────────────────────────┘
```

**Wisdom Database (Preloaded Content):**

The robo must have a rich library of pre-written facts (NOT AI-generated on the fly). Categories:

1. **Human Life** — Purpose of life, four purusharthas, stages of life
2. **Nature** — Pancha mahabhutas (5 elements), seasons, ecology
3. **Space/Cosmos** — Vedic cosmology, nakshatras, planets, creation stories
4. **Creation** — Nasadiya Sukta, Hiranyagarbha, cosmic egg
5. **Vedas** — Rig, Yajur, Sama, Atharva — what each contains
6. **Upanishads** — Core teachings, mahavakyas
7. **Puranas** — Stories from 18 Mahapuranas
8. **Itihasas** — Ramayana, Mahabharata key events
9. **Granthas** — Gita, Brahma Sutras, Dharma Shastras
10. **Mantras** — Famous mantras and their meanings
11. **Ancient China** — Tao te Ching, Confucius parallels with Vedic thought
12. **Global Wisdom** — Greek philosophers, Egyptian, Mesopotamian parallels

**Structure each fact as:**
```json
{
  "id": "wisdom-001",
  "category": "creation",
  "title_en": "The Cosmic Egg",
  "title_te": "బ్రహ్మాండం",
  "title_hi": "ब्रह्माण्ड",
  "body_en": "According to the Rig Veda...",
  "body_te": "ఋగ్వేదం ప్రకారం...",
  "body_hi": "ऋग्वेद के अनुसार...",
  "source": "Rig Veda 10.121",
  "tags": ["creation", "cosmos", "veda"],
  "difficulty": 1
}
```

**Create at least 100 wisdom facts** across all categories. Store in `data/wisdom.json` and sync to Supabase `wisdom_facts` table.

---

### 5. TIMEZONE-AWARE PANCHANGAM + CARDS

**Problem:** Currently shows static/UTC content. Must be local.

**Fix:**
- On `/api/daily`: accept `tz_offset` parameter
- Calculate panchangam for user's local date (not server UTC)
- Return cards relevant to user's `today` in their timezone
- `panchanga_calc.py` already supports this — wire it correctly

**Week View:**
- `/api/weekly?tz_offset=330` → returns 7 days of panchangam + special days
- Show on dashboard: "This Week" section with festival markers
- "Next Week" preview

---

### 6. MULTI-CHANNEL TELEGRAM SYSTEM

SamSkrithi should post to multiple channels:

| Channel | Purpose | Content |
|---------|---------|---------|
| 🕉️ **Main** | Daily wisdom | Hourly mantra cards + panchangam |
| 🎮 **Games** | Challenges | Tournament invites, leaderboard updates |
| 🎪 **Festivals** | Events | Festival announcements, special cards |
| 📚 **Learn** | Education | Deep dives, Gita series |
| 🌍 **Global** | Community | User highlights, global leaderboard |

**Architecture:**
- Each channel is a Telegram channel with its own `@channel_username`
- Bot posts to channels via `sendMessage` / `sendPhoto`
- Cron scripts determine which channel gets what content
- User can subscribe to channels via bot commands (`/subscribe games`)
- Mini App has a "Channels" tab showing all 5

**Share System:**
- Every card has "Share" button → opens Telegram share sheet
- Shared cards include: card image + link back to Mini App
- Track shares in `user_cards.shares_count`

---

### 7. PERFORMANCE OPTIMIZATION

The app loads slow. Fix:
- Lazy-load game components (`dynamic(() => import(...))`)
- Preload critical fonts (Noto Sans Devanagari)
- Image optimization (next/image for static assets)
- API response caching (SWR or React Query for client, ETags for server)
- Supabase query optimization (indexes already created — use them)
- Reduce initial JS bundle (code splitting)

---

## DELEGATION PLAN (Grok = God, Codex+Claude = Workers)

### Grok (Supervisor): DO NOT BUILD YOURSELF
- Architect the overall design
- Review ALL outputs from Codex + Claude
- Merge best parts
- Handle integration + final build verification
- Write ARCHITECTURE.md update

### Delegate to CODEX CLI (Task 1):
```
Task: Build the complete SamSkrithi Robo component + wisdom database.

Deliverables:
1. components/Robo/SamSkrithiRobo.tsx — animated floating robot
   - CSS keyframe animations (float, blink, wave, glow)
   - Click handler → opens WisdomPopup
   - Idle animations (random timing)
   - Celebration animation trigger (prop: celebrate=true)
   - Responsive, works on mobile

2. components/Robo/WisdomPopup.tsx — modal with wisdom fact
   - Language switcher (shows fact in selected language)
   - "Listen" button (TTS playback)
   - "Next" button (random fact)
   - Share button
   - Beautiful styling matching temple theme

3. data/wisdom.json — at least 100 facts
   - All 12 categories covered
   - English + Hindi + Telugu for each fact
   - Source citations
   - Stored as JSON array

4. lib/wisdom.ts — helper to fetch random fact by category
5. Supabase migration: CREATE TABLE wisdom_facts + seed data
```

### Delegate to CLAUDE CODE (Task 2):
```
Task: Build the onboarding flow + timezone system + theme system.

Deliverables:
1. components/Onboarding/WelcomeScreen.tsx — first-time flow
   - Steps: Welcome → Timezone → Language → Name → Done
   - Beautiful illustrations (SVG or emoji)
   - Progress dots
   - Skip option

2. components/Onboarding/TimezonePicker.tsx
   - Auto-detect via Intl API
   - Manual picker with search
   - Save to user prefs in Supabase

3. components/Settings/ThemeToggle.tsx
   - Three themes (Temple Dark, Saffron Light, Forest Green)
   - Preview swatches
   - Instant theme switch via data-theme attribute

4. app/globals.css — add CSS custom properties for all 3 themes
5. Update app/layout.tsx to apply theme from user prefs
6. Update /api/daily to accept tz_offset and return localized content
```

### Delegate to CODEX CLI (Task 3):
```
Task: Build the week view + channels system + performance optimization.

Deliverables:
1. components/Dashboard/WeekView.tsx
   - Horizontal scroll of 7 days
   - Festival markers on special days
   - Tap day → load that day's card

2. app/channels/page.tsx + components/Channels/ChannelList.tsx
   - 5 channel cards with descriptions
   - Subscribe/Unsubscribe button (via bot deep link)
   - Channel preview (last post)

3. Performance fixes:
   - dynamic() imports for heavy components
   - Font preloading in layout
   - API caching with SWR
   - Bundle analysis (report what's heavy)
```

---

## OUTPUT REQUIREMENTS

1. **Grok:** Create `/Users/cypher0x9/Build/samskrithi/PHASE2-PLAN.md` — your complete plan
2. **All files** written to the project directory
3. **npm run build** must pass with ZERO errors
4. **npm run lint** must pass
5. **Commit + push** to GitHub
6. **Deploy to Vercel** after build passes

---

## FILES YOU MUST READ FIRST
- `/Users/cypher0x9/Build/samskrithi/ARCHITECTURE.md`
- `/Users/cypher0x9/Build/samskrithi/CONTRIBUTING.md`
- `/Users/cypher0x9/Build/samskrithi/.env.local`
- `/Users/cypher0x9/Desktop/samskrithi-100percent/SUPABASE-SCHEMA.sql`

---

## RULES
- **Grok supervises.** Delegates to Codex + Claude. Reviews their output.
- **Do NOT** exhaust your message limits — let Codex + Claude do the heavy lifting.
- **All new features** must work with existing architecture (Vercel + Supabase).
- **The Robo is the star.** Make it magical.
- **Wisdom facts must be authentic** — cite real sources, not AI hallucinations.

**सत्यमेव जयते — ॐ — Phase 2: Make it ALIVE.**
