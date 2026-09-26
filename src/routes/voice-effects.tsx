import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteLayout } from "@/components/SiteLayout";
import { effects } from "@/lib/effects";

export const Route = createFileRoute("/voice-effects")({
  component: EffectsPage,
  head: () => ({
    meta: [
      { title: "All Voice Effects — 12 Free Voice Changers Compared | VoxMorph" },
      {
        name: "description",
        content:
          "Compare 12 free voice effects: robot, chipmunk, helium, deep, monster, ghost, alien, telephone, megaphone, underwater, cave echo and radio DJ. Hear what each one does and download your audio.",
      },
      { property: "og:title", content: "All Voice Effects — 12 Free Voice Changers Compared" },
      {
        property: "og:description",
        content:
          "A guide to every voice effect in VoxMorph, what it sounds like and when to use it.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/voice-effects" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/voice-effects" }],
  }),
});

function EffectsPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-5 pb-16 pt-14">
        <h1 className="font-display text-4xl font-bold sm:text-5xl">Every voice effect explained</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Each preset combines pitch shifting, filtering, modulation and echo in a different way.
          Here is what every voice changer sounds like and where it works best.
        </p>

        <div className="mt-10 space-y-6">
          {effects.map((e) => (
            <section key={e.slug} className="rounded-2xl border border-border bg-card/60 p-6">
              <h2 className="font-display text-2xl font-bold">
                {e.emoji} {e.name} voice changer
              </h2>
              <p className="mt-3 text-muted-foreground">{e.description}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                <strong className="text-foreground">Sounds like:</strong> {e.howItSounds}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <strong className="text-foreground">Best for:</strong> {e.useCases.join(", ")}.
              </p>
              <Link
                to="/voice/$slug"
                params={{ slug: e.slug }}
                className="mt-4 inline-block text-sm text-primary underline"
              >
                Try the {e.name} voice changer
              </Link>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
