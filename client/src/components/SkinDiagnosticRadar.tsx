import React from 'react';
import { Activity, ShieldAlert, Sparkles, Droplets, Sun, Eye, Flame, Disc } from 'lucide-react';
import type { SkinAnalysisResult } from '../types';

interface SkinDiagnosticRadarProps {
  analysis: SkinAnalysisResult;
}

export const SkinDiagnosticRadar: React.FC<SkinDiagnosticRadarProps> = ({ analysis }) => {
  const { metrics, source } = analysis;

  const metricList = [
    { key: 'moisture', label: 'Hydration Reserve', data: metrics.moisture, icon: Droplets, color: 'text-sky-400' },
    { key: 'radiance', label: 'Surface Radiance', data: metrics.radiance, icon: Sparkles, color: 'text-amber-300' },
    { key: 'redness', label: 'Erythema & Calm', data: metrics.redness, icon: Flame, color: 'text-rose-400' },
    { key: 'dark_circles', label: 'Periorbital Rest', data: metrics.dark_circles, icon: Eye, color: 'text-indigo-400' },
    { key: 'pores', label: 'Pore Refinement', data: metrics.pores, icon: Disc, color: 'text-purple-400' },
    { key: 'texture', label: 'Micro-Smoothness', data: metrics.texture, icon: Sun, color: 'text-emerald-400' },
    { key: 'wrinkles', label: 'Elastic Firmness', data: metrics.wrinkles, icon: Activity, color: 'text-teal-400' },
    { key: 'oiliness', label: 'Sebum Equilibrium', data: metrics.oiliness, icon: Droplets, color: 'text-amber-400' },
    { key: 'acne', label: 'Blemish Clarity', data: metrics.acne, icon: ShieldAlert, color: 'text-red-400' }
  ];

  return (
    <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#e6ca65]">
            <span className="w-6 h-6 rounded-full bg-[#e6ca65]/20 text-[#e6ca65] flex items-center justify-center text-xs">
              3
            </span>
            Step 3: YouCam AI Clinical Diagnostics
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1 font-['Outfit'] m-0">
            Dermatological Scan & Undertone Mapping
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Engine: {source === 'youcam_live' ? '⚡ Live YouCam S2S Cloud' : '🛡️ YouCam Fixture Engine'}
          </span>
        </div>
      </div>

      {/* Top Banner: Core Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Glow Score Gauge */}
        <div className="glass-panel-glow rounded-xl p-5 flex items-center gap-5 border border-[#e6ca65]/30">
          <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#e6ca65]"
                strokeDasharray={`${metrics.overall_score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xl font-bold font-['Outfit'] text-white">
              {metrics.overall_score}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Glow Health Index
            </span>
            <h3 className="text-lg font-bold text-white m-0">Event Readiness Baseline</h3>
            <p className="text-xs text-[#e6ca65] m-0 mt-0.5">High Potential for Glass-Skin Turnaround</p>
          </div>
        </div>

        {/* Biological Skin Age */}
        <div className="glass-panel rounded-xl p-5 flex items-center gap-4 border border-white/10">
          <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-purple-300 font-['Outfit']">{metrics.skin_age}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              YouCam Diagnostic Age
            </span>
            <h3 className="text-base font-bold text-white m-0">Biological Skin Age</h3>
            <p className="text-xs text-purple-300/80 m-0 mt-0.5">Firm collagen baseline intact</p>
          </div>
        </div>

        {/* Undertone Chromatic Profile */}
        <div className="glass-panel rounded-xl p-5 flex items-center gap-4 border border-white/10">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-black uppercase text-emerald-300 font-['Outfit'] tracking-wider">
              {metrics.undertone}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Chromatic Profile
            </span>
            <h3 className="text-base font-bold text-white m-0 truncate">{metrics.tone_name}</h3>
            <p className="text-xs text-emerald-300/80 m-0 mt-0.5">Matches Emerald, Champagne & Navy</p>
          </div>
        </div>
      </div>

      {/* 9 Clinical Parameter Breakdown Grid */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold m-0">
          Full 9-Parameter Clinical Scan (Perfect Corp Standard API):
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {metricList.map(({ key, label, data, icon: Icon, color }) => (
            <div
              key={key}
              className="bg-black/30 border border-white/10 rounded-xl p-3.5 space-y-2 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-xs font-semibold text-gray-200">{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-['Outfit']">{data.score}%</span>
                  <span
                    className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                      data.severity === 'optimal'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : data.severity === 'low'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {data.severity}
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#e6ca65] to-[#f59e0b] rounded-full transition-all duration-700"
                  style={{ width: `${data.score}%` }}
                />
              </div>

              <p className="text-[11px] text-gray-400 m-0 leading-tight line-clamp-1">{data.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnostic Conclusion Summary */}
      <div className="p-4 rounded-xl bg-[#e6ca65]/5 border border-[#e6ca65]/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[#e6ca65] shrink-0 mt-0.5" />
        <p className="text-xs text-gray-300 m-0 leading-relaxed font-medium">
          <strong className="text-[#e6ca65]">YouCam Clinical Assessment: </strong>
          {analysis.summary}
        </p>
      </div>
    </section>
  );
};
