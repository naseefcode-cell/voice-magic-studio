import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";

const faqs = [
  {
    q: "How do I change my voice online for free?",
    a: "Open the voice changer, record a clip or upload an audio file, tap one of the 12 effects and press Download WAV. There is no account, no payment and no watermark.",
  },
  {
    q: "Can I download the changed audio?",
    a: "Yes. Every result can be saved as an uncompressed WAV file, ready for video editors, games, podcasts or messaging apps.",
  },
  {
    q: "Which audio formats can I upload?",
    a: "Anything your browser can decode, which normally covers MP3, WAV, M4A, AAC, OGG and WebM recordings.",
  },
  {
    q: "Is my recording private?",
    a: "Completely. The microphone stream and all effect processing stay inside your browser using the Web Audio API — no file is ever sent to a server.",
  },
  {
    q: "Does the voice changer work in real time on calls?",
    a: "It changes recorded clips rather than a live call. Record, transform and download, then play the file back in the app where you need it.",
  },
  {
    q: "Why can't the site hear my microphone?",
    a: "The browser needs microphone permission. Check the padlock icon in the address bar and allow access, or upload an existing recording instead.",
  },
  {
    q: "Is there a length limit?",
    a: "There is no hard limit, but very long clips use more memory because processing happens on your device. A few minutes at a time works smoothly.",
  },
  {
    q: "Can I use the audio commercially?",
    a: "Yes. You own your recording and the transformed version, so you can use it in monetised videos, games and client work.",
  },
];

export const Route = createFileRoute("/faq")({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: "Voice Changer FAQ — Downloads, Privacy and Formats | VoxMorph" },
      {
        name: "description",
        content:
          "Answers about the free online voice changer: how to download changed audio, supported formats, microphone permissions, privacy and commercial use.",
      },
      { property: "og:title", content: "Voice Changer FAQ — Downloads, Privacy and Formats" },
      {
        property: "og:description",
        content:
          "Common questions about changing your voice online, downloading WAV files and keeping recordings private.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/faq" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function FaqPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-5 pb-16 pt-14">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Voice changer FAQ</h1>
        <div className="mt-8 space-y-4">
          {faqs.map((f) => (
            <section key={f.q} className="rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="font-display text-lg font-semibold">{f.q}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </section>
          ))}
        </div>
        <Link to="/" className="mt-8 inline-block text-primary underline">
          Back to the voice changer
        </Link>
      </div>
    </SiteLayout>
  );
}
