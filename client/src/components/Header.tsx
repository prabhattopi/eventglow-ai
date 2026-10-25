import React from 'react';
import { ShieldCheck, Zap, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import type { EngineStatus } from '../types';

interface HeaderProps {
  status: EngineStatus | null;
  onToggleMode: () => void;
  isLoadingMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, onToggleMode, isLoadingMode }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#e6ca65] via-[#f59e0b] to-[#ec4899] flex items-center justify-center shadow-lg shadow-[#e6ca65]/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight gold-gradient-text m-0 font-['Outfit']">
                EventGlow AI
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#e6ca65]/10 text-[#e6ca65] border border-[#e6ca65]/30">
                YouCam Agentic VTO
              </span>
            </div>
            <p className="text-xs text-gray-400 m-0">
              Autonomous Countdown Event Stylist & Clinical Skin Architect
            </p>
          </div>
        </div>

        {/* Action Controls & Quota Shield */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quota Shield Display */}
          <div
            id="quota-shield-badge"
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium backdrop-blur-md transition-all ${
              status?.mock_mode
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {status?.mock_mode ? (
              <ShieldCheck className="w-4 h-4 text-[#e6ca65] shrink-0" />
            ) : (
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <div>
              <span className="font-semibold">
                {status?.mock_mode ? 'Safe Mock Shield (1,000 Units Intact)' : 'Live YouCam Cloud API'}
              </span>
              <span className="hidden sm:inline text-gray-400 ml-1.5">
                • {status?.api_key_configured ? `Key: ${status.api_key_preview}` : 'No key in .env'}
              </span>
            </div>
          </div>

          {/* Toggle Mode Button */}
          <button
            id="toggle-engine-mode-btn"
            onClick={onToggleMode}
            disabled={isLoadingMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              status?.mock_mode
                ? 'bg-white/5 hover:bg-white/10 border-white/15 text-gray-200'
                : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-[#e6ca65]'
            }`}
            title="Toggle between Safe Fixture Engine (0 credits burned) and Live YouCam API"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMode ? 'animate-spin' : ''}`} />
            {status?.mock_mode ? 'Switch to Live API' : 'Engage Quota Shield'}
          </button>

          {/* Devpost Hackathon Link */}
          <a
            href="https://youcam-api-skin-ai-ecommerce.devpost.com"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1"
          >
            Devpost Rules
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
};
