import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { getEngineStatus, setMockMode, analyzeSkin, executeVTO } from './services/youcam/youcamService.js';
import { generateEventPlan } from './services/agent/eventPlannerAgent.js';
import { samplePreloadModels, mockWardrobeCatalog, mockSkinAnalysisResult } from './services/youcam/mockFixtures.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// 1. Healthcheck
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EventGlow AI Engine (Functional TypeScript)',
    youcam_status: getEngineStatus()
  });
});

// 2. Engine Mode (Safe Mock vs Live YouCam API)
app.get('/api/mode', (_req, res) => {
  res.json(getEngineStatus());
});

app.post('/api/mode/toggle', (req, res) => {
  const { mock_mode } = req.body;
  const updatedStatus = setMockMode(Boolean(mock_mode));
  res.json({
    success: true,
    message: updatedStatus.mock_mode
      ? 'Quota Shield Active: Offline Fixture Engine engaged (0 API credits burned).'
      : 'Live API Mode Active: Sending real requests to Perfect Corp YouCam Cloud.',
    status: updatedStatus
  });
});

// 3. Presets & Wardrobe Catalog
app.get('/api/presets', (_req, res) => {
  res.json({
    models: samplePreloadModels,
    wardrobe: mockWardrobeCatalog
  });
});

// 4. Skin Analysis (YouCam AI / Dual-Engine)
app.post('/api/skin/analyze', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const { image_url, model_id } = req.body;

    let result = null;

    if (file) {
      result = await analyzeSkin(file.buffer);
    } else if (image_url) {
      result = await analyzeSkin(undefined, image_url);
    } else if (model_id) {
      const preset = samplePreloadModels.find((m) => m.id === model_id);
      result = await analyzeSkin(undefined, preset?.image_url);
    } else {
      result = await analyzeSkin();
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Skin analysis failed'
    });
  }
});

// 5. Apparel Virtual Try-On (YouCam VTO / Lookbook Engine)
app.post('/api/vto/try-on', async (req, res) => {
  try {
    const { garment_id } = req.body;
    const result = await executeVTO(garment_id);
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Apparel Virtual Try-On failed'
    });
  }
});


// 6. Generate Countdown Event Plan (Pure Functional Agent)
app.post('/api/plan/generate', (req, res) => {
  try {
    const { event_type, days_remaining, metrics, preferred_wardrobe_id, gender } = req.body;

    const skinMetrics = metrics || mockSkinAnalysisResult.metrics;
    const days = Number(days_remaining) || 14;
    const type = event_type || 'wedding';

    const plan = generateEventPlan({
      eventType: type,
      daysRemaining: days,
      metrics: skinMetrics,
      preferredWardrobeId: preferred_wardrobe_id,
      gender: gender as any
    });

    res.json({
      success: true,
      data: plan
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to synthesize countdown plan'
    });
  }
});

app.listen(port, () => {
  console.log(`[EventGlow Server] Running on http://localhost:${port}`);
  console.log(`[EventGlow Server] Initial Mode: ${getEngineStatus().mock_mode ? 'MOCK / SAFE QUOTA SHIELD' : 'LIVE API'}`);
});
