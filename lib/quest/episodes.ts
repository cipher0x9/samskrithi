export type VocabWord = {
  dev: string;
  iast: string;
  en: string;
};

export type Choice = {
  text: string;
  next: number;
};

export type QuestScene = {
  idx: number;
  text: string;
  sanskrit?: string;
  vocab: VocabWord[];
  choices?: Choice[];
};

export type QuestEpisode = {
  id: string;
  title: string;
  series: 'Ramayana' | 'Mahabharata';
  description: string;
  scenes: QuestScene[];
  bossName: string;
};

export const EPISODES: QuestEpisode[] = [
  {
    id: 'ramayana-1',
    title: 'The Birth of Rama',
    series: 'Ramayana',
    description: 'Ayodhya • Putrakameshti Yajna • The Avatar descends',
    bossName: 'Ayodhya Reckoning',
    scenes: [
      {
        idx: 0,
        text: 'In the great city of Ayodhya, King Dasharatha rules with wisdom. But he has no children. He performs the Putrakameshti Yajna — a sacred fire ritual. The gods are pleased.',
        sanskrit: 'अयोध्या नगरे राजा दशरथः शासनं करोति।',
        vocab: [
          { dev: 'राजा', iast: 'rājā', en: 'king' },
          { dev: 'नगर', iast: 'nagara', en: 'city' },
          { dev: 'यज्ञ', iast: 'yajña', en: 'sacrifice / ritual' },
        ],
        choices: [
          { text: 'Learn more about the ritual', next: 1 },
          { text: 'Skip to the boon', next: 2 },
        ],
      },
      {
        idx: 1,
        text: 'The flames rise high. From the fire emerges a divine being holding a golden vessel of payasam (sweet rice). "Divide this among your three queens," the being commands.',
        sanskrit: 'अग्नेः मध्यात् दिव्यः पुरुषः उद्भवति।',
        vocab: [
          { dev: 'अग्नि', iast: 'agni', en: 'fire' },
          { dev: 'दिव्य', iast: 'divya', en: 'divine' },
          { dev: 'पायस', iast: 'pāyasa', en: 'sweet rice pudding' },
        ],
        choices: [
          { text: 'Give to Queen Kausalya first', next: 2 },
          { text: 'Divide equally among the queens', next: 2 },
        ],
      },
      {
        idx: 2,
        text: 'Kausalya drinks half. Kaikeyi drinks a quarter. Sumitra drinks the remainder. In time, Rama is born to Kausalya — the avatar of Vishnu, with skin the color of blue lotus. Thus begins the great epic.',
        sanskrit: 'रामः अवतारः नीलकमलवर्णः ।',
        vocab: [
          { dev: 'अवतार', iast: 'avatāra', en: 'incarnation / avatar' },
          { dev: 'नील', iast: 'nīla', en: 'blue' },
          { dev: 'पुत्र', iast: 'putra', en: 'son' },
        ],
        choices: undefined, // end of story -> boss
      },
    ],
  },
  {
    id: 'ramayana-2',
    title: 'Exile to the Forest',
    series: 'Ramayana',
    description: 'Kaikeyi’s boon • 14 years vanavasa • The path of dharma',
    bossName: 'Forest Trial',
    scenes: [
      {
        idx: 0,
        text: 'Kaikeyi claims her two boons. Dasharatha is shattered. Rama accepts exile with a calm smile. "I shall live in the forest for fourteen years."',
        vocab: [
          { dev: 'वन', iast: 'vana', en: 'forest' },
          { dev: 'वर्ष', iast: 'varṣa', en: 'year' },
          { dev: 'धर्म', iast: 'dharma', en: 'duty / righteousness' },
        ],
        choices: [
          { text: 'Accept the exile with grace', next: 1 },
          { text: 'Question the fairness', next: 1 },
        ],
      },
      {
        idx: 1,
        text: 'Lakshmana and Sita insist on following. The trio leaves Ayodhya. Citizens weep. The forest awaits — a new chapter of tapas and trials begins.',
        vocab: [
          { dev: 'वनवास', iast: 'vanavāsa', en: 'forest exile' },
          { dev: 'सहचर', iast: 'sahacara', en: 'companion' },
          { dev: 'तपस्', iast: 'tapas', en: 'austerity' },
        ],
        choices: undefined,
      },
    ],
  },
  {
    id: 'mahabharata-1',
    title: 'The Dice Game',
    series: 'Mahabharata',
    description: 'Sabha Parva • Shakuni’s plot • Draupadi’s humiliation',
    bossName: 'Sabha Reckoning',
    scenes: [
      {
        idx: 0,
        text: 'In the assembly hall, Yudhishthira is drawn into the game of dice. Shakuni rolls with loaded dice. One by one, the Pandavas lose everything — kingdom, brothers, and finally Draupadi.',
        vocab: [
          { dev: 'सभ', iast: 'sabhā', en: 'assembly hall' },
          { dev: 'पण', iast: 'paṇa', en: 'stake / wager' },
          { dev: 'अधर्म', iast: 'adharma', en: 'unrighteousness' },
        ],
        choices: [
          { text: 'Protest the crooked game', next: 1 },
          { text: 'Accept fate in silence', next: 1 },
        ],
      },
      {
        idx: 1,
        text: 'Draupadi is dragged into the hall. She asks the terrible question that shakes the kingdom: "When I was still won, was I already lost?" Dharma itself stands trial.',
        vocab: [
          { dev: 'प्रश्न', iast: 'praśna', en: 'question' },
          { dev: 'न्याय', iast: 'nyāya', en: 'justice' },
          { dev: 'स्त्री', iast: 'strī', en: 'woman / queen' },
        ],
        choices: undefined,
      },
    ],
  },
  {
    id: 'mahabharata-2',
    title: 'Arjuna’s Dilemma',
    series: 'Mahabharata',
    description: 'Kurukshetra • The Gita begins • To fight or not',
    bossName: 'Kurukshetra Test',
    scenes: [
      {
        idx: 0,
        text: 'On the battlefield, Arjuna sees his teachers, cousins, and grandfathers arrayed against him. His bow slips. "I will not fight." Krishna begins to speak.',
        vocab: [
          { dev: 'युद्ध', iast: 'yuddha', en: 'war / battle' },
          { dev: 'गुरु', iast: 'guru', en: 'teacher' },
          { dev: 'कृष्ण', iast: 'kṛṣṇa', en: 'Krishna (dark one)' },
        ],
        choices: [
          { text: 'Listen to the counsel', next: 1 },
          { text: 'Refuse to raise arms', next: 1 },
        ],
      },
      {
        idx: 1,
        text: '"You have the right to action only, never to its fruits." The first teaching of the Gita. The choice of dharma over despair begins here.',
        vocab: [
          { dev: 'कर्म', iast: 'karma', en: 'action' },
          { dev: 'फल', iast: 'phala', en: 'fruit / result' },
          { dev: 'योग', iast: 'yoga', en: 'union / discipline' },
        ],
        choices: undefined,
      },
    ],
  },
];

export const EPISODE_IDS = EPISODES.map(e => e.id);

export function getEpisode(id: string): QuestEpisode | undefined {
  return EPISODES.find(e => e.id === id);
}

export function getAllEpisodes(): QuestEpisode[] {
  return EPISODES;
}
