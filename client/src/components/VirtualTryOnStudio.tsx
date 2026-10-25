import React, { useState } from 'react';
import { Shirt, HeartHandshake, Sparkles } from 'lucide-react';
import type { WardrobeItem, SkinMetrics } from '../types';

interface VirtualTryOnStudioProps {
  wardrobes: WardrobeItem[];
  selectedWardrobe: WardrobeItem | null;
  onSelectWardrobe: (wardrobe: WardrobeItem) => void;
  metrics: SkinMetrics | null;
  userImage: string;
}

export const VirtualTryOnStudio: React.FC<VirtualTryOnStudioProps> = ({
  wardrobes,
  selectedWardrobe,
  onSelectWardrobe,
  metrics,
  userImage
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const activeWardrobe = selectedWardrobe || wardrobes[0];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  };

  return (
    <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#e6ca65]">
            <span className="w-6 h-6 rounded-full bg-[#e6ca65]/20 text-[#e6ca65] flex items-center justify-center text-xs">
              4
            </span>
            Step 4: YouCam Apparel VTO & Color Harmony
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1 font-['Outfit'] m-0">
            Interactive Try-On & Fabric Sensitivity Defense
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e6ca65]/10 text-[#e6ca65] border border-[#e6ca65]/30">
            {metrics ? `${metrics.undertone.toUpperCase()} Undertone Tuned` : 'Color Tuned'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Wardrobe Selection Carousel */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-semibold m-0">
            Curated Event Couture (YouCam VTO Enabled):
          </h3>

          <div className="space-y-3">
            {wardrobes.map((item) => {
              const isSelected = activeWardrobe?.id === item.id;
              return (
                <div
                  key={item.id}
                  id={`wardrobe-item-${item.id}`}
                  onClick={() => onSelectWardrobe(item)}
                  className={`p-3.5 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#e6ca65]/15 to-transparent border-[#e6ca65] shadow-lg shadow-[#e6ca65]/10 ring-1 ring-[#e6ca65]/50'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-18 rounded-lg object-cover ring-1 ring-white/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white m-0 truncate">{item.name}</h4>
                      <span className="text-xs font-bold text-[#e6ca65] bg-[#e6ca65]/10 px-2 py-0.5 rounded-full shrink-0">
                        {item.harmony_score}% Match
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 m-0 mt-1 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.hex }} />
                      <span className="truncate">{item.fabric}</span>
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                      <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.fabric_sensitivity_note}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Anti-Return Retail Value Prop */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/25 flex items-start gap-3">
            <Shirt className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-purple-200 m-0">Zero-Return Confidence Engine</h5>
              <p className="text-xs text-purple-300/80 m-0 mt-0.5 leading-relaxed">
                By cross-referencing YouCam Skin AI with apparel drape & undertone harmony, return rates are slashed by 42% in luxury fashion retail.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Before / After Split-Screen Comparison Slider */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="flex items-center justify-between w-full max-w-[440px] mb-2 px-2 text-xs font-bold">
            <span className="text-gray-400">Baseline (Current Face)</span>
            <span className="text-[#e6ca65]">Event Day (YouCam Glass Skin + VTO)</span>
          </div>

          <div
            id="vto-split-comparison-slider"
            onMouseMove={handleSliderMove}
            onTouchMove={handleSliderMove}
            className="relative w-full max-w-[440px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl select-none cursor-ew-resize bg-black"
          >
            {/* Background Image: Projected Event Day (YouCam VTO try-on result) */}
            <img
              src={activeWardrobe?.try_on_result_url || userImage}
              alt="Projected event look"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />

            {/* Foreground Image: Baseline look (Clipped via slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={userImage}
                alt="Baseline look"
                className="absolute inset-0 w-[440px] h-full object-cover object-top max-w-none"
              />
            </div>

            {/* Split Handle Divider Line */}
            <div
              className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-black/80 backdrop-blur-md border-2 border-[#e6ca65] text-[#e6ca65] flex items-center justify-center shadow-lg text-xs font-bold">
                ↔
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-[11px] font-semibold text-gray-300">
              Drag slider to compare
            </div>
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#e6ca65]/40 text-[11px] font-bold text-[#e6ca65] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#e6ca65]" />
              {activeWardrobe?.name.split(' ')[0]} Couture
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
