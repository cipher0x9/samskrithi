# 🕉️ SamSkrithi — GROK: GIVE DIRECTIONS TO CYPHER

> **To:** Grok Build  
> **From:** CypHer_M0Nk3Y  
> **Mission:** I've built everything you asked. Now YOU tell ME what's next. Give clear directions.

---

## WHERE WE ARE (Current Live State)

- **Repo:** /Users/cypher0x9/Build/samskrithi
- **Live:** https://samskrithi-omega.vercel.app
- **Bot:** @SamSkritham_bot (token in .env.local)
- **DB:** Supabase fihrssxryzmfbipgmlva — 12 tables, RLS, triggers
- **Source:** 50+ files, build clean, lint clean
- **Features working:** Dashboard, WisdomCard, 3 games, Robo (106 facts), 3 themes, onboarding, WeekView, 14-lang tabs, guest mode

---

## WHAT'S MISSING (Your Job to Prioritize)

The app is a beautiful SHELL. No real content pipeline yet.

1. ⏰ **Cron Scripts** — Nothing auto-generates. Panchanga table is empty. Mantras table is empty. 14 translations table is empty.
2. 📢 **Telegram Channels** — 5 channels planned but not created. No auto-posting.
3. 🎤 **Audio** — No mantra audio playback. TTS not wired.
4. 💰 **Payments** — No Stars integration. No premium tier gate.
5. 🌍 **14 Languages** — Translation engine exists but never run. All translations show fallback English.
6. 📊 **Content Seeding** — 31K Rig Veda mantras in JSON files. Never imported to Supabase.

---

## YOUR TASK

### Step 1: Inspect the current state
Read these files to understand what we have:
- /Users/cypher0x9/Build/samskrithi/ARCHITECTURE.md
- /Users/cypher0x9/Build/samskrithi/docs/BUILD-ORDER.md  
- /Users/cypher0x9/Build/cypher-academy/sanskrit-wisdom-engine/panchanga_calc.py
- /Users/cypher0x9/Build/cypher-academy/sanskrit-wisdom-engine/data/ (all JSON files)
- /Users/cypher0x9/Desktop/samskrithi-100percent/CRON-SCRIPTS.md

### Step 2: Give CypHer CLEAR DIRECTIONS

Tell me exactly what to do next. Format:
```
## What CypHer Must Do Now (Ordered by Priority)

### 1. [Task Name]
- Files to create/modify: [exact paths]
- Commands to run: [exact bash/python commands]
- What it accomplishes: [one line]
- How to verify: [test command]

### 2. [Task Name]
...
```

### Step 3: Be Specific. Be Actionable.
- No "you should consider" — only "run this command: ..."
- Give file paths relative to /Users/cypher0x9/
- Give exact Python scripts with working Supabase connection code
- Know that .env.local has SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY ready

---

## EXISTING ASSETS TO USE

### Data Files (Ready to Import)
```
~/Build/cypher-academy/sanskrit-wisdom-engine/data/
├── gita_verses.json (85 verses, devanagari + iast + english)
├── rigveda_mantras.json (31,781 mantras)
├── rigveda_famous.json (curated)
├── atharvaveda_mantras.json (10K+)
├── festivals.json (100+ festivals with tithi rules)
└── learnsloka_texts.json (7 stotras)
```

### Working Python Scripts
```
~/Build/cypher-academy/sanskrit-wisdom-engine/panchanga_calc.py
~/Build/cypher-academy/sanskrit-wisdom-engine/card_generator.py
```

### Supabase Connection
```
URL: https://fihrssxryzmfbipgmlva.supabase.co
Key: in /Users/cypher0x9/Build/samskrithi/.env.local (SUPABASE_SERVICE_ROLE_KEY)
Tables: users, mantras, translations, panchanga, game_sessions, daily_challenges, user_cards, leaderboards, families, family_members, tournaments, nft_claims, wisdom_facts
```

---

## OUTPUT

Save your directions to: `/Users/cypher0x9/Desktop/samskrithi-grok-directions.md`

Be the architect. Tell CypHer what to build and how. ॐ
