// Helper: Convert webm/ogg audio to wav (mono, LINEAR16, 44100Hz)
export async function convertToWav(blob: Blob): Promise<Blob> {
  // Use web-audio-api to decode and encode
  const arrayBuffer = await blob.arrayBuffer();
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtx({ sampleRate: 44100 });
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  // Convert to mono
  const monoBuffer = audioCtx.createBuffer(1, audioBuffer.length, 44100);
  monoBuffer.getChannelData(0).set(audioBuffer.getChannelData(0));
  // Encode to wav LINEAR16
  const wavArrayBuffer = encodeWAV(monoBuffer);
  return new Blob([wavArrayBuffer], { type: "audio/wav" });
}

// Helper: Encode AudioBuffer to wav LINEAR16
export function encodeWAV(audioBuffer: AudioBuffer): ArrayBuffer {
  const numChannels = 1;
  const sampleRate = 44100;
  const format = 1; // PCM
  const bitDepth = 16;
  const samples = audioBuffer.getChannelData(0);
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, (sampleRate * numChannels * bitDepth) / 8, true);
  view.setUint16(32, (numChannels * bitDepth) / 8, true);
  view.setUint16(34, bitDepth, true);
  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);
  // PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
