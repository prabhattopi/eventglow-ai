import React, { useState } from 'react';
import { Calendar, Sun, Moon, AlertTriangle, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { EventPlan } from '../types';

interface CountdownRoadmapProps {
  plan: EventPlan;
}

export const CountdownRoadmap: React.FC<CountdownRoadmapProps> = ({ plan }) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [hasCelebrated, setHasCelebrated] = useState<boolean>(false);

  const selectedMilestone = plan.milestones[activeDayIndex] || plan.milestones[0];

  const handleCelebrate = () => {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e6ca65', '#f59e0b', '#ec4899', '#34d399', '#ffffff']
    });
    setHasCelebrated(true);
  };

  const handleExportPlan = () => {
    const textData = `
=========================================
EVENTGLOW AI — COUNTDOWN REGIMEN SUMMARY
=========================================
Event: ${plan.event_name} (${plan.days_remaining} Days Countdown)
Glow Readiness Index: ${plan.glow_readiness_index}% -> Projected: 95%
Selected Outfit: ${plan.primary_wardrobe.name} (${plan.primary_wardrobe.fabric})
Color Harmony: ${plan.primary_wardrobe.harmony_score}%

SAFE FABRICS:
${plan.fabric_compatibility_assessment.safe_fabrics.join(', ')}

RISK FABRICS TO AVOID:
${plan.fabric_compatibility_assessment.risk_fabrics.join(', ')}

MILESTONES & DAILY PROTOCOL:
${plan.milestones
  .map(
    (m) => `
[${m.title}]
Focus: ${m.focus.toUpperCase()}
Status: ${m.skin_status_projected}
Morning: ${m.morning_routine.join(' -> ')}
Evening: ${m.evening_routine.join(' -> ')}
Actives: ${m.key_ingredients.join(', ')}
${m.warning_notes ? `WARNING: ${m.warning_notes}` : ''}
`
  )
  .join('\n')}
=========================================
Powered by Perfect Corp YouCam Skin AI & Apparel VTO API
    `.trim();

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventglow-plan-${plan.event_type}.txt`;
    a.click();
  };

  return (
    <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#e6ca65]">
            <span className="w-6 h-6 rounded-full bg-[#e6ca65]/20 text-[#e6ca65] flex items-center justify-center text-xs">
              5
            </span>
            Step 5: Agentic Countdown Roadmap & Clinical Regimen
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1 font-['Outfit'] m-0">
            {plan.event_name}
          </h2>
          <p className="text-xs text-gray-400 m-0 mt-0.5">
            {plan.days_remaining}-Day Progressive Glass-Skin & Wardrobe Rehearsal Protocol
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPlan}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Regimen
          </button>
          <button
            id="lock-event-plan-btn"
            onClick={handleCelebrate}
            className="glow-btn px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            {hasCelebrated ? 'Plan Locked & Synchronized!' : 'Lock & Rehearse Event Look'}
          </button>
        </div>
      </div>

      {/* Milestone Checkpoint Navigation Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {plan.milestones.map((milestone, idx) => {
          const isActive = activeDayIndex === idx;
          return (
            <button
              key={milestone.day_number}
              id={`milestone-day-btn-${milestone.day_number}`}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-4 py-3 rounded-xl border text-left shrink-0 transition-all cursor-pointer flex flex-col min-w-[170px] ${
                isActive
                  ? 'bg-gradient-to-b from-[#e6ca65]/20 to-[#e6ca65]/5 border-[#e6ca65] shadow-lg shadow-[#e6ca65]/15 ring-1 ring-[#e6ca65]/40'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-[#e6ca65]' : 'text-gray-400'}`}>
                  Checkpoint {idx + 1}
                </span>
                <span className={`text-xs font-extrabold font-['Outfit'] ${isActive ? 'text-white' : 'text-gray-400'}`}>
                  Day {milestone.day_number}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-200 mt-1 truncate">
                {milestone.focus.replace('_', ' ').toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Milestone Day Card */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-6 lg:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white m-0 font-['Outfit'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#e6ca65]" />
              {selectedMilestone.title}
            </h3>
            <p className="text-xs text-[#e6ca65] m-0 mt-1 font-medium">
              Target Projection: {selectedMilestone.skin_status_projected}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedMilestone.key_ingredients.map((ing) => (
              <span
                key={ing}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>

        {/* Morning vs Evening Regimen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Morning Protocol */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Sun className="w-4 h-4" />
              <span>Morning Clinical Regimen</span>
            </div>
            <ul className="space-y-2 m-0 p-0 list-none">
              {selectedMilestone.morning_routine.map((step, sIdx) => (
                <li key={sIdx} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evening Protocol */}
          <div className="glass-panel rounded-xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Moon className="w-4 h-4" />
              <span>Evening Regenerative Regimen</span>
            </div>
            <ul className="space-y-2 m-0 p-0 list-none">
              {selectedMilestone.evening_routine.map((step, sIdx) => (
                <li key={sIdx} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-indigo-400/20 text-indigo-300 flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                    {sIdx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Critical Caution Notice if present */}
        {selectedMilestone.warning_notes && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 m-0 leading-relaxed font-semibold">
              {selectedMilestone.warning_notes}
            </p>
          </div>
        )}

        {/* VTO Rehearsal Checkpoint */}
        {selectedMilestone.vto_fitting_checkpoint && (
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-[#e6ca65] shrink-0" />
            <span className="text-xs text-gray-300 font-medium">
              <strong className="text-white">VTO Checkpoint: </strong>
              {selectedMilestone.vto_fitting_checkpoint}
            </span>
          </div>
        )}
      </div>

      {/* Fabric Compatibility & Consumer Safety Breakdown */}
      <div className="glass-panel rounded-xl p-6 border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Clinical Fabric Compatibility & Sensitivity Guard</span>
        </div>
        <p className="text-xs text-gray-300 m-0 leading-relaxed">
          {plan.fabric_compatibility_assessment.explanation}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block mb-1">
              ✓ Recommended Safe Luxury Drapes
            </span>
            <p className="text-xs text-gray-300 m-0">
              {plan.fabric_compatibility_assessment.safe_fabrics.join(' • ')}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block mb-1">
              ✗ High-Friction Risk Fabrics to Avoid
            </span>
            <p className="text-xs text-gray-300 m-0">
              {plan.fabric_compatibility_assessment.risk_fabrics.join(' • ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
