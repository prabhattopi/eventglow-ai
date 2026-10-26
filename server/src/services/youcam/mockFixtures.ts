import { SkinAnalysisResult, WardrobeItem } from '../../types/index.js';

export const mockSkinAnalysisResult: SkinAnalysisResult = {
  task_id: 'mock_task_youcam_skin_884920',
  source: 'youcam_mock_engine',
  timestamp: new Date().toISOString(),
  metrics: {
    skin_age: 26,
    overall_score: 76,
    undertone: 'olive',
    tone_name: 'Warm Olive (Type III/IV)',
    wrinkles: {
      score: 82,
      severity: 'low',
      description: 'Minor fine lines detected around the periorbital eye region.'
    },
    pores: {
      score: 68,
      severity: 'moderate',
      description: 'Enlarged pores identified predominantly along the T-zone and central cheek.'
    },
    texture: {
      score: 74,
      severity: 'moderate',
      description: 'Subtle micro-unevenness on forehead; smooth perimeter.'
    },
    acne: {
      score: 79,
      severity: 'low',
      description: 'Two localized non-inflammatory spots detected along lower jawline.'
    },
    dark_circles: {
      score: 64,
      severity: 'moderate',
      description: 'Vascular bluish-purple under-eye hollows requiring targeted caffeine / peptide care.'
    },
    redness: {
      score: 71,
      severity: 'moderate',
      description: 'Mild erythema observed across nasal wings and inner cheeks.'
    },
    oiliness: {
      score: 62,
      severity: 'moderate',
      description: 'Elevated sebum output on forehead and chin, dehydrated mid-face.'
    },
    moisture: {
      score: 65,
      severity: 'moderate',
      description: 'Sub-surface hydration index below optimal event-glow threshold.'
    },
    radiance: {
      score: 70,
      severity: 'moderate',
      description: 'Natural luminescence present, capable of reaching high-clarity glass-skin within 14 days.'
    }
  },
  overlay_masks: {
    wrinkles: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="200" r="180" fill="none" stroke="%23f59e0b" stroke-width="2" stroke-dasharray="4"/></svg>',
    pores: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="200" cy="190" r="40" fill="rgba(239,68,68,0.15)" stroke="%23ef4444" stroke-width="1.5"/></svg>',
    spots: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><circle cx="160" cy="250" r="8" fill="%23dc2626"/></svg>',
    redness: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><ellipse cx="200" cy="210" rx="60" ry="25" fill="rgba(244,63,94,0.18)"/></svg>'
  },
  summary: 'Analysis completed via YouCam AI Engine: Skin exhibits strong baseline elasticity with moderate T-zone congestion and under-eye dehydration. Perfectly primed for a 14-day progressive event glow turnaround.'
};

export const mockWardrobeCatalog: WardrobeItem[] = [
  {
    id: 'w-01',
    name: 'Emerald Noir Silk-Velvet Gala Gown',
    category: 'evening',
    color: 'Emerald & Deep Forest',
    hex: '#0d4734',
    fabric: '100% Pure Mulberry Silk & Micro-Velvet',
    fabric_sensitivity_note: 'Hypoallergenic natural silk barrier; zero friction against jawline acne or sensitive neck skin.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w-02',
    name: 'Champagne Gold Structured Blazer & Slip',
    category: 'formal',
    color: 'Luxe Champagne Gold',
    hex: '#e6ca65',
    fabric: 'Breathable Cupro-Modal Weave with Satin Lapels',
    fabric_sensitivity_note: 'Non-comedogenic, thermo-regulating weave prevents sweat-induced forehead oiliness.',
    harmony_score: 93,
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w-03',
    name: 'Burgundy Crimson Draped Red Carpet Tux/Dress',
    category: 'cocktail',
    color: 'Deep Burgundy Wine',
    hex: '#5c1020',
    fabric: 'Italian Mercerized Viscose Blend',
    fabric_sensitivity_note: 'Ultra-soft low-shear drape, prevents collar erythema on high-flush skin.',
    harmony_score: 89,
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'w-04',
    name: 'Midnight Sapphire Tailored Ensemble',
    category: 'executive',
    color: 'Deep Royal Navy Sapphire',
    hex: '#0b1d3a',
    fabric: 'Super 130s Merino Lightweight Wool with Silk Lining',
    fabric_sensitivity_note: 'Pure silk inner lining safeguards against direct wool prickle on sensitized skin.',
    harmony_score: 91,
    image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  }
];

export const samplePreloadModels = [
  {
    id: 'model-alex',
    name: 'Alex C. (Tech Keynote & Executive Summit)',
    image_url: '/test-samples/youcam-verified-man.jpg',
    event: 'keynote',
    days: 7,
    description: 'Real Man Close-Up Portrait (YouCam Verified). Series A Keynote Lead.'
  },
  {
    id: 'model-marcus',
    name: 'Marcus T. (Royal Wedding & Black-Tie)',
    image_url: '/test-samples/real-man-portrait-2.jpg',
    event: 'wedding',
    days: 14,
    description: 'Real Man Close-Up Portrait (YouCam Verified). High-definition event styling.'
  },
  {
    id: 'model-maya',
    name: 'Maya V. (Wedding / Gala Lead)',
    image_url: '/test-samples/real-woman-portrait-1.jpg',
    event: 'wedding',
    days: 14,
    description: 'Real Woman Close-Up Portrait (YouCam Verified). Glass-skin & couture try-on.'
  }
];
