# FileConverter

Client-side file conversion web application. Converts video, audio, image, and document files directly inside the browser using WebAssembly.

**[Open the live preview](https://nerdblud.github.io/FileConverter/)** to convert a file in your browser.

## Features

- In-Browser Processing: All operations run locally inside the browser. No files are uploaded to any server.
- Web Worker Isolation: Media conversions run on a dedicated Web Worker to prevent UI blocking.
- Output formats include:
  - Video: MP4, WebM, MKV, AVI, MOV, WMV, FLV, 3GP, TS, M2TS, NUT, OGV, MPG
  - Audio: MP3, WAV, AAC, FLAC, OGG, M4A, Opus, WMA, AIFF, AC3, AMR, M4R, MP2, CAF, AU, MKA
  - Image: PNG, JPG, JPEG, WebP, BMP, TIFF, ICO, TGA, PPM, PGM, PBM, PCX, XPM, QOI, PAM, DPX, JP2
  - Animation: GIF, APNG
  - Document: PDF merging and image-to-PDF compilation
- Advanced Options: Customizable audio bitrate, video resolution scaling, and GIF frame rate.
- Console Overlay: Real-time FFmpeg process logs, progress tracking, and elapsed timer.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- FFmpeg.wasm v0.12+
- pdf-lib
- Lucide Icons

## Getting Started

### Prerequisites

Node.js (version 18 or higher) and npm installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nerdblud/FileConverter.git
cd FileConverter
```

2. Install dependencies:
```bash
npm install
```

3. Start the local development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```text
http://localhost:5173
```

## Production Build

To build the project for production:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
FileConverter/
├── src/
│   ├── components/
│   │   ├── ConversionPanel.tsx
│   │   ├── Dropzone.tsx
│   │   ├── FormatPicker.tsx
│   │   ├── TerminalOverlay.tsx
│   │   └── ui/
│   ├── hooks/
│   │   └── useConverter.ts
│   ├── lib/
│   │   ├── conversions.ts
│   │   ├── pdf-utils.ts
│   │   └── utils.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── worker.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── LICENSE
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
