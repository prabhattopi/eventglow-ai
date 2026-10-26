import { EventPlan, MilestoneDay, SkinMetrics, WardrobeItem } from '../../types/index.js';
import { mockWardrobeCatalog } from '../youcam/mockFixtures.js';

const EVENT_NAMES: Record<string, string> = {
  wedding: 'The Royal Wedding Ceremony & Reception',
  gala: 'High-Society Charity Gala & Black Tie Dinner',
  interview: 'Executive Leadership Interview & Panel',
  keynote: 'Tech Innovation Summit Keynote Presentation',
  datenight: 'Romantic Anniversary & Fine Dining Evening'
};

/**
 * Filter and rank wardrobes based on event, gender, and skin undertone
 */
export const rankWardrobesForUndertone = (
  catalog: WardrobeItem[],
  undertone: string,
  eventType?: string,
  gender?: 'men' | 'women'
): WardrobeItem[] => {
  return catalog
    .filter((item) => {
      // 1. Filter by gender if specified
      if (gender && item.gender && item.gender !== 'all' && item.gender !== gender) {
        return false;
      }
      return true;
    })
    .map((item) => {
      let score = item.harmony_score;
      const matchesEvent = eventType && item.events?.includes(eventType as any);

      // Event match bonus ensures event-tailored couture tops the list
      if (matchesEvent) {
        score += 12;
      }

      // Undertone harmony bonus
      if (undertone === 'olive' && (item.color.includes('Emerald') || item.color.includes('Gold') || item.color.includes('Obsidian'))) {
        score += 6;
      } else if (undertone === 'warm' && (item.color.includes('Gold') || item.color.includes('Burgundy') || item.color.includes('Champagne') || item.color.includes('Blush') || item.color.includes('Amber'))) {
        score += 6;
      } else if (undertone === 'cool' && (item.color.includes('Sapphire') || item.color.includes('Obsidian') || item.color.includes('Noir') || item.color.includes('Slate') || item.color.includes('Pearl'))) {
        score += 6;
      }

      return {
        ...item,
        harmony_score: Math.min(99, score)
      };
    })
    .sort((a, b) => {
      const aEvent = eventType && a.events?.includes(eventType as any) ? 1 : 0;
      const bEvent = eventType && b.events?.includes(eventType as any) ? 1 : 0;
      if (aEvent !== bEvent) return bEvent - aEvent;
      return b.harmony_score - a.harmony_score;
    });
};

export const analyzeFabricCompatibility = (metrics: SkinMetrics, wardrobe: WardrobeItem) => {
  const hasRednessOrAcne = metrics.redness.score < 75 || metrics.acne.score < 75;

  if (hasRednessOrAcne) {
    return {
      safe_fabrics: ['100% Mulberry Silk', 'Breathable Cupro-Modal', 'Organic Long-Staple Cotton'],
      risk_fabrics: ['Coarse Wool Collars', '100% Synthetic Polyester Blends', 'Heavy Acrylic Knits'],
      explanation: `With detected barrier sensitivity (redness score: ${metrics.redness.score}%), high-friction fabrics against the neck can trigger friction erythema. ${wardrobe.name} utilizes ${wardrobe.fabric}, which is clinically optimal.`
    };
  }

  return {
    safe_fabrics: ['Mulberry Silk', 'Fine Worsted Wool with Silk Linings', 'Italian Viscose', 'Cupro-Modal'],
    risk_fabrics: ['Unwashed stiff denims', 'Non-breathable coated synthetics'],
    explanation: `Skin exhibits balanced barrier resilience. All luxury tailoring fabrics in your curated wardrobe will drape smoothly without tactile irritation.`
  };
};

/**
 * Event-specific day-by-day milestone synthesis
 */
export const synthesizeMilestones = (
  totalDays: number,
  metrics: SkinMetrics,
  eventType: string,
  projectedReadiness: number
): MilestoneDay[] => {
  const milestones: MilestoneDay[] = [];
  const stepCount = Math.min(totalDays, 5);

  const eventTitles: Record<string, string[]> = {
    wedding: [
      'Day 1: Pre-Wedding Detox & Skin Barrier Calibration',
      `Day ${Math.round(totalDays * 0.3)}: Pre-Shoot Texture & Micro-Pore Balancing`,
      `Day ${Math.round(totalDays * 0.55)}: Sangeet Vascular Calm & Anti-Fatigue Flush`,
      `Day ${Math.round(totalDays * 0.85)}: 48-Hour Pre-Ceremony Dewy Glaze`,
      `Day ${totalDays}: THE WEDDING DAY — Peak Luminescence & Ceremony Rehearsal`
    ],
    keynote: [
      'Day 1: Executive Fatigue Reset & Blue-Light Shield',
      `Day ${Math.round(totalDays * 0.3)}: Stage-Lighting Anti-Glare Oil Control`,
      `Day ${Math.round(totalDays * 0.55)}: 4K HD Camera Anti-Puffiness Protocol`,
      `Day ${Math.round(totalDays * 0.85)}: High-Definition Canvas & Poreless Lock`,
      `Day ${totalDays}: TECH SUMMIT KEYNOTE — Sharp Executive Vitality`
    ],
    gala: [
      'Day 1: Black-Tie Red Carpet Skin Calibration',
      `Day ${Math.round(totalDays * 0.3)}: High-Definition Stratum Corneum Polish`,
      `Day ${Math.round(totalDays * 0.55)}: Evening Luminescence Induction`,
      `Day ${Math.round(totalDays * 0.85)}: 48-Hour Gala Radiance Seal`,
      `Day ${totalDays}: CHARITY GALA NIGHT — High-Society Luminescence`
    ],
    interview: [
      'Day 1: Executive Grooming & Under-Eye De-Puffing',
      `Day ${Math.round(totalDays * 0.3)}: Matte Equilibrium & Stress Barrier Care`,
      `Day ${Math.round(totalDays * 0.55)}: Rested Authority & Tone Clarity`,
      `Day ${Math.round(totalDays * 0.85)}: Panel Day Sharpness Alignment`,
      `Day ${totalDays}: BOARDROOM INTERVIEW — Crisp Composure & Rested Focus`
    ],
    datenight: [
      'Day 1: Romantic Hydration Infusion & Softness Calibration',
      `Day ${Math.round(totalDays * 0.3)}: Micro-Texture Smoothing`,
      `Day ${Math.round(totalDays * 0.55)}: Plump Dewy Skin Induction`,
      `Day ${Math.round(totalDays * 0.85)}: Candlelight Radiance Priming`,
      `Day ${totalDays}: ANNIVERSARY DINNER — Romantic Glow & Tailored Fit`
    ]
  };

  const titles = eventTitles[eventType] || eventTitles['wedding'];

  for (let i = 1; i <= stepCount; i++) {
    const dayNum = i === 1 ? 1 : Math.round((totalDays / (stepCount - 1)) * (i - 1));

    if (i === 1) {
      milestones.push({
        day_number: 1,
        title: titles[0],
        focus: 'barrier_repair',
        skin_status_projected: `Baseline Score: ${metrics.overall_score}/100. Hydration deficit identified (${metrics.moisture.score}%).`,
        morning_routine: [
          'Gentle pH 5.5 Amino-Acid Foaming Cleanser',
          'Centella Asiatica + Multi-Molecular Hyaluronic Acid Essence',
          'Broad Spectrum SPF 50+ PA++++ (Zero white cast fluid)'
        ],
        evening_routine: [
          'Double Cleanse with Squalane Emulsifying Balm',
          'Ceramide NP + Panthenol B5 Barrier Repair Creme',
          'Silk pillowcase switch to prevent sleep friction'
        ],
        key_ingredients: ['Ceramides', 'Centella Asiatica', 'Panthenol B5'],
        vto_fitting_checkpoint: 'Virtual Try-On baseline silhouette logged in YouCam Engine.'
      });
    } else if (i === 2) {
      milestones.push({
        day_number: dayNum,
        title: titles[1],
        focus: 'hydration',
        skin_status_projected: 'T-zone sebum stabilizing. Pore clarity improving (+8%).',
        morning_routine: [
          'Cold water splash rinse',
          '2% Niacinamide + Zinc PCA Pore Refining Serum',
          'Lightweight Oil-Free Gel-Cream Moisturizer'
        ],
        evening_routine: [
          'Mild Polyhydroxy Acid (PHA) gentle non-abrasive exfoliant',
          'Ectoin Hydration Booster Ampoule',
          'Peptide Lip Recovery Mask'
        ],
        key_ingredients: ['PHA (Gentle Exfoliant)', 'Niacinamide', 'Zinc PCA'],
        warning_notes: 'Avoid mechanical face scrubs or chemical peels beyond this checkpoint.'
      });
    } else if (i === 3) {
      milestones.push({
        day_number: dayNum,
        title: titles[2],
        focus: 'brightening',
        skin_status_projected: 'Under-eye dark circles visibly softened (-15% shadow density). Redness reduced.',
        morning_routine: [
          'Cryo-roller massage over eye hollows for 3 minutes',
          'Caffeine 5% + EGCG Under-Eye Brightening Serum',
          'Liposomal Vitamin C (Ascorbyl Tetraisopalmitate) 10%'
        ],
        evening_routine: [
          'Licorice Root Extract & Azelaic Acid micro-dose for erythema zones',
          'Overnight Squalane Sleeping Mask'
        ],
        key_ingredients: ['Caffeine', 'Vitamin C Ester', 'Azelaic Acid'],
        vto_fitting_checkpoint: 'YouCam VTO color harmony simulation verified against current undertone.'
      });
    } else if (i === 4) {
      milestones.push({
        day_number: dayNum,
        title: titles[3],
        focus: 'brightening',
        skin_status_projected: 'Radiance Index reaches 88/100. Skin barrier fully primed with zero active irritation.',
        morning_routine: [
          'Ultra-hydrating hydrogel sheet mask (chilled 15 min)',
          'Copper Tripeptide-1 Firming Serum',
          'Water-burst moisture sealant'
        ],
        evening_routine: [
          'Lymphatic drainage facial massage with rosehip seed oil',
          'Early sleep schedule (8 hours minimum melatonin cycle)'
        ],
        key_ingredients: ['Copper Peptides', 'Hydrogel Marine Collagen', 'Rosehip Seed Oil'],
        warning_notes: 'CRITICAL: No new skincare products or high-fragrance actives allowed in final 48 hours!'
      });
    } else {
      milestones.push({
        day_number: totalDays,
        title: titles[4],
        focus: 'event_ready',
        skin_status_projected: `Peak Radiance (${projectedReadiness}%). Zero flaking, poreless canvas ready for HD photography.`,
        morning_routine: [
          'Chilled green-tea ice globes for instant depuffing',
          'Hyaluronic Acid Primer Base (Silicone-free)',
          'Dewy finish setting mist with botanical antioxidants'
        ],
        evening_routine: [
          'Gentle soothing oil cleanse post-event celebration'
        ],
        key_ingredients: ['Ectoin', 'Hyaluronic Glaze', 'Antioxidant Mist'],
        vto_fitting_checkpoint: 'Final YouCam Virtual Try-On verified: 100% aesthetic coherence.'
      });
    }
  }

  return milestones;
};

/**
 * Main Pure Functional Agent: Synthesizes Event Plan
 */
export const generateEventPlan = (params: {
  eventType: 'wedding' | 'gala' | 'interview' | 'keynote' | 'datenight';
  daysRemaining: number;
  metrics: SkinMetrics;
  preferredWardrobeId?: string;
  gender?: 'men' | 'women';
}): EventPlan => {
  const { eventType, daysRemaining, metrics, preferredWardrobeId, gender } = params;

  const baselineReadiness = Math.round(
    (metrics.overall_score * 0.4) +
    (metrics.radiance.score * 0.25) +
    (metrics.moisture.score * 0.2) +
    (metrics.texture.score * 0.15)
  );

  const projectedReadiness = Math.min(96, Math.round(baselineReadiness + (daysRemaining * 1.3)));

  // Rank wardrobes with event and gender awareness!
  const sortedWardrobes = rankWardrobesForUndertone(mockWardrobeCatalog, metrics.undertone, eventType, gender);
  const primaryWardrobe = sortedWardrobes.find((w) => w.id === preferredWardrobeId) || sortedWardrobes[0] || mockWardrobeCatalog[0];
  const alternativeWardrobes = sortedWardrobes.filter((w) => w.id !== primaryWardrobe.id);

  const milestones = synthesizeMilestones(daysRemaining, metrics, eventType, projectedReadiness);
  const fabricAssessment = analyzeFabricCompatibility(metrics, primaryWardrobe);

  return {
    event_id: `plan_${Date.now()}`,
    event_type: eventType,
    event_name: EVENT_NAMES[eventType] || 'Upcoming Milestone Event',
    days_remaining: daysRemaining,
    created_at: new Date().toISOString(),
    baseline_metrics: metrics,
    target_metrics: {
      overall_score: Math.min(94, metrics.overall_score + 14),
      moisture: { score: Math.min(92, metrics.moisture.score + 22), severity: 'optimal', description: 'De-congested glass skin' },
      radiance: { score: Math.min(95, metrics.radiance.score + 20), severity: 'optimal', description: 'Peak event luminescence' },
      redness: { score: Math.min(90, metrics.redness.score + 16), severity: 'low', description: 'Calm, even-toned baseline' }
    },
    glow_readiness_index: baselineReadiness,
    primary_wardrobe: primaryWardrobe,
    alternative_wardrobes: alternativeWardrobes,
    milestones,
    fabric_compatibility_assessment: fabricAssessment
  };
};
