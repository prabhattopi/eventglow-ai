import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EventSelector, type EventType } from './components/EventSelector';
import { FaceScannerStudio } from './components/FaceScannerStudio';
import { SkinDiagnosticRadar } from './components/SkinDiagnosticRadar';
import { VirtualTryOnStudio } from './components/VirtualTryOnStudio';
import { CountdownRoadmap } from './components/CountdownRoadmap';
import type { EngineStatus, PersonaModel, WardrobeItem, SkinAnalysisResult, EventPlan } from './types';
import { Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);

  const [selectedEvent, setSelectedEvent] = useState<EventType>('wedding');
  const [daysRemaining, setDaysRemaining] = useState<number>(14);

  const [models, setModels] = useState<PersonaModel[]>([]);
  const [wardrobes, setWardrobes] = useState<WardrobeItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<PersonaModel | null>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);

  const [selectedWardrobe, setSelectedWardrobe] = useState<WardrobeItem | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [plan, setPlan] = useState<EventPlan | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // 1. Fetch Engine Status & Presets on Mount
  useEffect(() => {
    const initApp = async () => {
      try {
        const modeRes = await fetch('/api/mode');
        if (modeRes.ok) {
          const modeData = await modeRes.json();
          setStatus(modeData);
        }

        const presetsRes = await fetch('/api/presets');
        if (presetsRes.ok) {
          const presetsData = await presetsRes.json();
          setModels(presetsData.models || []);
          setWardrobes(presetsData.wardrobe || []);

          if (presetsData.models?.length > 0) {
            const firstModel = presetsData.models[0];
            setSelectedModel(firstModel);

            // Run initial automatic intake scan for seamless instant demo
            runAutoIntake(firstModel.id, 'wedding', 14);
          }
        }
      } catch (err) {
        console.error('Initial intake failed:', err);
      }
    };

    initApp();
  }, []);

  // Automatic intake helper
  const runAutoIntake = async (modelId: string, event: EventType, days: number) => {
    setIsAnalyzing(true);
    try {
      const skinRes = await fetch('/api/skin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId })
      });
      const skinData = await skinRes.json();
      if (skinData.success) {
        setAnalysis(skinData.data);

        // Generate matching countdown plan
        const planRes = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: event,
            days_remaining: days,
            metrics: skinData.data.metrics
          })
        });
        const planData = await planRes.json();
        if (planData.success) {
          setPlan(planData.data);
          setSelectedWardrobe(planData.data.primary_wardrobe);
        }
      }
    } catch (err) {
      console.error('Auto intake error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Safe Mock Shield vs Live YouCam API
  const handleToggleMode = async () => {
    if (!status) return;
    setIsLoadingMode(true);
    try {
      const res = await fetch('/api/mode/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mock_mode: !status.mock_mode })
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.status);
      }
    } catch (err) {
      console.error('Mode toggle failed:', err);
    } finally {
      setIsLoadingMode(false);
    }
  };

  // Trigger Manual Scan
  const handleTriggerScan = async () => {
    setIsAnalyzing(true);
    try {
      let skinData = null;

      if (customImageFile) {
        const formData = new FormData();
        formData.append('image', customImageFile);
        const res = await fetch('/api/skin/analyze', { method: 'POST', body: formData });
        skinData = await res.json();
      } else {
        const res = await fetch('/api/skin/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model_id: selectedModel?.id || models[0]?.id })
        });
        skinData = await res.json();
      }

      if (skinData?.success) {
        setAnalysis(skinData.data);

        // Re-generate plan
        const planRes = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: selectedEvent,
            days_remaining: daysRemaining,
            metrics: skinData.data.metrics,
            preferred_wardrobe_id: selectedWardrobe?.id
          })
        });
        const planData = await planRes.json();
        if (planData?.success) {
          setPlan(planData.data);
          setSelectedWardrobe(planData.data.primary_wardrobe);
        }
      }
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Re-generate plan when Event or Days change
  const handleEventChange = async (event: EventType) => {
    setSelectedEvent(event);
    if (analysis) {
      const planRes = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: event,
          days_remaining: daysRemaining,
          metrics: analysis.metrics,
          preferred_wardrobe_id: selectedWardrobe?.id
        })
      });
      const planData = await planRes.json();
      if (planData?.success) setPlan(planData.data);
    }
  };

  const handleDaysChange = async (days: number) => {
    setDaysRemaining(days);
    if (analysis) {
      const planRes = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: selectedEvent,
          days_remaining: days,
          metrics: analysis.metrics,
          preferred_wardrobe_id: selectedWardrobe?.id
        })
      });
      const planData = await planRes.json();
      if (planData?.success) setPlan(planData.data);
    }
  };

  // Wardrobe Try-On switch
  const handleSelectWardrobe = async (wardrobe: WardrobeItem) => {
    setSelectedWardrobe(wardrobe);
    try {
      const res = await fetch('/api/vto/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garment_id: wardrobe.id })
      });
      const vtoData = await res.json();
      if (vtoData?.success) {
        setSelectedWardrobe(vtoData.data);
      }
    } catch (err) {
      console.warn('VTO call fallback:', err);
    }
  };

  // Active user image for comparison
  const currentUserImage =
    customImagePreview || selectedModel?.image_url || models[0]?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-[#e6ca65] selection:text-black">
      {/* Top Header & Quota Shield */}
      <Header status={status} onToggleMode={handleToggleMode} isLoadingMode={isLoadingMode} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
        {/* Step 1: Event Selector & Countdown */}
        <EventSelector
          selectedEvent={selectedEvent}
          onSelectEvent={handleEventChange}
          daysRemaining={daysRemaining}
          onChangeDays={handleDaysChange}
        />

        {/* Step 2: Face Scanner & Model Intake Studio */}
        <FaceScannerStudio
          models={models}
          selectedModel={selectedModel}
          onSelectModel={(model) => {
            setSelectedModel(model);
            setCustomImageFile(null);
            setCustomImagePreview(null);
          }}
          customImagePreview={customImagePreview}
          onCustomImageSelected={(file, url) => {
            setCustomImageFile(file);
            setCustomImagePreview(url);
            setSelectedModel(null);
          }}
          isAnalyzing={isAnalyzing}
          onTriggerScan={handleTriggerScan}
        />

        {/* Step 3: Clinical Diagnostic Radar (if analysis ready) */}
        {analysis && <SkinDiagnosticRadar analysis={analysis} />}

        {/* Step 4: Virtual Try-On & Before/After Comparison */}
        <VirtualTryOnStudio
          wardrobes={wardrobes}
          selectedWardrobe={selectedWardrobe}
          onSelectWardrobe={handleSelectWardrobe}
          metrics={analysis ? analysis.metrics : null}
          userImage={currentUserImage}
        />

        {/* Step 5: Countdown Milestone Roadmap */}
        {plan && <CountdownRoadmap plan={plan} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel py-8 px-4 text-center space-y-2 mt-12">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#e6ca65]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>EventGlow AI • Perfect Corp YouCam API Hackathon 2026</span>
        </div>
        <p className="text-xs text-gray-400 m-0">
          Built with React 19, TypeScript, Express, and YouCam AI Skin & Apparel Virtual Try-On APIs.
        </p>
      </footer>
    </div>
  );
};

export default App;
