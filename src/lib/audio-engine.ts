import type { EffectParams } from "./effects";

function makeDistortionCurve(amount: number) {
  const n = 1024;
  const curve = new Float32Array(n);
  const k = amount;
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = ((3 + k) * x * 20 * Math.PI) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export async function decodeAudio(file: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const ctx = new AudioContext();
  try {
    return await ctx.decodeAudioData(arrayBuffer);
  } finally {
    void ctx.close();
  }
}

export async function renderEffect(buffer: AudioBuffer, p: EffectParams): Promise<AudioBuffer> {
  const rate = p.rate ?? 1;
  const tail = p.tail ?? 0.1;
  const length = Math.ceil(buffer.length / rate + tail * buffer.sampleRate);
  const ctx = new OfflineAudioContext(buffer.numberOfChannels, length, buffer.sampleRate);

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;

  let node: AudioNode = source;

  if (p.highpass) {
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = p.highpass;
    node.connect(f);
    node = f;
  }

  if (p.lowpass) {
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = p.lowpass;
    node.connect(f);
    node = f;
  }

  if (p.peaking) {
    const [freq, q, gain] = p.peaking;
    const f = ctx.createBiquadFilter();
    f.type = "peaking";
    f.frequency.value = freq;
    f.Q.value = q;
    f.gain.value = gain;
    node.connect(f);
    node = f;
  }

  if (p.distortion) {
    const pre = ctx.createGain();
    pre.gain.value = 0.6;
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(p.distortion);
    shaper.oversample = "4x";
    const post = ctx.createGain();
    post.gain.value = 0.35;
    node.connect(pre);
    pre.connect(shaper);
    shaper.connect(post);
    node = post;
  }

  if (p.ringMod) {
    const ring = ctx.createGain();
    ring.gain.value = 0;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = p.ringMod;
    osc.connect(ring.gain);
    osc.start();
    node.connect(ring);
    node = ring;
  }

  if (p.tremolo) {
    const trem = ctx.createGain();
    trem.gain.value = 0.65;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = p.tremolo;
    const depth = ctx.createGain();
    depth.gain.value = 0.35;
    osc.connect(depth);
    depth.connect(trem.gain);
    osc.start();
    node.connect(trem);
    node = trem;
  }

  const out = ctx.createGain();
  out.gain.value = p.gain ?? 1;

  if (p.delay) {
    const delay = ctx.createDelay(5);
    delay.delayTime.value = p.delay;
    const fb = ctx.createGain();
    fb.gain.value = Math.min(p.feedback ?? 0.3, 0.8);
    const wet = ctx.createGain();
    wet.gain.value = p.wet ?? 0.35;
    node.connect(delay);
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wet);
    wet.connect(out);
  }

  node.connect(out);
  out.connect(ctx.destination);
  source.start();

  return ctx.startRendering();
}

export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const frames = buffer.length;
  const bytesPerSample = 2;
  const dataSize = frames * numChannels * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < numChannels; c++) {
      const s = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
