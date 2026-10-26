export interface SkinMetricDetail {
  score: number; // 0-100
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
  harmony_score: number; // calculated against skin undertone
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
  glow_readiness_index: number; // e.g. 74 -> projected 94%
  primary_wardrobe: WardrobeItem;
  alternative_wardrobes: WardrobeItem[];
  milestones: MilestoneDay[];
  fabric_compatibility_assessment: {
    safe_fabrics: string[];
    risk_fabrics: string[];
    explanation: string;
  };
}
