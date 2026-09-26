import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { VoiceChanger } from "@/components/VoiceChanger";
import { effects } from "@/lib/effects";

const faqs = [
  {
    q: "Is this online voice changer free?",
    a: "Yes. Every voice effect, unlimited clips and WAV downloads are free, with no account and no watermark.",
  },
  {
    q: "Does my audio get uploaded to a server?",
    a: "No. Recording, effect processing and the download all happen locally in your browser using the Web Audio API.",
  },
  {
    q: "Can I download the changed voice?",
    a: "Yes — after applying an effect, press Download WAV to save a full-quality file you can use in videos, games or messaging apps.",
  },
  {
    q: "Does it work on a phone?",
    a: "It works in modern mobile browsers such as Chrome, Safari and Edge. Allow microphone access, or upload an existing recording instead.",
  },
];

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Free Online Voice Changer — 12 Voice Effects with Audio Download | VoxMorph" },
      {
        name: "description",
        content:
          "Change your voice online for free: robot, chipmunk, deep, monster, ghost, telephone and more. Record or upload audio, apply effects instantly and download the result as WAV.",
      },
      {
        property: "og:title",
        content: "Free Online Voice Changer with 12 Effects and Audio Download",
      },
      {
        property: "og:description",
        content:
          "Record or upload a clip, pick a voice effect and download the changed audio. Runs entirely in your browser — no signup, no upload.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "VoxMorph Voice Changer",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any modern web browser",
              description:
                "Free online voice changer with 12 effects, browser-only processing and WAV download.",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
});

function Home() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:pt-20">
        <p className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Free · No signup · Private
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
          Online <span className="text-neon-gradient">voice changer</span> with 12 effects and
          instant audio download
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Record straight from your microphone or upload an existing clip, switch between robot,
          chipmunk, deep, monster, ghost and other voices, then download the result as a WAV file.
          Nothing ever leaves your device.
        </p>

        <div className="mt-10">
          <VoiceChanger />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold">How the voice changer works</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            {
              t: "1. Capture your audio",
              d: "Press record and speak for a few seconds, or upload an MP3, WAV, M4A or OGG file you already have.",
            },
            {
              t: "2. Pick a voice effect",
              d: "Tap any of the 12 presets. Each one re-renders your clip instantly with pitch shifting, filtering, modulation or echo.",
            },
            {
              t: "3. Download the result",
              d: "Preview it in the player, then save a full-quality WAV to use in videos, games, podcasts or chat apps.",
            },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold">All voice effects</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Twelve distinct voice changers, each tuned for a different use — from comedy and gaming to
          horror narration and broadcast-style voiceovers.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {effects.map((e) => (
            <Link
              key={e.slug}
              to="/voice/$slug"
              params={{ slug: e.slug }}
              className="rounded-2xl border border-border bg-card/60 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/60"
            >
              <span className="text-2xl">{e.emoji}</span>
              <h3 className="mt-3 font-display text-lg font-semibold">{e.name} voice changer</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold">Frequently asked questions</h2>
        <div className="mt-6 space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-2xl border border-border bg-card/60 p-6">
              <h3 className="font-display text-lg font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          More answers on the{" "}
          <Link to="/faq" className="text-primary underline">
            full FAQ page
          </Link>
          .
        </p>
      </section>
    </SiteLayout>
  );
}
