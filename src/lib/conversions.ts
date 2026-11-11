export type FileCategory = "image" | "video" | "audio" | "document" | "archive" | "unknown";

export type TargetCategory = "recommended" | "audio" | "video" | "image" | "animation" | "document";

export interface ConversionOptions {
  audioBitrate?: "320k" | "192k" | "128k" | "lossless";
  videoScale?: "original" | "1080p" | "720p" | "480p";
  gifFps?: number;
  crfQuality?: number;
}

export interface ConversionTarget {
  ext: string;
  label: string;
  name: string;
  category: TargetCategory;
  mimeType: string;
  tag?: string;
  description: string;
}

const MIME_MAP: Record<string, FileCategory> = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "image/bmp": "image",
  "image/tiff": "image",
  "image/x-icon": "image",
  "image/vnd.microsoft.icon": "image",
  "image/svg+xml": "image",
  "image/avif": "image",
  "image/heic": "image",
  "image/heif": "image",
  "image/x-tga": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/x-msvideo": "video",
  "video/quicktime": "video",
  "video/x-matroska": "video",
  "video/x-flv": "video",
  "video/x-ms-wmv": "video",
  "video/mp2t": "video",
  "video/3gpp": "video",
  "video/ogg": "video",
  "video/mpeg": "video",
  "audio/mpeg": "audio",
  "audio/mp3": "audio",
  "audio/wav": "audio",
  "audio/x-wav": "audio",
  "audio/ogg": "audio",
  "audio/flac": "audio",
  "audio/x-flac": "audio",
  "audio/aac": "audio",
  "audio/x-m4a": "audio",
  "audio/mp4": "audio",
  "audio/opus": "audio",
  "audio/x-ms-wma": "audio",
  "audio/aiff": "audio",
  "audio/x-aiff": "audio",
  "audio/ac3": "audio",
  "audio/amr": "audio",
  "application/pdf": "document",
};

const EXT_MAP: Record<string, FileCategory> = {
  jpg: "image", jpeg: "image", png: "image", webp: "image", gif: "image",
  bmp: "image", tiff: "image", tif: "image", ico: "image", svg: "image",
  avif: "image", tga: "image", ppm: "image", pgm: "image", pbm: "image",
  pcx: "image", xpm: "image", hdr: "image", heic: "image",
  qoi: "image", pam: "image", dpx: "image", jp2: "image",
  mp4: "video", webm: "video", mkv: "video", avi: "video", mov: "video",
  wmv: "video", flv: "video", m4v: "video", ts: "video", m2ts: "video",
  "3gp": "video", ogv: "video", mpg: "video", mpeg: "video", vob: "video",
  asf: "video", rm: "video", rmvb: "video", nut: "video",
  mp3: "audio", wav: "audio", ogg: "audio", flac: "audio", aac: "audio",
  m4a: "audio", opus: "audio", wma: "audio", aiff: "audio", aif: "audio",
  ac3: "audio", amr: "audio", m4r: "audio", mp2: "audio", caf: "audio",
  voc: "audio", au: "audio", mka: "audio",
  pdf: "document", txt: "document", md: "document",
};

export function detectCategory(file: File): FileCategory {
  const byMime = MIME_MAP[file.type.toLowerCase()];
  if (byMime) return byMime;

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MAP[ext] ?? "unknown";
}

export function getFileExtension(file: File): string {
  return file.name.split(".").pop()?.toLowerCase() ?? "";
}

export const ALL_TARGETS: Record<string, ConversionTarget> = {
  mp3: { ext: "mp3", label: "MP3", name: "MPEG Audio Layer III", category: "audio", mimeType: "audio/mpeg", tag: "Popular", description: "Universal audio format" },
  wav: { ext: "wav", label: "WAV", name: "Waveform Audio", category: "audio", mimeType: "audio/wav", tag: "Lossless", description: "Uncompressed PCM audio" },
  aac: { ext: "aac", label: "AAC", name: "Advanced Audio Coding", category: "audio", mimeType: "audio/aac", tag: "High Quality", description: "High efficiency audio standard" },
  flac: { ext: "flac", label: "FLAC", name: "Free Lossless Audio Codec", category: "audio", mimeType: "audio/flac", tag: "Lossless", description: "Compressed lossless audio" },
  ogg: { ext: "ogg", label: "OGG", name: "Ogg Vorbis Audio", category: "audio", mimeType: "audio/ogg", tag: "Open", description: "Open source audio codec" },
  m4a: { ext: "m4a", label: "M4A", name: "MPEG-4 Audio", category: "audio", mimeType: "audio/mp4", tag: "Apple", description: "Apple audio container" },
  opus: { ext: "opus", label: "OPUS", name: "Opus Audio", category: "audio", mimeType: "audio/opus", tag: "Modern", description: "Low latency audio codec" },
  wma: { ext: "wma", label: "WMA", name: "Windows Media Audio", category: "audio", mimeType: "audio/x-ms-wma", tag: "Windows", description: "Windows audio format" },
  aiff: { ext: "aiff", label: "AIFF", name: "Audio Interchange", category: "audio", mimeType: "audio/aiff", tag: "Lossless", description: "Apple uncompressed studio audio" },
  ac3: { ext: "ac3", label: "AC3", name: "Dolby Digital", category: "audio", mimeType: "audio/ac3", tag: "Cinema", description: "Dolby multi-channel audio" },
  amr: { ext: "amr", label: "AMR", name: "Adaptive Multi-Rate", category: "audio", mimeType: "audio/amr", tag: "Voice", description: "Speech optimized audio" },
  m4r: { ext: "m4r", label: "M4R", name: "iPhone Ringtone", category: "audio", mimeType: "audio/x-m4r", tag: "Ringtone", description: "iOS ringtone format" },
  caf: { ext: "caf", label: "CAF", name: "Core Audio Format", category: "audio", mimeType: "audio/x-caf", description: "Apple audio container with uncompressed PCM" },
  au: { ext: "au", label: "AU", name: "Sun Audio", category: "audio", mimeType: "audio/basic", description: "Sun and NeXT audio container with uncompressed PCM" },
  mka: { ext: "mka", label: "MKA", name: "Matroska Audio", category: "audio", mimeType: "audio/x-matroska", description: "Matroska audio container with lossless FLAC" },
  mp2: { ext: "mp2", label: "MP2", name: "MPEG Audio Layer II", category: "audio", mimeType: "audio/mpeg", tag: "Broadcast", description: "Broadcast audio format" },

  mp4: { ext: "mp4", label: "MP4", name: "MPEG-4 Video", category: "video", mimeType: "video/mp4", tag: "Universal", description: "H.264/AAC universal video" },
  webm: { ext: "webm", label: "WEBM", name: "WebM Video", category: "video", mimeType: "video/webm", tag: "Web Ready", description: "VP8/VP9 open web video" },
  mkv: { ext: "mkv", label: "MKV", name: "Matroska Video", category: "video", mimeType: "video/x-matroska", tag: "Universal", description: "Extensible multimedia container" },
  avi: { ext: "avi", label: "AVI", name: "Audio Video Interleave", category: "video", mimeType: "video/x-msvideo", tag: "Legacy", description: "Classic Windows video format" },
  mov: { ext: "mov", label: "MOV", name: "QuickTime Movie", category: "video", mimeType: "video/quicktime", tag: "Apple", description: "Apple QuickTime container" },
  wmv: { ext: "wmv", label: "WMV", name: "Windows Media Video", category: "video", mimeType: "video/x-ms-wmv", tag: "Windows", description: "Windows video format" },
  flv: { ext: "flv", label: "FLV", name: "Flash Video", category: "video", mimeType: "video/x-flv", tag: "Legacy", description: "Flash video format" },
  "3gp": { ext: "3gp", label: "3GP", name: "3GPP Mobile Video", category: "video", mimeType: "video/3gpp", tag: "Mobile", description: "Mobile video format" },
  ts: { ext: "ts", label: "TS", name: "MPEG Transport Stream", category: "video", mimeType: "video/mp2t", tag: "Broadcast", description: "Broadcast transport stream" },
  m2ts: { ext: "m2ts", label: "M2TS", name: "Blu-ray Transport Stream", category: "video", mimeType: "video/mp2t", description: "192-byte MPEG transport stream used by Blu-ray and AVCHD" },
  nut: { ext: "nut", label: "NUT", name: "NUT Multimedia Container", category: "video", mimeType: "video/x-nut", description: "Open video container used by FFmpeg" },
  ogv: { ext: "ogv", label: "OGV", name: "Ogg Theora Video", category: "video", mimeType: "video/ogg", tag: "Open", description: "Open source video format" },
  mpg: { ext: "mpg", label: "MPG", name: "MPEG Video", category: "video", mimeType: "video/mpeg", tag: "Classic", description: "MPEG-1/MPEG-2 format" },

  png: { ext: "png", label: "PNG", name: "Portable Network Graphics", category: "image", mimeType: "image/png", tag: "Lossless", description: "Lossless bitmap image" },
  jpg: { ext: "jpg", label: "JPG", name: "JPEG Image", category: "image", mimeType: "image/jpeg", tag: "Standard", description: "Standard photo format" },
  jpeg: { ext: "jpeg", label: "JPEG", name: "JPEG Image", category: "image", mimeType: "image/jpeg", tag: "Standard", description: "Standard lossy format" },
  webp: { ext: "webp", label: "WEBP", name: "WebP Image", category: "image", mimeType: "image/webp", tag: "Modern Web", description: "Next-gen web image" },
  bmp: { ext: "bmp", label: "BMP", name: "Windows Bitmap", category: "image", mimeType: "image/bmp", tag: "Raw", description: "Uncompressed bitmap" },
  tiff: { ext: "tiff", label: "TIFF", name: "Tagged Image File", category: "image", mimeType: "image/tiff", tag: "Print", description: "High-color depth format" },
  ico: { ext: "ico", label: "ICO", name: "Windows Icon", category: "image", mimeType: "image/x-icon", tag: "Favicon", description: "Multi-res icon format" },
  tga: { ext: "tga", label: "TGA", name: "Truevision Targa", category: "image", mimeType: "image/x-tga", tag: "3D/Games", description: "Game texture format" },
  ppm: { ext: "ppm", label: "PPM", name: "Portable Pixmap", category: "image", mimeType: "image/x-portable-pixmap", tag: "Raw", description: "24-bit raw RGB image" },
  pgm: { ext: "pgm", label: "PGM", name: "Portable Graymap", category: "image", mimeType: "image/x-portable-graymap", tag: "Grayscale", description: "Grayscale 8-bit image" },
  pbm: { ext: "pbm", label: "PBM", name: "Portable Bitmap", category: "image", mimeType: "image/x-portable-bitmap", tag: "Monochrome", description: "1-bit monochrome bitmap" },
  pcx: { ext: "pcx", label: "PCX", name: "PiCture eXchange", category: "image", mimeType: "image/x-pcx", tag: "Retro", description: "Classic PC paintbrush" },
  qoi: { ext: "qoi", label: "QOI", name: "Quite OK Image", category: "image", mimeType: "image/qoi", description: "Lossless RGB or RGBA image" },
  pam: { ext: "pam", label: "PAM", name: "Portable Arbitrary Map", category: "image", mimeType: "image/x-portable-arbitrarymap", description: "Netpbm image with alpha support" },
  dpx: { ext: "dpx", label: "DPX", name: "Digital Picture Exchange", category: "image", mimeType: "image/x-dpx", description: "Single-frame format used in film workflows" },
  jp2: { ext: "jp2", label: "JP2", name: "JPEG 2000", category: "image", mimeType: "image/jp2", description: "JPEG 2000 still image" },
  xpm: { ext: "xpm", label: "XPM", name: "X-PixMap", category: "image", mimeType: "image/x-xpixmap", tag: "Unix", description: "ASCII text image" },

  gif: { ext: "gif", label: "GIF", name: "Animated GIF", category: "animation", mimeType: "image/gif", tag: "Animated", description: "Animated graphic format" },
  apng: { ext: "apng", label: "APNG", name: "Animated PNG", category: "animation", mimeType: "image/png", tag: "24-bit", description: "Animated PNG with alpha" },

  pdf: { ext: "pdf", label: "PDF", name: "Portable Document", category: "document", mimeType: "application/pdf", tag: "Document", description: "PDF document format" },
};

export function getSmartTargets(file: File): {
  recommended: ConversionTarget[];
  all: ConversionTarget[];
} {
  const ext = getFileExtension(file);
  const cat = detectCategory(file);

  const targetsList: ConversionTarget[] = [];
  const recKeys: string[] = [];

  if (cat === "video") {
    recKeys.push("mp3", "gif", "webm", "mkv", "wav", "jpg", "png", "avi", "mov");

    ["mp3", "wav", "aac", "flac", "ogg", "m4a", "opus", "wma", "aiff", "ac3", "amr", "m4r", "mp2", "caf", "au", "mka"].forEach((k) => {
      if (ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });

    ["mp4", "webm", "mkv", "avi", "mov", "wmv", "flv", "3gp", "ts", "ogv", "mpg", "m2ts", "nut"].forEach((k) => {
      if (k !== ext && ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });

    ["gif", "jpg", "png", "webp", "bmp"].forEach((k) => {
      if (ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });
  } else if (cat === "audio") {
    recKeys.push("wav", "flac", "ogg", "aac", "m4a", "opus", "mp3");

    ["mp3", "wav", "aac", "flac", "ogg", "m4a", "opus", "wma", "aiff", "ac3", "amr", "m4r", "mp2", "caf", "au", "mka"].forEach((k) => {
      if (k !== ext && ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });
  } else if (cat === "image") {
    recKeys.push("png", "jpg", "webp", "pdf", "ico", "bmp", "gif");

    ["png", "jpg", "jpeg", "webp", "gif", "bmp", "tiff", "ico", "pdf", "tga", "ppm", "pgm", "pbm", "pcx", "xpm", "qoi", "pam", "dpx", "jp2"].forEach((k) => {
      if (k !== ext && ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });
  } else if (cat === "document") {
    recKeys.push("pdf", "png", "jpg");
    ["pdf", "png", "jpg"].forEach((k) => {
      if (ALL_TARGETS[k]) targetsList.push(ALL_TARGETS[k]);
    });
  } else {
    recKeys.push("mp4", "mp3", "png", "jpg", "pdf", "gif", "wav", "webp");
    Object.values(ALL_TARGETS).forEach((t) => targetsList.push(t));
  }

  const seen = new Set<string>();
  const all = targetsList.filter((t) => {
    if (seen.has(t.ext)) return false;
    seen.add(t.ext);
    return true;
  });

  const recommended = recKeys
    .filter((k) => k !== ext && ALL_TARGETS[k])
    .map((k) => ALL_TARGETS[k]);

  return { recommended, all };
}

export function buildFFmpegCommand(
  inputName: string,
  outputName: string,
  inputExt: string,
  outputExt: string,
  options?: ConversionOptions
): string[] {
  const inCat = EXT_MAP[inputExt] || "unknown";
  const outTarget = ALL_TARGETS[outputExt];
  const outCat = outTarget ? outTarget.category : "unknown";

  const bitrate = options?.audioBitrate === "lossless" ? "320k" : options?.audioBitrate || "192k";
  const scaleFilter = options?.videoScale === "1080p"
    ? "scale=-2:1080"
    : options?.videoScale === "720p"
    ? "scale=-2:720"
    : options?.videoScale === "480p"
    ? "scale=-2:480"
    : "";

  const gifFps = options?.gifFps || 12;

  if (outputExt === "caf" || outputExt === "au" || outputExt === "mka") {
    const codec = outputExt === "mka" ? "flac" : "pcm_s16be";
    return ["-i", inputName, "-map", "0:a:0", "-c:a", codec, outputName];
  }

  if (inCat === "video" && (outCat === "audio" || ["mp3", "wav", "aac", "flac", "ogg", "m4a", "opus", "wma", "aiff", "ac3", "amr", "m4r", "mp2"].includes(outputExt))) {
    switch (outputExt) {
      case "mp3":
        return ["-i", inputName, "-vn", "-acodec", "libmp3lame", "-b:a", bitrate, outputName];
      case "wav":
        return ["-i", inputName, "-vn", "-acodec", "pcm_s16le", outputName];
      case "flac":
        return ["-i", inputName, "-vn", "-acodec", "flac", outputName];
      case "ogg":
        return ["-i", inputName, "-vn", "-acodec", "libvorbis", "-b:a", bitrate, outputName];
      case "aac":
      case "m4a":
      case "m4r":
        return ["-i", inputName, "-vn", "-acodec", "aac", "-b:a", bitrate, outputName];
      case "opus":
        return ["-i", inputName, "-vn", "-acodec", "libopus", "-b:a", bitrate, outputName];
      case "wma":
        return ["-i", inputName, "-vn", "-acodec", "wmav2", "-b:a", bitrate, outputName];
      case "aiff":
        return ["-i", inputName, "-vn", "-acodec", "pcm_s16be", outputName];
      case "ac3":
        return ["-i", inputName, "-vn", "-acodec", "ac3", "-b:a", "384k", outputName];
      case "amr":
        return ["-i", inputName, "-vn", "-acodec", "amr_nb", "-ar", "8000", "-ac", "1", outputName];
      case "mp2":
        return ["-i", inputName, "-vn", "-acodec", "mp2", "-b:a", bitrate, outputName];
      default:
        return ["-i", inputName, "-vn", outputName];
    }
  }

  if (inCat === "video" && outputExt === "gif") {
    const vf = scaleFilter ? `fps=${gifFps},${scaleFilter}:flags=lanczos` : `fps=${gifFps},scale=480:-1:flags=lanczos`;
    return ["-i", inputName, "-vf", vf, "-t", "15", outputName];
  }

  if (inCat === "video" && ["jpg", "jpeg", "png", "webp", "bmp"].includes(outputExt)) {
    return ["-ss", "00:00:01", "-i", inputName, "-frames:v", "1", "-update", "1", outputName];
  }

  if (inCat === "video" || outCat === "video") {
    const crf = options?.crfQuality ? String(options.crfQuality) : "26";
    const vfArgs = scaleFilter ? ["-vf", scaleFilter] : [];

    switch (outputExt) {
      case "mp4":
      case "m4v":
      case "mov":
        return ["-i", inputName, ...vfArgs, "-c:v", "libx264", "-preset", "ultrafast", "-crf", crf, "-c:a", "aac", outputName];
      case "webm":
        return ["-i", inputName, ...vfArgs, "-c:v", "libvpx", "-crf", "28", "-b:v", "1M", "-c:a", "libvorbis", outputName];
      case "mkv":
        return ["-i", inputName, ...vfArgs, "-c:v", "libx264", "-preset", "ultrafast", "-crf", crf, "-c:a", "aac", outputName];
      case "avi":
        return ["-i", inputName, ...vfArgs, "-c:v", "mpeg4", "-q:v", "3", "-c:a", "libmp3lame", outputName];
      case "wmv":
        return ["-i", inputName, ...vfArgs, "-c:v", "wmv2", "-q:v", "3", "-c:a", "wmav2", outputName];
      case "flv":
        return ["-i", inputName, ...vfArgs, "-c:v", "flv", "-c:a", "libmp3lame", outputName];
      case "3gp":
        return ["-i", inputName, "-c:v", "h263", "-s", "352x288", "-r", "15", "-c:a", "amr_nb", "-ar", "8000", "-ac", "1", outputName];
      case "m2ts":
        return ["-i", inputName, ...vfArgs, "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "ac3", "-f", "mpegts", "-mpegts_m2ts_mode", "1", outputName];
      case "nut":
        return ["-i", inputName, ...vfArgs, "-c:v", "libx264", "-preset", "ultrafast", "-crf", crf, "-c:a", "aac", outputName];
      case "ts":
        return ["-i", inputName, ...vfArgs, "-c:v", "libx264", "-preset", "ultrafast", "-c:a", "aac", outputName];
      default:
        return ["-i", inputName, "-c:v", "libx264", "-preset", "ultrafast", outputName];
    }
  }

  if (inCat === "audio") {
    switch (outputExt) {
      case "mp3":
        return ["-i", inputName, "-acodec", "libmp3lame", "-b:a", bitrate, outputName];
      case "wav":
        return ["-i", inputName, "-acodec", "pcm_s16le", outputName];
      case "flac":
        return ["-i", inputName, "-acodec", "flac", outputName];
      case "ogg":
        return ["-i", inputName, "-acodec", "libvorbis", "-b:a", bitrate, outputName];
      case "aac":
      case "m4a":
      case "m4r":
        return ["-i", inputName, "-acodec", "aac", "-b:a", bitrate, outputName];
      case "opus":
        return ["-i", inputName, "-acodec", "libopus", "-b:a", bitrate, outputName];
      case "wma":
        return ["-i", inputName, "-acodec", "wmav2", "-b:a", bitrate, outputName];
      case "aiff":
        return ["-i", inputName, "-acodec", "pcm_s16be", outputName];
      case "ac3":
        return ["-i", inputName, "-acodec", "ac3", "-b:a", "384k", outputName];
      default:
        return ["-i", inputName, outputName];
    }
  }

  if (inCat === "image") {
    if (outputExt === "jp2") {
      return ["-i", inputName, "-frames:v", "1", "-c:v", "jpeg2000", "-pred", "1", "-update", "1", outputName];
    }
    if (outputExt === "ico") {
      return ["-i", inputName, "-vf", "scale=256:256", "-frames:v", "1", "-update", "1", outputName];
    }
    return ["-i", inputName, "-frames:v", "1", "-update", "1", outputName];
  }

  return ["-i", inputName, outputName];
}
