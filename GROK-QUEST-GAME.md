# 🗺️ Sanskrit Epic Quest — BUILD THE ACTUAL GAME

> **To:** Grok Build  
> **From:** CypHer_M0Nk3Y  
> **Mission:** Build the real game. Not a card viewer. An RPG.

---

## WHAT WE LEARNED

You previously built SamSkrithi — a card viewer with games tacked on. That's NOT what was planned. The user rejected it. We need to build the actual game from the research.

## THE GAME: Sanskrit Epic Quest

A choice-driven RPG where the player lives through Mahabharata/Ramayana episodes, learns Sanskrit vocabulary naturally, and earns on-chain badges.

### Core Game Loop
```
Start Episode → Read Story (Sanskrit + English) → Make Choice → 
Learn Vocabulary → Battle/Challenge → Earn XP + Badge → Next Episode
```

### Game Structure
- **8 Episodes** (4 Ramayana + 4 Mahabharata)
- Each episode: 5-8 story scenes with choices
- Each choice teaches 3-5 Sanskrit words
- End of episode: boss battle (Sanskrit quiz)
- Win → earn soulbound TON badge

---

## EXISTING INFRASTRUCTURE (USE THIS)

- **Vercel:** https://samskrithi-omega.vercel.app (deploy here)
- **Supabase:** fihrssxryzmfbipgmlva (users, game_progress tables)
- **Bot:** @SamSkritham_bot
- **Data:** 15GB Sanskrit corpus at ~/Build/cypher-academy/sanskrit-wisdom-engine/data/
- **Project:** /Users/cypher0x9/Build/samskrithi (extend, don't rebuild)

---

## BUILD SPEC

### New Pages to Create

```
app/games/quest/
├── page.tsx              # Quest hub — episode selector
├── [episode]/page.tsx    # Episode player
├── battle/page.tsx       # Boss battle screen
└── complete/page.tsx     # Victory + badge screen
```

### New Components

```
components/Quest/
├── StoryScene.tsx        # Story text + Sanskrit overlay + choices
├── VocabPopup.tsx        # Word learning popup (Devanagari + IAST + meaning)
├── ChoiceButton.tsx       # Player choice with consequence preview
├── BattleScreen.tsx       # Quiz battle — timed Sanskrit questions
├── BadgeUnlock.tsx        # Victory celebration + badge animation
├── ProgressMap.tsx        # Visual episode progress (like a game map)
└── QuestHUD.tsx           # XP bar, lives, vocabulary count during play
```

### Database Tables (Add to Supabase)

```sql
CREATE TABLE quest_progress (
  user_id BIGINT,
  episode_id TEXT,
  scene_index INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  vocab_learned TEXT[] DEFAULT '{}',
  badge_earned BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, episode_id)
);
```

### API Route
```
GET /api/quest/episode?episode=ramayana-1&scene=0
→ Returns story text, Sanskrit words to learn, choices available, scene metadata
```

---

## EPISODE 1: "The Birth of Rama" (Ramayana)
Build this FIRST as the demo. Full content:

**Scene 0:** "In the great city of Ayodhya, King Dasharatha rules with wisdom. But he has no children. He performs the Putrakameshti Yajna — a sacred fire ritual. The gods are pleased."

- Sanskrit words: राजा (rājā - king), नगर (nagara - city), यज्ञ (yajña - sacrifice)
- Choice A: "Learn more about the ritual" → Scene 1A
- Choice B: "Skip to the boon" → Scene 1B

**Scene 1A:** "The flames rise high. From the fire emerges a divine being holding a golden vessel of payasam (sweet rice). 'Divide this among your three queens,' the being commands."

- Sanskrit words: अग्नि (agni - fire), दिव्य (divya - divine), पायस (pāyasa - sweet rice)
- Choice: "Give to Queen Kausalya first" or "Divide equally"

**Scene 2:** "Kausalya drinks half. Kaikeyi drinks a quarter. Sumitra drinks the remainder. In time, Rama is born to Kausalya — the avatar of Vishnu, with skin the color of blue lotus."

- Sanskrit words: अवतार (avatāra - incarnation), नील (nīla - blue), पुत्र (putra - son)
- Boss Battle: 5-question Sanskrit quiz on learned words

**Victory:** "You have witnessed the birth of Rama! 🏆 Badge earned: 'Ayodhya Initiate'"

---

## EPISODE 2: "The Dice Game" (Mahabharata)
(Similar structure, different story, new vocabulary)

---

## DESIGN SPEC

### Visual Theme
- Dark epic fantasy (deep navy #0a0e27, gold #d4a853, crimson #8b0000)
- Ancient manuscript background texture
- Sanskrit text in large Noto Sans Devanagari with glow effect
- Scene transitions: fade-to-black between scenes
- Battle screen: dramatic red overlay, timer bar, question cards

### Sound (optional)
- Use browser TTS for Sanskrit pronunciation when tapping words

### Game Mechanics
- XP per scene: 10 + (choices_made × 2) + (quiz_correct × 5)
- Episode complete: bonus 50 XP
- All 8 episodes complete: "Sanskrit Rishi" achievement
- TON badge minted on-chain for each episode completion

---

## CONSTRAINTS
- **Must work as guest** (no auth required to play)
- **Mobile-first** (Telegram Mini App 480px)
- **Reuse existing Supabase + Vercel**
- **Build Episode 1 fully playable** — 3 scenes + boss battle + badge
- **3 more episodes as stubs** (structure ready, content TBD)

---

## DELIVERABLES

1. All new components listed above
2. Episode 1 fully playable (3 scenes + battle + badge)
3. API route for episode data
4. Supabase migration for quest_progress table
5. Quest hub page connected to dashboard
6. Keep existing card viewer/games intact — add quest as NEW feature

---

## OUTPUT
Write all files to /Users/cypher0x9/Build/samskrithi/
Build must pass. Push to GitHub. Vercel deploys.

**THIS is the game. Build it.**
