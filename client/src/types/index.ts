export interface SkinMetricDetail {
  score: number;
  severity: 'low' | 'moderate' | 'high' | 'optimal';
  description: string;
}

export interface SkinMetrics {
  skin_age: number;
  overall_score: number;
  undertone: 'cool' | 'warm' | 'neutral' | 'olive';
  tone_name: string;
  wrinkles: SkinMetricDetail;
  pores: SkinMetricDetail;
  texture: SkinMetricDetail;
  acne: SkinMetricDetail;
  dark_circles: SkinMetricDetail;
  redness: SkinMetricDetail;
  oiliness: SkinMetricDetail;
  moisture: SkinMetricDetail;
  radiance: SkinMetricDetail;
}

export interface SkinAnalysisResult {
  task_id: string;
  source: 'youcam_live' | 'youcam_mock_engine';
  timestamp: string;
  metrics: SkinMetrics;
  overlay_masks?: Record<string, string>;
  transformed_glow_url?: string;
  summary: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: 'formal' | 'evening' | 'cocktail' | 'executive' | 'traditional';
  gender?: 'men' | 'women' | 'all';
  events?: ('wedding' | 'gala' | 'keynote' | 'interview' | 'datenight')[];
  color: string;
  hex: string;
  fabric: string;
  fabric_sensitivity_note: string;
  harmony_score: number;
  image_url: string;
  try_on_result_url: string;
}

export interface MilestoneDay {
  day_number: number;
  title: string;
  focus: 'detox' | 'hydration' | 'barrier_repair' | 'brightening' | 'event_ready';
  skin_status_projected: string;
  morning_routine: string[];
  evening_routine: string[];
  key_ingredients: string[];
  warning_notes?: string;
  vto_fitting_checkpoint?: string;
}

export interface EventPlan {
  event_id: string;
  event_type: 'wedding' | 'gala' | 'interview' | 'keynote' | 'datenight';
  event_name: string;
  days_remaining: number;
  created_at: string;
  baseline_metrics: SkinMetrics;
  target_metrics: Partial<SkinMetrics>;
  glow_readiness_index: number;
  primary_wardrobe: WardrobeItem;
  alternative_wardrobes: WardrobeItem[];
  milestones: MilestoneDay[];
  fabric_compatibility_assessment: {
    safe_fabrics: string[];
    risk_fabrics: string[];
    explanation: string;
  };
}

export interface EngineStatus {
  mock_mode: boolean;
  api_key_configured: boolean;
  api_key_preview: string;
  base_url: string;
  units_saved: number;
}

export interface PersonaModel {
  id: string;
  name: string;
  gender?: 'men' | 'women';
  image_url: string;
  glow_image_url?: string;
  event: 'wedding' | 'gala' | 'keynote';
  days: number;
  description: string;
}
