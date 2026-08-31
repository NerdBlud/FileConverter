import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let ffmpeg: FFmpeg | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }) => {
    self.postMessage({ type: "LOG", message });
  });

  ffmpeg.on("progress", ({ progress, time }) => {
    self.postMessage({
      type: "PROGRESS",
      progress: Math.min(Math.max(progress, 0), 1),
      time,
    });
  });

  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

  self.postMessage({ type: "LOG", message: "Loading engine..." });

  const [coreURL, wasmURL] = await Promise.all([
    toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  ]);

  await ffmpeg.load({ coreURL, wasmURL });

  self.postMessage({ type: "LOG", message: "Engine ready." });

  return ffmpeg;
}

self.onmessage = async (e: MessageEvent) => {
  const { type } = e.data;

  if (type === "CONVERT") {
    const { fileData, inputName, outputName, command } = e.data;
    let ff: FFmpeg | null = null;
    try {
      ff = await getFFmpeg();

      self.postMessage({ type: "LOG", message: `Mounting ${inputName}...` });
      await ff.writeFile(inputName, new Uint8Array(fileData));

      self.postMessage({ type: "LOG", message: `Running: ffmpeg ${command.join(" ")}` });
      const exitCode = await ff.exec(command);

      if (exitCode !== 0) {
        throw new Error(`Process exited with code ${exitCode}`);
      }

      self.postMessage({ type: "LOG", message: "Processing complete." });
      const result = await ff.readFile(outputName);

      const data = result instanceof Uint8Array ? result : new TextEncoder().encode(result as string);
      
      self.postMessage(
        { type: "DONE", data: data.buffer },
        { transfer: [data.buffer] }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion error";
      self.postMessage({ type: "ERROR", message });
    } finally {
      if (ff) {
        try { await ff.deleteFile(inputName); } catch (_) {}
        try { await ff.deleteFile(outputName); } catch (_) {}
      }
    }
  }

  if (type === "TERMINATE") {
    if (ffmpeg) {
      try {
        ffmpeg.terminate();
      } catch (_) {}
      ffmpeg = null;
    }
  }
};
