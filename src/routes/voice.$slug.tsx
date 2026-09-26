import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { VoiceChanger } from "@/components/VoiceChanger";
import { effectBySlug, effects } from "@/lib/effects";

export const Route = createFileRoute("/voice/$slug")({
  loader: ({ params }) => {
    const effect = effectBySlug(params.slug);
    if (!effect) throw notFound();
    return { effect };
  },
  head: ({ params, loaderData }) => {
    const effect = loaderData?.effect;
    const title = effect
      ? `${effect.name} Voice Changer — Free Online, Download as Audio | VoxMorph`
      : "Voice Changer | VoxMorph";
    const description = effect
      ? `${effect.description} Record or upload a clip, apply the ${effect.name.toLowerCase()} voice in your browser and download it as a WAV file — free, no signup.`
      : "Free online voice changer.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/voice/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/voice/${params.slug}` }],
      scripts: effect
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: `How to use the ${effect.name} voice changer`,
                step: [
                  { "@type": "HowToStep", text: "Record your voice or upload an audio file." },
                  { "@type": "HowToStep", text: `Select the ${effect.name} effect.` },
                  { "@type": "HowToStep", text: "Preview the result and download it as WAV." },
                ],
              }),
            },
          ]
        : [],
    };
  },
  component: VoicePage,
});

function VoicePage() {
  const { effect } = Route.useLoaderData();
  const others = effects.filter((e) => e.slug !== effect.slug).slice(0, 6);

  return (
    <SiteLayout>
      <article className="mx-auto max-w-4xl px-5 pb-10 pt-14">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← All voice changers
        </Link>
        <span className="mt-6 block text-4xl">{effect.emoji}</span>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          {effect.name} voice changer
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{effect.description}</p>

        <div className="mt-8">
          <VoiceChanger initialEffect={effect.slug} />
        </div>

        <h2 className="mt-12 font-display text-2xl font-bold">How the {effect.name} voice sounds</h2>
        <p className="mt-3 text-muted-foreground">{effect.howItSounds}</p>

        <h2 className="mt-10 font-display text-2xl font-bold">
          What people use the {effect.name} voice for
        </h2>
        <ul className="mt-3 grid gap-2 text-muted-foreground sm:grid-cols-2">
          {effect.useCases.map((u) => (
            <li key={u} className="rounded-xl border border-border bg-card/60 px-4 py-3 text-sm">
              {u}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 font-display text-2xl font-bold">
          How to change your voice to {effect.name.toLowerCase()} and download it
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground">
          <li>Press “Record your voice” and allow microphone access, or upload an audio file.</li>
          <li>The {effect.name.toLowerCase()} effect is already selected on this page.</li>
          <li>Play the preview to check the result, and switch effects if you want to compare.</li>
          <li>Press “Download WAV” to save the changed audio to your device.</li>
        </ol>

        <h2 className="mt-10 font-display text-2xl font-bold">Other voice effects</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((e) => (
            <Link
              key={e.slug}
              to="/voice/$slug"
              params={{ slug: e.slug }}
              className="rounded-xl border border-border bg-card/60 px-4 py-3 text-sm transition-colors hover:border-primary/60"
            >
              {e.emoji} {e.name} voice changer — {e.tagline}
            </Link>
          ))}
        </div>
      </article>
    </SiteLayout>
  );
}
