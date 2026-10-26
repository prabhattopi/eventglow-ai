import { SkinAnalysisResult, WardrobeItem } from '../../types/index.js';

export const mockSkinAnalysisResult: SkinAnalysisResult = {
  task_id: 'mock_task_youcam_skin_884920',
  source: 'youcam_mock_engine',
  timestamp: new Date().toISOString(),
  metrics: {
    skin_age: 27,
    overall_score: 79,
    undertone: 'warm',
    tone_name: 'Natural Golden Warm (Type III)',
    wrinkles: {
      score: 83,
      severity: 'low',
      description: 'Minor micro-expression lines; good structural dermal elasticity.'
    },
    pores: {
      score: 66,
      severity: 'moderate',
      description: 'Localized enlarged pores detected across nasal bridge and central forehead.'
    },
    texture: {
      score: 81,
      severity: 'low',
      description: 'Smooth stratum corneum with balanced epidermal barrier resilience.'
    },
    acne: {
      score: 84,
      severity: 'low',
      description: 'Minimal active comedones; calm follicular canvas.'
    },
    dark_circles: {
      score: 72,
      severity: 'low',
      description: 'Mild vascular under-eye shadows responsive to caffeine and lymphatic de-puffing.'
    },
    redness: {
      score: 92,
      severity: 'optimal',
      description: 'Optimal low erythema. Healthy capillary stability.'
    },
    oiliness: {
      score: 78,
      severity: 'low',
      description: 'Balanced sebaceous output; slightly elevated T-zone sheen under stage lighting.'
    },
    moisture: {
      score: 70,
      severity: 'low',
      description: 'Sub-surface hydration optimal for a 14-day progressive glass-skin turn.'
    },
    radiance: {
      score: 79,
      severity: 'low',
      description: 'Strong natural luminescence capable of peak camera-ready finish.'
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
  // MEN'S LUXURY COUTURE
  {
    id: 'm-wedding-01',
    name: 'Ivory Champagne Royal Wedding Peak Suit',
    category: 'traditional',
    gender: 'men',
    events: ['wedding'],
    color: 'Ivory & Warm Champagne',
    hex: '#e6ca65',
    fabric: 'Breathable Cupro-Modal & Silk Jacquard Peak Weave',
    fabric_sensitivity_note: 'Thermo-regulating natural weave prevents sweat-induced forehead oiliness during daytime wedding ceremonies.',
    harmony_score: 98,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-wedding-02',
    name: 'Midnight Obsidian Royal Groom Peak Tuxedo',
    category: 'formal',
    gender: 'men',
    events: ['wedding', 'gala'],
    color: 'Midnight Obsidian Noir',
    hex: '#0d1117',
    fabric: 'Super 150s Pure Wool & Mulberry Silk-Satin Lapels',
    fabric_sensitivity_note: 'Hypoallergenic silk collar lining safeguards against neck erythema under intense camera flash.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-wedding-03',
    name: 'Emerald Velvet Imperial Achkan Bandhgala',
    category: 'traditional',
    gender: 'men',
    events: ['wedding', 'datenight'],
    color: 'Imperial Emerald Forest',
    hex: '#0a3622',
    fabric: 'Italian Micro-Velvet with Mulberry Silk Lining',
    fabric_sensitivity_note: 'Zero-friction inner silk eliminates contact redness on freshly shaved jawlines during receptions.',
    harmony_score: 94,
    image_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-gala-01',
    name: 'Midnight Obsidian Peak-Lapel Gala Tuxedo',
    category: 'formal',
    gender: 'men',
    events: ['gala'],
    color: 'Midnight Obsidian Noir',
    hex: '#0f172a',
    fabric: 'Super 150s Pure Merino Wool & Italian Duchesse Satin',
    fabric_sensitivity_note: 'Pure silk lapels protect against collar erythema under intense red carpet strobes.',
    harmony_score: 97,
    image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-gala-02',
    name: 'Deep Burgundy Velvet Red Carpet Tuxedo',
    category: 'cocktail',
    gender: 'men',
    events: ['gala', 'datenight'],
    color: 'Deep Burgundy Wine',
    hex: '#5c1020',
    fabric: 'Italian Silk Velvet with Grosgrain Trim',
    fabric_sensitivity_note: 'Ultra-soft low-shear drape prevents friction-induced redness on sensitive neck skin.',
    harmony_score: 93,
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-keynote-01',
    name: 'Slate Charcoal Minimalist Keynote Blazer',
    category: 'executive',
    gender: 'men',
    events: ['keynote'],
    color: 'Slate Charcoal Matte',
    hex: '#2b2d42',
    fabric: 'Micro-Modal Stretch Wool Blend with Anti-Wrinkle Finish',
    fabric_sensitivity_note: 'Anti-static breathable lining keeps skin matte and calm under intense stage lighting.',
    harmony_score: 95,
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-keynote-02',
    name: 'Midnight Sapphire Summit Executive Suit',
    category: 'executive',
    gender: 'men',
    events: ['keynote', 'interview'],
    color: 'Deep Royal Navy Sapphire',
    hex: '#0b1d3a',
    fabric: 'Super 130s Merino Lightweight Wool with Silk Lining',
    fabric_sensitivity_note: 'Breathable lightweight weave prevents forehead sweat under 4K camera rigs.',
    harmony_score: 92,
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-interview-01',
    name: 'Midnight Sapphire Boardroom Power Suit',
    category: 'executive',
    gender: 'men',
    events: ['interview'],
    color: 'Executive Navy Blue',
    hex: '#1e293b',
    fabric: 'High-Twist Worsted Wool with Bemberg Cupro Lining',
    fabric_sensitivity_note: 'Thermo-regulating Cupro lining ensures zero stress-sweat breakthrough across collar.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm-datenight-01',
    name: 'Cashmere-Silk Knit & Noir Dinner Jacket',
    category: 'cocktail',
    gender: 'men',
    events: ['datenight'],
    color: 'Obsidian Noir & Warm Charcoal',
    hex: '#18181b',
    fabric: 'Pure Mongolian Cashmere & Mulberry Silk Weave',
    fabric_sensitivity_note: 'Sensory-soft tactile finish safeguards against contact redness during intimate dining.',
    harmony_score: 94,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
  },

  // WOMEN'S LUXURY COUTURE
  {
    id: 'w-wedding-01',
    name: 'Ivory Pearl Royal Wedding Bridal Gown',
    category: 'traditional',
    gender: 'women',
    events: ['wedding'],
    color: 'Ivory & Pure Pearl',
    hex: '#f8fafc',
    fabric: 'Mulberry Silk Crepe with French Chantilly Lace',
    fabric_sensitivity_note: 'Breathable natural silk preserves hydration and prevents makeup breakdown during long ceremonies.',
    harmony_score: 99,
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-wedding-02',
    name: 'Champagne Gold Silk Zari Brocade Gown',
    category: 'traditional',
    gender: 'women',
    events: ['wedding', 'gala'],
    color: 'Champagne Gold & Warm Amber',
    hex: '#e6ca65',
    fabric: 'Pure Mulberry Silk with Metallic Micro-Zari Weave',
    fabric_sensitivity_note: 'Skin-side 100% silk lining shields décolletage from metallic thread abrasion.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-wedding-03',
    name: 'Rose Dawn Silk Draped Bridal Veil Gown',
    category: 'traditional',
    gender: 'women',
    events: ['wedding', 'datenight'],
    color: 'Soft Blush Rose Dawn',
    hex: '#fbcfe8',
    fabric: '100% Lightweight Silk Chiffon with Satin Bodice',
    fabric_sensitivity_note: 'Ultra-lightweight drape prevents barrier friction across collarbones and shoulders.',
    harmony_score: 94,
    image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-gala-01',
    name: 'Emerald Noir Silk-Velvet Gala Gown',
    category: 'evening',
    gender: 'women',
    events: ['gala'],
    color: 'Emerald & Deep Forest',
    hex: '#0d4734',
    fabric: '100% Pure Mulberry Silk & Micro-Velvet',
    fabric_sensitivity_note: 'Hypoallergenic natural silk barrier; zero friction against jawline acne or sensitive neck skin.',
    harmony_score: 97,
    image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-gala-02',
    name: 'Burgundy Crimson Draped Red Carpet Dress',
    category: 'cocktail',
    gender: 'women',
    events: ['gala', 'datenight'],
    color: 'Deep Burgundy Wine',
    hex: '#5c1020',
    fabric: 'Italian Mercerized Viscose Blend',
    fabric_sensitivity_note: 'Ultra-soft low-shear drape, prevents collar erythema on high-flush skin.',
    harmony_score: 93,
    image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-keynote-01',
    name: 'Champagne Gold Structured Blazer & Slip',
    category: 'formal',
    gender: 'women',
    events: ['keynote', 'interview'],
    color: 'Luxe Champagne Gold',
    hex: '#e6ca65',
    fabric: 'Breathable Cupro-Modal Weave with Satin Lapels',
    fabric_sensitivity_note: 'Non-comedogenic, thermo-regulating weave prevents sweat-induced forehead oiliness under hot spotlights.',
    harmony_score: 95,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-interview-01',
    name: 'Tailored Slate Houndstooth Executive Blazer',
    category: 'executive',
    gender: 'women',
    events: ['interview'],
    color: 'Chalk Slate & Black',
    hex: '#334155',
    fabric: 'Pure Fine Merino Wool with Anti-Crease Silk Weave',
    fabric_sensitivity_note: 'Calm, zero-itch natural weave prevents neck scratching or nervous erythema during boardroom panels.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'w-datenight-01',
    name: 'Burgundy Crimson Draped Silk Slip Dress',
    category: 'cocktail',
    gender: 'women',
    events: ['datenight'],
    color: 'Deep Burgundy Wine',
    hex: '#7f1d1d',
    fabric: '100% Sandwashed Mulberry Silk Crepe',
    fabric_sensitivity_note: 'Fluid liquid drape reduces mechanical friction on décolletage to absolute zero.',
    harmony_score: 96,
    image_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    try_on_result_url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'
  }
];

export const samplePreloadModels = [
  {
    id: 'model-alex',
    name: 'Alex C.',
    gender: 'men' as const,
    image_url: '/test-samples/alex.jpg',
    glow_image_url: '/test-samples/alex-glow.jpg',
    event: 'wedding' as const,
    days: 14,
    description: 'Real Man Close-Up Portrait (YouCam AI Verified). Groom / Lead Speaker.'
  },
  {
    id: 'model-marcus',
    name: 'Marcus T.',
    gender: 'men' as const,
    image_url: '/test-samples/marcus.jpg',
    glow_image_url: '/test-samples/marcus-glow.jpg',
    event: 'wedding' as const,
    days: 14,
    description: 'Real Man Close-Up Portrait (YouCam AI Verified). Royal Wedding & Black-Tie.'
  },
  {
    id: 'model-maya',
    name: 'Maya V.',
    gender: 'women' as const,
    image_url: '/test-samples/maya.jpg',
    glow_image_url: '/test-samples/maya-glow.jpg',
    event: 'wedding' as const,
    days: 14,
    description: 'Real Woman Close-Up Portrait (YouCam AI Verified). Bride / Gala Lead.'
  }
];
