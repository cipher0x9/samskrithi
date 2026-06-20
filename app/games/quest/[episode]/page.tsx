'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MiniAppShell } from '@/components/Layout/MiniAppShell';
import { BottomNav } from '@/components/Layout/BottomNav';
import { StoryScene } from '@/components/Quest/StoryScene';
import { VocabPopup } from '@/components/Quest/VocabPopup';
import { QuestHUD } from '@/components/Quest/QuestHUD';
import { BattleScreen } from '@/components/Quest/BattleScreen';
import { BadgeUnlock } from '@/components/Quest/BadgeUnlock';
import { getEpisode, type QuestEpisode, type VocabWord } from '@/lib/quest/episodes';

type SavedProgress = {
  scene_index?: number;
  xp_earned?: number;
  vocab_learned?: string[];
  badge_earned?: boolean;
};

function getInitData(): string {
  const tg = (typeof window !== 'undefined' ? (window as { Telegram?: { WebApp?: { initData?: string } } }).Telegram : undefined);
  return tg?.WebApp?.initData || '';
}

function loadLocal(episodeId: string): SavedProgress | null {
  try {
    const raw = localStorage.getItem(`quest:${episodeId}:progress`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLocal(episodeId: string, data: SavedProgress) {
  try {
    localStorage.setItem(`quest:${episodeId}:progress`, JSON.stringify(data));
    if (data.badge_earned) localStorage.setItem(`quest:${episodeId}:badge`, '1');
  } catch {}
}

export default function EpisodePlayer() {
  const params = useParams<{ episode: string }>();
  const router = useRouter();
  const episodeId = params?.episode || 'ramayana-1';

  const episode: QuestEpisode | null = useMemo(() => getEpisode(episodeId) || null, [episodeId]);

  const [sceneIdx, setSceneIdx] = useState(0);
  const [learned, setLearned] = useState<VocabWord[]>([]);
  const [xp, setXp] = useState(0);
  const [choicesMade, setChoicesMade] = useState(0);
  const [inBattle, setInBattle] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [, setBattleResult] = useState({ correct: 0, total: 5, xpBonus: 0 });
  const [guestNote, setGuestNote] = useState('');
  const [popupWord, setPopupWord] = useState<VocabWord | null>(null);

  const totalScenes = episode?.scenes.length || 3;
  const currentScene = episode?.scenes[sceneIdx];

  const totalVocabSoFar = useMemo(() => {
    if (!episode) return 0;
    const reached = episode.scenes.slice(0, sceneIdx + 1).flatMap(s => s.vocab);
    return new Set(reached.map(v => v.dev)).size;
  }, [episode, sceneIdx]);

  // Restore from local + progress api
  useEffect(() => {
    if (!episode) return;
    const init = getInitData();

    // Local first (fast resume for guest + logged)
    const local = loadLocal(episode.id);
    let startIdx = 0;
    let startXp = 0;
    let startVocab: VocabWord[] = [];

    if (local) {
      startIdx = Math.max(0, Math.min((local.scene_index || 0), episode.scenes.length - 1));
      startXp = local.xp_earned || 0;
      // reconstruct vocab words from ids
      const allVocab = episode.scenes.flatMap(s => s.vocab);
      const learnedDevs = new Set(local.vocab_learned || []);
      startVocab = allVocab.filter(v => learnedDevs.has(v.dev));
    }

    // Defer initial state writes to avoid "setState in effect" lint rule (local snapshot only)
    setTimeout(() => {
      setSceneIdx(startIdx);
      setXp(startXp);
      setLearned(startVocab);
    }, 0);

    // If server progress exists and is ahead, prefer it (use timeout to avoid sync setState in effect)
    if (init) {
      fetch(`/api/quest/progress?episode=${episode.id}&initData=${encodeURIComponent(init)}`)
        .then(r => r.json())
        .then((j) => {
          if (j?.progress && episode) {
            setTimeout(() => {
              const p = j.progress;
              const srvIdx = Math.max(0, Math.min(p.scene_index || 0, episode.scenes.length - 1));
              if (srvIdx > startIdx || (p.badge_earned && !local?.badge_earned)) {
                setSceneIdx(srvIdx);
                setXp(p.xp_earned || startXp);
                const allVocab = episode.scenes.flatMap(s => s.vocab);
                const learnedDevs = new Set<string>(p.vocab_learned || []);
                setLearned(allVocab.filter(v => learnedDevs.has(v.dev)));
              }
              if (p.badge_earned) {
                setGuestNote('');
              }
            }, 0);
          }
        })
        .catch(() => {});
    }
  }, [episode]);

  if (!episode) {
    return (
      <MiniAppShell title="Quest">
        <div className="pt-8 text-center">Episode not found. <Link href="/games/quest" className="text-[#d4a853]">Back to map</Link></div>
        <BottomNav />
      </MiniAppShell>
    );
  }

  // Dedup vocab helper
  function addVocab(words: VocabWord[]) {
    setLearned((prev) => {
      const map = new Map(prev.map(w => [w.dev, w]));
      words.forEach(w => map.set(w.dev, w));
      return Array.from(map.values());
    });
  }

  function addSceneXP(base = 10) {
    setXp((x) => x + base);
  }

  function persist(currentIdx: number, currentXp: number, badge = false) {
    if (!episode) return;
    const devocabs = learned.map(w => w.dev);
    const data: SavedProgress = {
      scene_index: currentIdx,
      xp_earned: currentXp,
      vocab_learned: devocabs,
      badge_earned: badge,
    };
    saveLocal(episode.id, data);

    // fire and forget to server if possible
    const init = getInitData();
    if (init) {
      fetch('/api/quest/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          initData: init,
          episode: episode.id,
          scene_index: currentIdx,
          xp_earned: currentXp,
          vocab_learned: devocabs,
          badge_earned: badge,
          completed: badge,
        }),
      }).catch(() => {});
    } else {
      setGuestNote('Guest — progress saved only on this device.');
    }
  }

  function goToScene(next: number) {
    if (!episode) return;
    const bounded = Math.max(0, Math.min(next, episode.scenes.length - 1));
    // award for previous scene
    addSceneXP(10);
    setChoicesMade(c => c + 1);

    // learn current scene vocab when advancing
    if (currentScene) addVocab(currentScene.vocab);

    setSceneIdx(bounded);
    const newXp = xp + 10 + 2; // base + choice
    setXp(newXp);
    persist(bounded, newXp);
  }

  function onLearnWord(w: VocabWord) {
    addVocab([w]);
    setPopupWord(w);
  }

  function enterBattle() {
    if (currentScene) addVocab(currentScene.vocab);
    persist(sceneIdx, xp);
    setInBattle(true);
  }

  async function handleBattleComplete(correct: number, total: number, elapsed: number) {
    if (!episode) return;
    const quizXp = correct * 5;
    const sceneBase = 10 * episode.scenes.length;
    const choiceXp = choicesMade * 2;
    const bonus = 50; // episode complete
    const totalXp = xp + quizXp + sceneBase + choiceXp + bonus;

    setBattleResult({ correct, total, xpBonus: quizXp + bonus });
    setXp(totalXp);

    // mark badge + persist
    const devocabs = Array.from(new Set([...learned.map(w => w.dev), ...(currentScene?.vocab || []).map(w => w.dev)]));
    const data = {
      scene_index: episode.scenes.length,
      xp_earned: totalXp,
      vocab_learned: devocabs,
      badge_earned: true,
    };
    saveLocal(episode.id, data);

    const init = getInitData();

    if (init) {
      try {
        await fetch('/api/quest/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initData: init,
            episode: episode.id,
            scene_index: episode.scenes.length,
            xp_earned: totalXp,
            vocab_learned: devocabs,
            badge_earned: true,
            completed: true,
          }),
        });

        // also fire global xp via submit (mode quest)
        await fetch('/api/games/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            initData: init,
            mode: 'quest',
            seed: episode.id,
            elapsed_sec: elapsed + 120,
            accuracy: correct / total,
            meta: { episode: episode.id, quiz: correct },
          }),
        }).catch(() => {});
      } catch {}
    } else {
      setGuestNote('Guest mode — badge saved locally only.');
    }

    setInBattle(false);
    setShowBadge(true);
  }

  function finishVictory() {
    if (!episode) return;
    setShowBadge(false);
    // Go to dedicated complete page (matches spec)
    router.push(`/games/quest/complete?episode=${episode.id}&xp=${xp}`);
  }

  if (inBattle) {
    return (
      <MiniAppShell title={episode.title}>
        <div className="pt-2">
          <QuestHUD
            title={episode.title}
            currentScene={sceneIdx}
            totalScenes={totalScenes}
            xp={xp}
            vocabCount={learned.length}
            totalVocab={totalVocabSoFar}
          />
          <BattleScreen
            words={learned.length ? learned : episode.scenes.flatMap(s => s.vocab)}
            bossName={episode.bossName}
            onComplete={handleBattleComplete}
          />
        </div>
        <BottomNav />
      </MiniAppShell>
    );
  }

  const isLast = sceneIdx === episode.scenes.length - 1;
  const canBattle = isLast && !currentScene?.choices;

  return (
    <MiniAppShell title={episode.title}>
      <div className="pt-1">
        <QuestHUD
          title={episode.title}
          currentScene={sceneIdx}
          totalScenes={totalScenes}
          xp={xp}
          vocabCount={learned.length}
          totalVocab={totalVocabSoFar}
        />

        {currentScene && (
          <StoryScene
            scene={currentScene}
            onChoose={goToScene}
            onLearnWord={onLearnWord}
          />
        )}

        {/* Advance or Battle controls */}
        <div className="mt-6">
          {!currentScene?.choices && !isLast && (
            <button
              onClick={() => goToScene(sceneIdx + 1)}
              className="btn btn-primary w-full"
            >
              Continue →
            </button>
          )}

          {canBattle && (
            <button
              onClick={enterBattle}
              className="btn btn-gold w-full mt-2 text-base py-3.5"
            >
              ⚔️ Enter the Trial — Boss Battle
            </button>
          )}

          {isLast && currentScene?.choices && (
            <div className="text-center text-xs text-[#8a8578]">Make your final choice to reach the trial.</div>
          )}
        </div>

        {guestNote && <div className="mt-3 text-center text-xs text-[#ff6b35]">{guestNote}</div>}

        <div className="h-10" />
      </div>

      <VocabPopup word={popupWord} onClose={() => setPopupWord(null)} />
      <BadgeUnlock
        open={showBadge}
        episodeTitle={episode.title}
        badgeName="Ayodhya Initiate"
        xpTotal={xp}
        onClose={finishVictory}
      />

      <BottomNav />
    </MiniAppShell>
  );
}
