export type EffectParams = {
  /** playback rate — shifts pitch and speed together */
  rate?: number;
  /** ring modulation frequency in Hz */
  ringMod?: number;
  /** tremolo rate in Hz */
  tremolo?: number;
  lowpass?: number;
  highpass?: number;
  /** [frequency, Q, gain] peaking boost */
  peaking?: [number, number, number];
  /** waveshaper drive amount, 0 = off */
  distortion?: number;
  /** delay time in seconds */
  delay?: number;
  feedback?: number;
  wet?: number;
  /** extra render tail in seconds */
  tail?: number;
  gain?: number;
};

export type Effect = {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  howItSounds: string;
  useCases: string[];
  params: EffectParams;
};

export const effects: Effect[] = [
  {
    slug: "chipmunk",
    name: "Chipmunk",
    emoji: "🐿️",
    tagline: "High, fast and cartoonish",
    description:
      "The chipmunk voice changer lifts your pitch far above its natural range, turning any recording into a bright, squeaky cartoon character in a single click.",
    howItSounds:
      "Roughly an octave up with a faster delivery — the classic sped-up tape sound used in cartoons and comedy dubs.",
    useCases: ["Funny voice notes", "Cartoon dubbing", "Prank calls", "Kids' story narration"],
    params: { rate: 1.65, peaking: [3000, 1, 3] },
  },
  {
    slug: "deep-voice",
    name: "Deep Voice",
    emoji: "🎙️",
    tagline: "Lower, heavier, more serious",
    description:
      "The deep voice changer drops your pitch into a rich low register, perfect for movie-trailer narration or making an anonymous recording sound heavier.",
    howItSounds: "Pitched down with extra low-end weight and a slower, calmer cadence.",
    useCases: ["Trailer voiceovers", "Audiobook intros", "Anonymous messages", "Gaming clips"],
    params: { rate: 0.72, lowpass: 7000, peaking: [140, 1, 5] },
  },
  {
    slug: "robot",
    name: "Robot",
    emoji: "🤖",
    tagline: "Metallic ring-modulated machine talk",
    description:
      "The robot voice changer runs your recording through ring modulation, flattening the human character into a metallic, synthetic machine voice.",
    howItSounds: "Buzzy and mechanical with a constant metallic shimmer over every word.",
    useCases: ["Sci-fi videos", "Game NPC lines", "Assistant prototypes", "Meme audio"],
    params: { ringMod: 58, highpass: 180, peaking: [1600, 1.2, 4] },
  },
  {
    slug: "alien",
    name: "Alien",
    emoji: "👽",
    tagline: "Otherworldly and unstable",
    description:
      "The alien voice changer layers pitch shifting, ring modulation and a short shimmering delay to create a voice that never sounded human in the first place.",
    howItSounds: "Higher pitched, warbling and glassy, with a faint metallic tail.",
    useCases: ["Sci-fi shorts", "Halloween audio", "Game creatures", "Podcast stingers"],
    params: { rate: 1.22, ringMod: 92, delay: 0.09, feedback: 0.3, wet: 0.35, tail: 1.2 },
  },
  {
    slug: "monster",
    name: "Monster",
    emoji: "👹",
    tagline: "Growling, distorted and huge",
    description:
      "The monster voice changer combines heavy pitch-down with saturation so every syllable lands like a growl from something much bigger than you.",
    howItSounds: "Very low, gritty and distorted, with a menacing rumble underneath.",
    useCases: ["Horror trailers", "Game bosses", "Halloween parties", "Creature dubbing"],
    params: { rate: 0.6, distortion: 28, lowpass: 5200, peaking: [110, 1, 6] },
  },
  {
    slug: "ghost",
    name: "Ghost",
    emoji: "👻",
    tagline: "Hollow, drifting and haunted",
    description:
      "The ghost voice changer pitches you down slightly and drowns the result in long, unstable echoes so the words seem to float in from another room.",
    howItSounds: "Breathy and slow with a wavering tremolo and long trailing echo.",
    useCases: ["Horror stories", "Halloween decorations", "Paranormal podcasts", "Film SFX"],
    params: { rate: 0.85, tremolo: 5.5, delay: 0.28, feedback: 0.45, wet: 0.5, tail: 2.5 },
  },
  {
    slug: "telephone",
    name: "Telephone",
    emoji: "☎️",
    tagline: "Narrow-band call quality",
    description:
      "The telephone voice changer squeezes your audio into the narrow frequency band of a phone line, instantly making a clean recording sound like a call.",
    howItSounds: "Thin and boxy, with the lows and highs cut away like an old handset.",
    useCases: ["Film dialogue", "Radio drama", "Podcast call-ins", "Game cutscenes"],
    params: { highpass: 600, lowpass: 2900, peaking: [1800, 2, 6], distortion: 6 },
  },
  {
    slug: "megaphone",
    name: "Megaphone",
    emoji: "📢",
    tagline: "Loud, clipped announcement voice",
    description:
      "The megaphone voice changer adds midrange bite and controlled clipping so your voice cuts through like a stadium announcement or riot-police loudhailer.",
    howItSounds: "Harsh, mid-forward and slightly distorted, as if shouted through a horn.",
    useCases: ["Protest scenes", "Sports edits", "Announcements", "Action game audio"],
    params: { highpass: 500, lowpass: 3800, peaking: [2200, 2.5, 9], distortion: 35 },
  },
  {
    slug: "underwater",
    name: "Underwater",
    emoji: "🌊",
    tagline: "Muffled and submerged",
    description:
      "The underwater voice changer rolls off the highs and adds a slow wobble, so the recording sounds like it was spoken beneath the surface of a pool.",
    howItSounds: "Dark and muffled with a gentle swimming modulation.",
    useCases: ["Dream sequences", "Diving videos", "Meditation audio", "Game ambience"],
    params: { rate: 0.94, lowpass: 900, tremolo: 2.2, delay: 0.14, feedback: 0.25, wet: 0.3, tail: 1.2 },
  },
  {
    slug: "cave-echo",
    name: "Cave Echo",
    emoji: "🕳️",
    tagline: "Huge reflective space",
    description:
      "The cave echo voice changer feeds your voice through a long feedback delay to place it inside a vast stone chamber without any recording gear.",
    howItSounds: "Repeating, slowly decaying reflections behind an otherwise natural voice.",
    useCases: ["Fantasy narration", "Meditation tracks", "Game dungeons", "Dramatic readings"],
    params: { delay: 0.38, feedback: 0.55, wet: 0.55, tail: 3.5 },
  },
  {
    slug: "helium",
    name: "Helium",
    emoji: "🎈",
    tagline: "Balloon-party squeak",
    description:
      "The helium voice changer reproduces the party-balloon effect: a big pitch jump with extra top-end sparkle, without touching an actual gas canister.",
    howItSounds: "Light, squeaky and airy, a little less extreme than the chipmunk preset.",
    useCases: ["Party videos", "Birthday messages", "Comedy sketches", "Reaction edits"],
    params: { rate: 1.42, highpass: 220, peaking: [4200, 1, 4] },
  },
  {
    slug: "radio-dj",
    name: "Radio DJ",
    emoji: "📻",
    tagline: "Warm broadcast polish",
    description:
      "The radio DJ voice changer drops your pitch slightly and adds broadcast-style low-end warmth and presence for a confident on-air sound.",
    howItSounds: "Slightly deeper and fuller, with a polished FM-radio presence lift.",
    useCases: ["Podcast intros", "Radio jingles", "YouTube voiceovers", "Ad reads"],
    params: { rate: 0.92, peaking: [180, 0.9, 5], highpass: 80, distortion: 4, gain: 1.1 },
  },
];

export const effectBySlug = (slug: string) => effects.find((e) => e.slug === slug);
