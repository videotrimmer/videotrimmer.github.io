# VideoTrimmer — 100% Client-Side Online Video Trimmer & Lossless Cutter

> **100% Client-Side Online Video Trimmer & Lossless Cutter — Cut `MP4`, `MOV`, `WebM`, `MKV` & `MP3` Instantly in Browser RAM with Zero Cloud Uploads.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-videotrimmer.github.io-3A5465?style=for-the-badge&logo=github)](https://videotrimmer.github.io/)
[![Astro](https://img.shields.io/badge/Astro-4.16_Static-64A97B?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![FFmpeg.wasm](https://img.shields.io/badge/FFmpeg.wasm-0.12_Core-D4ED9D?style=for-the-badge&labelColor=3D3931)](https://ffmpegwasm.netlify.app/)
[![MIT License](https://img.shields.io/badge/License-MIT-3A5465?style=for-the-badge)](./LICENSE)
[![Support the Developer](https://img.shields.io/badge/Support_the_Developer-Buy_Me_a_Coffee-64A97B?style=for-the-badge&logo=gumroad&logoColor=white)](https://kisharadilshan.gumroad.com/coffee)

---

**VideoTrimmer** ([https://videotrimmer.github.io/](https://videotrimmer.github.io/)) is a privacy-first, offline-capable web application engineered to trim, cut, mute, and extract audio from video files (`MP4`, `MOV`, `WebM`, `MKV`, `AVI`) and audio files (`MP3`, `WAV`, `M4A`, `OGG`, `FLAC`) directly inside the browser. Powered by WebAssembly (`@ffmpeg/core`), it performs instant lossless stream-copy slicing (`-c copy`) with automatic frame-accurate duration verification (`libx264 CRF 18`)—all in local browser RAM with **zero server uploads** and **no watermarks**.

---

## ✨ Key Features

- **Zero Cloud Uploads (100% Local RAM)**: Every byte stays on your device inside WebAssembly virtual memory (`MEMFS`). Private screen recordings and personal videos never leave the browser.
- **Instant Lossless Stream-Copy Cutting (`-c copy`)**: Slices `MP4`, `MOV`, `WebM`, and `MKV` clips in under a second without re-encoding or degrading video quality.
- **Smart Duration Verification & Frame-Accurate Precision (`libx264 -crf 18`)**: Automatically probes exported stream-copy output with `ffprobe` and refines cuts to exact frame boundaries when keyframe spacing would otherwise shift short clip durations—or select **Precision Cut** directly for millisecond cuts anywhere on the timeline.
- **5 Built-In Workflow Modes**:
  - **Trim Video**: Keep the exact range between start and end handles.
  - **Cut Video (Cut Out Middle Section)**: Remove an unwanted middle segment cleanly via stream-copy concat or filter-complex stitching.
  - **Trim iPhone / Android Video**: Handle mobile `MOV`/`MP4` clips directly in browser.
  - **Trim Audio / MP3**: Precision trim audio files with waveform timeline visualization.
  - **Extract MP3 Audio** + **Mute Audio (`-an`) Toggle**: Export clean MP3 audio (`libmp3lame`) or strip audio tracks from video exports.
- **Interactive Dual-Handle Visual Timeline**:
  - Live HTML5 `<video>` scrubbing with automatic 8-frame thumbnail filmstrip preview.
  - Snapped drag handles, range bar dragging, keyboard arrow nudging (`±0.1s` / `±1.0s` with `Shift`), `±0.1s` fine-tune buttons, and direct timecode input (`00:00.0` / `00:00:00.00`).
- **8-Language Internationalization (i18n)**: Localized static routes for English (`/`), Español (`/es/`), Português (`/pt/`), Deutsch (`/de/`), Français (`/fr/`), 日本語 (`/ja/`), 中文 (`/zh/`), and Русский (`/ru/`) with complete `hreflang` and Open Graph alternates.
- **Botanical Light & Dark UI**: Clean Botanical Sage, Soft Lime, and Deep Ocean Slate design system with a collapsible mobile/tablet navigation drawer and `48x48px` accessible touch targets.
- **Offline-Ready PWA**: Installable via **Add to Home Screen** (`public/manifest.webmanifest`) powered by a Service Worker (`public/sw.js`) that caches routes and FFmpeg WebAssembly assets locally.

---

## ⚙️ How Client-Side Processing Works

```text
User Selects Video (File API)
        │
        ▼
Lazy-Loads Classic Web Worker (/ffmpeg/ffmpeg-classic-worker.js)
  └─ Fallback: Main-Thread UMD Engine if Web Workers are restricted
        │
        ▼
Writes Media to Virtual MEMFS & Probes Streams (ffprobe)
        │
        ├──▶ Instant Lossless (-ss -i -t -c copy)
        │       └─ Probes clip duration; if keyframe snapping shifts length,
        │          automatically refines via fast libx264 CRF 18 pass
        │
        ├──▶ Frame-Accurate Precision (-c:v libx264 -crf 18 -preset veryfast)
        └──▶ Audio / MP3 Extraction (-c:a libmp3lame -q:a 2)
        │
        ▼
Returns Local Object URL (Blob) → Instant Preview & Download → Deletes MEMFS Temp Files
```

---

## 🛠️ Tech Stack

| Layer | Technology | Role & Implementation Details |
| :--- | :--- | :--- |
| **Framework** | **Astro 4.16 (Static Output)** | Zero-JS-by-default island architecture generating 8 static localized pages (`output: 'static'`). |
| **Styling & UI** | **Tailwind CSS + CSS Variables** | Responsive Botanical Sage, Lime & Deep Slate theme supporting Light and Dark modes. |
| **Video Engine** | **`@ffmpeg/core` v0.12 (WASM)** | Executed in a classic Web Worker (`/ffmpeg/ffmpeg-classic-worker.js`) with main-thread UMD fallback. |
| **PWA & Offline** | **Manifest + Service Worker (`sw.js`)** | Precaches localized pages and WASM assets for offline video trimming on installed devices. |
| **Technical SEO** | **JSON-LD (`@graph`) + Sitemaps** | `WebApplication`, `HowTo`, `FAQPage`, and `BreadcrumbList` structured data plus dual `sitemap.xml` and `sitemap-index.xml`. |
| **Deployment** | **GitHub Actions + GitHub Pages** | Automated CI/CD workflow (`.github/workflows/deploy.yml`) building on Node 22 via `withastro/action@v3`. |

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml                  # GitHub Pages CI/CD pipeline
├── public/
│   ├── ffmpeg/
│   │   ├── ffmpeg-classic-worker.js    # Classic Web Worker orchestrating WASM ffmpeg/ffprobe
│   │   ├── ffmpeg-core.umd.js          # Single-threaded UMD FFmpeg core wrapper
│   │   ├── ffmpeg-core.wasm            # FFmpeg WebAssembly binary
│   │   └── worker/                     # Auxiliary worker modules
│   ├── .nojekyll                       # Ensures GitHub Pages serves underscore/WASM assets
│   ├── manifest.webmanifest            # PWA installation manifest
│   ├── robots.txt                      # Search crawler rules & sitemap declarations
│   └── sw.js                           # Offline-first Service Worker
├── src/
│   ├── components/
│   │   ├── Header.astro                # Responsive navbar, theme toggle, language selector & Git link
│   │   ├── VideoTrimmerBox.astro       # Interactive timeline, presets & WASM trimming controller
│   │   ├── SeoContentSection.astro     # Localized how-to guides, comparison & FAQs
│   │   ├── JsonLdSchema.astro          # Structured JSON-LD metadata graph
│   │   └── Footer.astro                # Quick language links & repository link
│   ├── i18n/
│   │   └── ui.ts                       # Translations for en, es, pt, de, fr, ja, zh, ru
│   ├── layouts/
│   │   └── BaseLayout.astro            # Document head, SEO tags, analytics & theme boot script
│   ├── pages/
│   │   ├── index.astro                 # Root English route (/)
│   │   ├── [lang]/index.astro          # Dynamic localized routes (/es/, /pt/, ..., /ru/)
│   │   └── sitemap.xml.ts              # Direct XML sitemap generator for Search Console
│   └── styles/
│       └── global.css                  # Theme tokens, timeline handle & progress bar styles
├── astro.config.mjs                    # Astro, Tailwind, i18n, sitemap & COOP/COEP dev headers
├── tailwind.config.mjs                 # Tailwind theme & utility configuration
├── package.json
└── tsconfig.json
```

---

## 🎨 Color Palette Specification

| Token Name | Hex Code | Light Mode Usage | Dark Mode Usage |
| :--- | :--- | :--- | :--- |
| **Soft Botanical Lime** | `#D4ED9D` | Highlight Pills, Timeline Selection, Surface Accents | Primary Action Button, Secondary Text, Active Borders |
| **Emerald Sage Green** | `#64A97B` | Borders, Hover States, Support CTA | Borders, Hover States, Active Selection Outline |
| **Deep Ocean Slate** | `#3A5465` | Primary Action Buttons, Handles, Secondary Text | Secondary Accent Surface, Button Hover |
| **Warm Espresso Charcoal** | `#3D3931` | Primary Typography & Headings | Surface Cards, Badge Text, Primary Button Text |
| **Clean Mint Alabaster** | `#F7FBF2` | Default Page Background | Primary Typography & Headings |
| **Pure Canvas White** | `#FFFFFF` | Interactive Trimmer Box Surface | High-Contrast Text & Icons |

---

## 🚀 Local Development & Deployment

### Prerequisites

- **Node.js** `>= 18` (`Node 22` is used in CI)
- **npm**

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/videotrimmer/videotrimmer.github.io.git
cd videotrimmer.github.io
npm install
```

### 2. Start Local Development Server

```bash
npm run dev
```

Visit `http://localhost:4321/` to develop locally. Dev server headers include `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`. Service Workers are automatically bypassed on `localhost` so local code edits reload immediately.

### 3. Build & Preview Production Bundle

```bash
npm run build
npm run preview
```

`npm run build` generates the complete static site inside `dist/`, including all 8 localized routes (`/`, `/es/`, `/pt/`, `/de/`, `/fr/`, `/ja/`, `/zh/`, `/ru/`), `dist/sitemap.xml`, `dist/sitemap-index.xml`, `dist/manifest.webmanifest`, `dist/sw.js`, and `dist/ffmpeg/`.

### 4. Automated GitHub Pages Deployment

Deployment is handled automatically by [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml):
1. Triggered on every push to `main` (or manual `workflow_dispatch`).
2. Ensures `public/.nojekyll` is present and runs `npm run build` on Node 22 via `withastro/action@v3`.
3. Deploys the `dist/` artifact directly to the `github-pages` environment via `actions/deploy-pages@v4`.

---

## ☕ Support the Developer

If **VideoTrimmer** saves you time and keeps your videos private, consider supporting ongoing open-source maintenance:

👉 **[Support the Developer on Gumroad (Buy Me a Coffee)](https://kisharadilshan.gumroad.com/coffee)**

---

## 📄 License

Licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for full details.  
Copyright © 2026 **Kishara Dilshan (VideoTrimmer)**.
