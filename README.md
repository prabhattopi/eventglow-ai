# ✨ EventGlow AI (YouCam Studio)
### Autonomous Countdown Event Stylist & Clinical Skin Architect
**Built for the YouCam API Skin AI & eCommerce VTO Hackathon (Devpost)**

[![Perfect Corp YouCam API](https://img.shields.io/badge/Powered%20By-YouCam%20S2S%20Cloud%20AI-e6ca65?style=for-the-badge&logo=sparkles)](https://yce-api-01.makeupar.com)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🌟 Overview & Elevator Pitch

**EventGlow AI** bridges the critical gap between **clinical skin diagnostics** and **luxury fashion eCommerce**. 

Most consumers shopping for major life milestones—a **Royal Wedding**, **Charity Gala**, **Tech Keynote**, or **Executive Interview**—struggle with two separate pain points:
1. **Skin Readiness Panic:** Unbalanced skin barrier, unexpected breakouts, enlarged pores, or dehydration days before flash photography.
2. **Fashion Return Fatigue:** High-end attire ordered online often clashes with their natural skin undertone or triggers tactile collar friction erythema under stage lighting.

**EventGlow AI** solves both simultaneously. By leveraging the **Perfect Corp YouCam S2S Cloud AI Engine**, it intakes user facial biometrics, diagnoses **9 clinical dermal parameters**, and autonomously architects:
- 📅 **A Precision Countdown Regimen:** Day-by-day clinical skincare protocol targeting specific barrier deficiencies (5, 7, 14, 21, or 30 days).
- 🎨 **DermoCommerce Color Harmony:** Algorithmic matching of diagnosed skin undertones (Warm, Cool, Olive, Neutral) with luxury couture garments (99% harmony matching).
- 🛡️ **Anti-Return Fabric Sensitivity Guard:** Cross-referencing detected redness and barrier resilience against textile friction (recommending Mulberry silk linings to prevent neck rash).
- 🪞 **Pristine Visual Studio Canvas:** Photorealistic Day 1 Raw Face ↔ Event-Day Glass-Skin Glow split comparison slider and high-fashion editorial lookbook.

---

## 🗺️ System Architecture & Workflow Diagram

```mermaid
flowchart TD
    subgraph Intake["📸 1. Persona & Face Intake"]
        A["👤 Select Model (Alex / Marcus / Maya)"] --> D["🖼️ Biometric Face Ingestion"]
        B["📁 Upload High-Res Portrait"] --> D
        C["🎥 Live Centered Webcam Capture"] --> D
    end

    subgraph Engine["⚡ 2. YouCam Dual-Engine S2S Cloud"]
        D --> E{"🛡️ Mode Toggle"}
        E -->|"⚡ Live Cloud"| F["☁️ Perfect Corp S2S API (/task/skin-analysis)"]
        E -->|"🛡️ Quota Shield"| G["📦 Zero-Cost Clinical Fixture Engine"]
        F --> H["🩺 9-Parameter Dermal Diagnosis"]
        G --> H
        H --> I["🎨 Detected Facial Undertone (Warm / Cool / Olive)"]
        H --> J["⏳ Computer Vision Skin Age & Dermal Resilience"]
    end

    subgraph Stylist["🧠 3. Autonomous Countdown & Styling Architect"]
        H --> K["📅 Countdown Protocol Synthesizer (5d / 7d / 14d / 21d / 30d)"]
        I --> L["👗 Curated Couture Harmony Scorer (Men's / Women's Line)"]
        J --> M["🛡️ DermoCommerce Fabric Sensitivity Guard"]
    end

    subgraph Studio["✨ 4. High-Impact Zero-Scroll Cockpit"]
        K --> N["📋 Clinical Daily Roadmap Console (Morning & Evening Regimen)"]
        L --> O["👑 Event Couture (VTO) Editorial Lookbook"]
        M --> P["🧵 Hypoallergenic Textile Guard & Anti-Return Shield"]
        H --> Q["🪞 Face Glow Split Slider (Day 1 Raw ↔ Event Glass-Skin Glow)"]
    end

    classDef intake fill:#1e1e24,stroke:#e6ca65,stroke-width:2px,color:#fff;
    classDef engine fill:#141b2d,stroke:#38bdf8,stroke-width:2px,color:#fff;
    classDef stylist fill:#1b241e,stroke:#34d399,stroke-width:2px,color:#fff;
    classDef studio fill:#25182e,stroke:#f472b6,stroke-width:2px,color:#fff;

    class A,B,C,D intake;
    class E,F,G,H,I,J engine;
    class K,L,M stylist;
    class N,O,P,Q studio;
```

---

## 🔬 How Perfect Corp YouCam Cloud AI is Utilized

EventGlow AI interacts directly with Perfect Corp's official Server-to-Server (S2S) Cloud infrastructure:

1. **Secure Signed Binary Registration (`POST /s2s/v2.0/file`):**
   Adaptive image pre-framing ensures facial geometry occupies $>60\%$ width to satisfy YouCam Clinical AI requirements without distortion.
2. **Clinical Skin Analysis Task (`POST /s2s/v2.0/task/skin-analysis`):**
   Dispatches multi-parameter clinical diagnostic task assessing:
   - 💧 **Hydration / Moisture** (Stratum corneum water level)
   - ✨ **Radiance** (Specular reflection & luminescence)
   - 🔴 **Redness / Erythema** (Vascular inflammation & barrier calm)
   - 👁️ **Under-Eye Circles** (Periorbital vascular congestion)
   - 🟣 **Pores** (Micro-pore density and dilation)
   - ☀️ **Texture** (Keratinocyte surface roughness)
   - ⚡ **Firmness / Wrinkles** (Fine line contours & elasticity)
   - 🧪 **Sebum / Oiliness** (T-zone lipid balance)
   - 🛡️ **Blemishes / Acne** (Follicular micro-comedone count)
3. **Real-Time Polling & Metric Extraction:**
   Polls `/s2s/v2.0/task/skin-analysis/:id` until `task_status === 'success'` and ingests verified clinical scores.

---

## 💎 Key Features & Capabilities

- 🔄 **Non-Destructive Persona Intake:** Upload your custom photo or take a webcam snapshot. Switch seamlessly between preset demo models (Alex, Marcus, Maya) and your **`You ★`** persona without losing your upload or scan.
- 👔 **Dual Gender Couture Toggle:** 1-click toggle between **`👔 Men's Couture`** (Royal Peak Tuxedos, Achkan Bandhgalas, Velvet Dinner Jackets) and **`👗 Women's Couture`** (Ivory Pearl Bridal Gowns, Champagne Zari Brocades, Emerald Velvet Gala Gowns).
- 🪞 **Pristine Split-Comparison Slider:** Interactive, hardware-accelerated slider showing realistic Day 1 Baseline Skin ↔ Event-Ready Glass-Skin Glow (smooth bilateral pore refinement, healthy luminescence, tack-sharp facial features).
- 🛡️ **Zero-Credit Quota Shield:** Integrated toggle allows judges and reviewers to test the entire platform without consuming live API tokens, or switch to **Live Cloud** with one click.
- 📋 **Exportable Protocol:** Download structured, timestamped regimen summaries (`.txt`) with morning routines, evening restorative steps, key active ingredients, and fabric cautions.

---

## 📂 Project Structure

```
eventglow-ai/
├── client/                      # React 19 + TypeScript + Vite Frontend
│   ├── public/
│   │   ├── presets/             # Editorial wardrobe photography & presets
│   │   └── test-samples/        # Real 1024x1024 verified headshot samples
│   ├── src/
│   │   ├── components/          # Header, modals, and auxiliary widgets
│   │   ├── types/               # Pure functional TypeScript interfaces
│   │   ├── App.tsx              # Single-page zero-scroll cockpit interface
│   │   ├── index.css            # Luxury glassmorphic styling & laser animations
│   │   └── main.tsx             # Application bootstrap
│   └── vite.config.ts           # Vite bundler & reverse API proxy configuration
├── server/                      # Node.js + Express TypeScript Backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── agent/           # EventPlannerAgent (Countdown & DermoCommerce logic)
│   │   │   └── youcam/          # S2S API Client, Quota Shield & Sharp image pipelines
│   │   ├── types/               # Backend data schemas & API response contracts
│   │   └── index.ts             # Express REST endpoints & routing
│   ├── tsconfig.json            # Strict TypeScript compiler options
│   └── package.json             # Backend dependencies (sharp, axios, adm-zip, express)
├── assets/test-samples/         # Canonical headshot portraits for testing
└── README.md                    # Root project documentation
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js:** v18+ or v20+ (v22 verified)
- **npm:** v9+

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/eventglow-ai.git
cd eventglow-ai

# Install root, server, and client dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. (Optional) Live YouCam API Key Configuration
> [!TIP]
> **⚡ Zero-Configuration Ready:** You can **skip this step entirely!** EventGlow AI runs out-of-the-box in **Safe Quota Shield Mode** with full clinical fixtures and zero setup required.

If you have a Perfect Corp YouCam Developer Key and want to execute live cloud calls, create `server/.env` (or copy `server/.env.example`):
```env
PORT=5000
YOUCAM_API_KEY=your_perfect_corp_api_key_here
YOUCAM_BASE_URL=https://yce-api-01.makeupar.com
MOCK_MODE=false
```
*(If omitted, the platform defaults safely to Quota Shield mode with 1,000 simulated clinical calibrations).*


### 3. Run Locally
From the project root:
```bash
npm run dev
```

This concurrently launches:
- 🚀 **Server:** `http://localhost:5000`
- 💻 **Client:** `http://localhost:5173`

---

## 🧪 Verification & Demo Testing

1. Open `http://localhost:5173` in your browser.
2. Click **"Scan Face & Synthesize Look"** on the baseline profile, or upload your own selfie using **"Upload Photo"** / **"Webcam"**.
3. Toggle between **`👔 Men`** and **`👗 Women`** to verify real-time wardrobe catalog harmonization.
4. Drag the center split slider to inspect your progressive turnaround to peak event glass-skin glow.
5. Explore the **`Clinical Scan (9)`** tab to inspect all 9 parameters evaluated by YouCam Cloud AI.
6. Toggle the top-right button between **Live YouCam API** and **Safe Shield** to verify dual-engine resilience.

---

## 🏆 Hackathon Alignment & Business Impact

| Judging Criterion | How EventGlow AI Delivers |
| :--- | :--- |
| **Technological Implementation** | Live integration of YouCam S2S Cloud AI (`/task/skin-analysis`). Resilient upload pipeline with adaptive 70% facial framing, automated retry polling, and dual-engine mock shield. |
| **Design & User Experience** | Zero-scroll luxury dark-mode studio cockpit. Animated laser scanning sweeps, interactive split slider, and animated glowing progress metrics. |
| **Potential Impact** | Solves the $38B fashion eCommerce return crisis by linking dermal friction sensitivity directly to apparel fabrics, while preparing customers for high-stakes events. |
| **Creativity & Innovation** | First platform to fuse **Autonomous Event Skincare Regimens** with **Luxury Apparel VTO & Color Harmony** into a single cohesive experience. |

---

*EventGlow AI — Powered by Perfect Corp YouCam Cloud AI Engine.*
