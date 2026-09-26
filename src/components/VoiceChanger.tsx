import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, Loader2, Mic, Play, Square, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

import { effects, type Effect } from "@/lib/effects";
import { audioBufferToWav, decodeAudio, renderEffect } from "@/lib/audio-engine";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "recording" | "processing";

export function VoiceChanger({ initialEffect }: { initialEffect?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [selected, setSelected] = useState<string>(initialEffect ?? effects[0].slug);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const sourceBuffer = useRef<AudioBuffer | null>(null);
  const resultBlob = useRef<Blob | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const effect = useMemo(
    () => effects.find((e) => e.slug === selected) ?? effects[0],
    [selected],
  );

  useEffect(() => {
    if (initialEffect) setSelected(initialEffect);
  }, [initialEffect]);

  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    },
    [resultUrl],
  );

  const process = useCallback(
    async (target: Effect) => {
      if (!sourceBuffer.current) return;
      setStatus("processing");
      try {
        const rendered = await renderEffect(sourceBuffer.current, target.params);
        const blob = audioBufferToWav(rendered);
        resultBlob.current = blob;
        setResultUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      } catch {
        toast.error("Couldn't apply that voice. Try a shorter clip.");
      } finally {
        setStatus("idle");
      }
    },
    [],
  );

  const loadBlob = useCallback(
    async (blob: Blob, name: string) => {
      setStatus("processing");
      try {
        sourceBuffer.current = await decodeAudio(blob);
        setSourceName(name);
        await process(effect);
      } catch {
        setStatus("idle");
        toast.error("That audio file couldn't be read. Try MP3, WAV, M4A or OGG.");
      }
    },
    [effect, process],
  );

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunks.current = [];
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        void loadBlob(blob, "Your recording");
      };
      rec.start();
      recorder.current = rec;
      setSeconds(0);
      setStatus("recording");
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      toast.error("Microphone access was blocked. Allow it in your browser, or upload a file.");
    }
  }, [loadBlob]);

  const stopRecording = useCallback(() => {
    recorder.current?.stop();
    recorder.current = null;
    if (timer.current) clearInterval(timer.current);
    setStatus("idle");
  }, []);

  const pickEffect = (slug: string) => {
    setSelected(slug);
    const target = effects.find((e) => e.slug === slug);
    if (target && sourceBuffer.current) void process(target);
  };

  const download = () => {
    if (!resultBlob.current || !resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `${effect.slug}-voice.wav`;
    a.click();
    toast.success("Audio downloaded as WAV");
  };

  const busy = status === "processing";

  return (
    <div className="rounded-3xl border border-border bg-card/70 p-5 shadow-panel backdrop-blur sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        {status === "recording" ? (
          <Button variant="destructive" size="lg" className="flex-1" onClick={stopRecording}>
            <Square className="mr-2 size-4" /> Stop recording · {seconds}s
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1 bg-neon-gradient font-semibold text-primary-foreground shadow-neon hover:opacity-90"
            onClick={startRecording}
            disabled={busy}
          >
            <Mic className="mr-2 size-4" /> Record your voice
          </Button>
        )}

        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => fileInput.current?.click()}
          disabled={busy || status === "recording"}
        >
          <Upload className="mr-2 size-4" /> Upload audio file
        </Button>
        <input
          ref={fileInput}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void loadBlob(file, file.name);
            e.target.value = "";
          }}
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {sourceName
          ? `Loaded: ${sourceName}`
          : "Everything runs inside your browser — no upload, no account, no watermark."}
      </p>

      <div className="mt-7">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Choose a voice effect
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {effects.map((e) => (
            <button
              key={e.slug}
              type="button"
              onClick={() => pickEffect(e.slug)}
              className={cn(
                "group rounded-2xl border border-border bg-secondary/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/60",
                e.slug === selected && "border-primary bg-secondary shadow-neon",
              )}
            >
              <span className="text-2xl">{e.emoji}</span>
              <span className="mt-2 block font-display text-sm font-semibold">{e.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{e.tagline}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 rounded-2xl border border-border bg-studio/70 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium">
            <Wand2 className="size-4 text-primary" /> {effect.name} result
          </span>
          {busy && (
            <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Processing…
            </span>
          )}
        </div>

        {resultUrl ? (
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <audio controls src={resultUrl} className="w-full sm:flex-1" />
            <Button
              onClick={download}
              className="bg-neon-gradient font-semibold text-primary-foreground shadow-neon hover:opacity-90"
            >
              <Download className="mr-2 size-4" /> Download WAV
            </Button>
          </div>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Play className="size-4" /> Record or upload a clip to hear it with the {effect.name}{" "}
            voice.
          </p>
        )}
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        Want details on this voice?{" "}
        <Link to="/voice/$slug" params={{ slug: effect.slug }} className="text-primary underline">
          Read the {effect.name} voice changer guide
        </Link>
        .
      </p>
    </div>
  );
}
