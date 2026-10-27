import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  Camera,
  Upload,
  Crown,
  Mic,
  Briefcase,
  Wine,
  Activity,
  ShieldAlert,
  Droplets,
  Sun,
  Eye,
  Flame,
  Disc,
  Moon,
  AlertTriangle,
  Download,
  X,
  Maximize2,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type {
  EngineStatus,
  PersonaModel,
  WardrobeItem,
  SkinAnalysisResult,
  EventPlan
} from './types';

type EventType = 'wedding' | 'gala' | 'keynote' | 'interview' | 'datenight';
type ActiveTab = 'diagnostics' | 'roadmap' | 'fabric';

const EVENT_CONFIGS: { id: EventType; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'wedding', title: 'Royal Wedding', subtitle: 'Ceremony & Reception', icon: Crown },
  { id: 'gala', title: 'Charity Gala', subtitle: 'Black-Tie Red Carpet', icon: Sparkles },
  { id: 'keynote', title: 'Tech Keynote', subtitle: 'Summit Presentation', icon: Mic },
  { id: 'interview', title: 'Executive Interview', subtitle: 'Boardroom Panel', icon: Briefcase },
  { id: 'datenight', title: 'Anniversary Dinner', subtitle: 'Romantic Candlelight', icon: Wine }
];

const TIMELINE_OPTIONS = [5, 7, 14, 21, 30];

export const App: React.FC = () => {
  // Engine State
  const [status, setStatus] = useState<EngineStatus | null>(null);
  const [isLoadingMode, setIsLoadingMode] = useState<boolean>(false);

  // User Selection State
  const [selectedEvent, setSelectedEvent] = useState<EventType>('wedding');
  const [daysRemaining, setDaysRemaining] = useState<number>(14);
  const [models, setModels] = useState<PersonaModel[]>([]);
  const [wardrobes, setWardrobes] = useState<WardrobeItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<PersonaModel | null>(null);
  const [userGender, setUserGender] = useState<'men' | 'women'>('men');

  // Custom Intake State
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Results & Analysis State
  const [selectedWardrobe, setSelectedWardrobe] = useState<WardrobeItem | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysisResult | null>(null);
  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanStepMessage, setScanStepMessage] = useState<string>('');
  const [scanProgressPercent, setScanProgressPercent] = useState<number>(0);

  // Cockpit View State (Single Page / Zero-Scroll)
  const [activeTab, setActiveTab] = useState<ActiveTab>('roadmap');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeMilestoneDayIndex, setActiveMilestoneDayIndex] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [studioView, setStudioView] = useState<'glow' | 'vto'>('glow');
  const [activeHeatmap, setActiveHeatmap] = useState<'none' | 'pore' | 'redness' | 'radiance' | 'wrinkle'>('none');

  // 1. Initial Intake & Preload
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
          const loadedModels = presetsData.models || [];
          const loadedWardrobes = presetsData.wardrobe || [];
          setModels(loadedModels);
          setWardrobes(loadedWardrobes);

          if (loadedModels.length > 0) {
            const firstModel = loadedModels[0];
            setSelectedModel(firstModel);
            const gender = (firstModel.gender as 'men' | 'women') || 'men';
            setUserGender(gender);

            // Filter initial wardrobe by gender and default event ('wedding')
            const eventWardrobes = loadedWardrobes.filter(
              (w: WardrobeItem) => (!w.gender || w.gender === 'all' || w.gender === gender) && w.events?.includes('wedding')
            );
            const initialTopWardrobe = eventWardrobes[0] || loadedWardrobes[0];
            setSelectedWardrobe(initialTopWardrobe);

            // Synthesize initial baseline plan without burning extra live API calls
            const initialPlanRes = await fetch('/api/plan/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event_type: 'wedding',
                days_remaining: 14,
                preferred_wardrobe_id: initialTopWardrobe?.id,
                gender
              })
            });
            const initialPlanData = await initialPlanRes.json();
            if (initialPlanData?.success) {
              setPlan(initialPlanData.data);
              setAnalysis({
                task_id: 'init_baseline',
                source: 'youcam_mock_engine',
                timestamp: new Date().toISOString(),
                metrics: initialPlanData.data.baseline_metrics,
                summary: 'Baseline face calibration ready. Click "Scan Face & Synthesize Look" to execute full clinical YouCam AI analysis.'
              });
              if (initialPlanData.data.primary_wardrobe) {
                setSelectedWardrobe(initialPlanData.data.primary_wardrobe);
              }
            }
          }
        }
      } catch (err) {
        console.error('Initial preload error:', err);
      }
    };

    initApp();
  }, []);

  // Filter Wardrobes strictly by Gender and Selected Event
  const filteredWardrobes = wardrobes.filter((w) => {
    if (w.gender && w.gender !== 'all' && w.gender !== userGender) return false;
    if (w.events && !w.events.includes(selectedEvent)) return false;
    return true;
  });

  const displayWardrobes =
    filteredWardrobes.length > 0
      ? filteredWardrobes
      : wardrobes.filter((w) => !w.gender || w.gender === 'all' || w.gender === userGender);

  const currentWardrobesList =
    plan?.primary_wardrobe
      ? [
          plan.primary_wardrobe,
          ...(plan.alternative_wardrobes || []).filter(
            (w) =>
              (!w.gender || w.gender === 'all' || w.gender === userGender) &&
              (!w.events || w.events.includes(selectedEvent))
          )
        ]
      : displayWardrobes;

  const activeWardrobe =
    selectedWardrobe && currentWardrobesList.some((w) => w.id === selectedWardrobe.id)
      ? selectedWardrobe
      : currentWardrobesList[0] || wardrobes[0];


  // Run Intake Scan explicitly on click
  const runIntakeScan = async () => {
    setIsAnalyzing(true);
    setScanProgressPercent(10);
    setScanStepMessage('Phase 1/4: Mapping 68 Biometric Facial Landmarks & Framing...');

    const progressTimer = setInterval(() => {
      setScanProgressPercent((prev) => {
        if (prev < 35) {
          setScanStepMessage('Phase 2/4: Perfect Corp YouCam Cloud AI Measuring 9 Dermal Metrics...');
          return prev + 8;
        } else if (prev < 70) {
          setScanStepMessage('Phase 3/4: Computing DermoCommerce Fabric Safety & Undertone Match...');
          return prev + 7;
        } else if (prev < 92) {
          setScanStepMessage(`Phase 4/4: Synthesizing ${selectedEvent.toUpperCase()} Countdown Protocol...`);
          return prev + 5;
        }
        return prev;
      });
    }, 350);

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
        setScanProgressPercent(100);

        // Generate Plan with event, days, and gender (Dynamic #1 match computed by AI Stylist)
        const planRes = await fetch('/api/plan/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: selectedEvent,
            days_remaining: daysRemaining,
            metrics: skinData.data.metrics,
            gender: userGender
          })
        });
        const planData = await planRes.json();
        if (planData?.success) {
          setPlan(planData.data);
          if (planData.data.primary_wardrobe) {
            setSelectedWardrobe(planData.data.primary_wardrobe);
          }
        }

        // Keep studio view on Face Glow Transformation so user sees their scanned face!
        setStudioView('glow');
        // Automatically switch right dock to 'diagnostics' (Clinical Scan (9)) so 9 clinical metrics animate in!
        setActiveTab('diagnostics');
        handleCelebrate();
      } else {

        alert(skinData?.error || 'Analysis failed. Please check the image framing.');
      }
    } catch (err: any) {
      console.error('Scan error:', err);
      alert('Skin analysis failed: ' + err.message);
    } finally {
      clearInterval(progressTimer);
      setScanProgressPercent(100);
      setTimeout(() => {
        setIsAnalyzing(false);
        setScanProgressPercent(0);
      }, 400);
    }
  };

  // Toggle Mock vs Live
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
      console.error('Mode toggle error:', err);
    } finally {
      setIsLoadingMode(false);
    }
  };

  // Event Change
  const handleEventChange = async (event: EventType) => {
    setSelectedEvent(event);

    // Pick top matching wardrobe item for this event and gender
    const eventWardrobes = wardrobes.filter(
      (w) => (!w.gender || w.gender === 'all' || w.gender === userGender) && w.events?.includes(event)
    );
    const topWardrobe = eventWardrobes[0] || displayWardrobes[0];
    if (topWardrobe) {
      setSelectedWardrobe(topWardrobe);
    }

    try {
      const planRes = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: event,
          days_remaining: daysRemaining,
          metrics: analysis?.metrics,
          preferred_wardrobe_id: topWardrobe?.id,
          gender: userGender
        })
      });
      const planData = await planRes.json();
      if (planData?.success) {
        setPlan(planData.data);
      }
    } catch (err) {
      console.warn('Plan update on event change:', err);
    }
  };

  // Days Change
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
          preferred_wardrobe_id: activeWardrobe?.id,
          gender: userGender
        })
      });
      const planData = await planRes.json();
      if (planData?.success) setPlan(planData.data);
    }
  };

  // Wardrobe VTO Select (Curated Luxury Garment Lookbook with Live DermoCommerce Harmony)
  const handleSelectWardrobe = async (wardrobe: WardrobeItem) => {
    setSelectedWardrobe(wardrobe);
    setStudioView('vto'); // Auto-switch canvas to VTO lookbook so user sees the clicked outfit immediately!
    try {
      const res = await fetch('/api/vto/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garment_id: wardrobe.id })
      });
      const vtoData = await res.json();
      if (vtoData?.success && vtoData.data) {
        setSelectedWardrobe(vtoData.data);
      }
    } catch {
      // keep selected
    }
  };


  // Gender Toggle (Men's vs Women's Luxury Collection)
  const handleSwitchGender = async (newGender: 'men' | 'women') => {
    setUserGender(newGender);
    const relevantWardrobes = wardrobes.filter(
      (w) => (!w.gender || w.gender === 'all' || w.gender === newGender) && (!w.events || w.events.includes(selectedEvent))
    );
    const topWardrobe = relevantWardrobes[0] || wardrobes.find((w) => !w.gender || w.gender === newGender);
    if (topWardrobe) {
      setSelectedWardrobe(topWardrobe);
    }
    try {
      const planRes = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: selectedEvent,
          days_remaining: daysRemaining,
          metrics: analysis?.metrics,
          preferred_wardrobe_id: topWardrobe?.id,
          gender: newGender
        })
      });
      const planData = await planRes.json();
      if (planData?.success) {
        setPlan(planData.data);
      }
    } catch (err) {
      console.warn('Gender switch plan update:', err);
    }
  };

  // Select Preload Model
  const handleSelectModel = (model: PersonaModel) => {
    setSelectedModel(model);
    setCustomImageFile(null);
    setCustomImagePreview(null);
    const gender = (model.gender as 'men' | 'women') || 'men';
    handleSwitchGender(gender);
  };


  // Upload Custom File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImageFile(file);
      setCustomImagePreview(url);
      setSelectedModel(null);
    }
  };

  // Webcam Controls
  const handleStopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const handleStartWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      setIsWebcamActive(false);
      alert('Camera access unavailable. You can upload a photo or use the preloaded demo models.');
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'webcam-face.jpg', { type: 'image/jpeg' });
          setCustomImageFile(file);
          setCustomImagePreview(dataUrl);
          setSelectedModel(null);
          handleStopWebcam();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#e6ca65', '#f59e0b', '#ec4899', '#34d399', '#ffffff']
    });
  };

  const handleExportPlan = () => {
    if (!plan) return;
    const textData = `
=========================================
EVENTGLOW AI — COUNTDOWN REGIMEN SUMMARY
=========================================
Event: ${plan.event_name} (${plan.days_remaining} Days Countdown)
Glow Readiness Index: ${plan.glow_readiness_index}% -> Projected: 95%
Selected Outfit: ${activeWardrobe.name} (${activeWardrobe.fabric})
Color Harmony: ${activeWardrobe.harmony_score}%

SAFE FABRICS: ${plan.fabric_compatibility_assessment.safe_fabrics.join(', ')}
RISK FABRICS: ${plan.fabric_compatibility_assessment.risk_fabrics.join(', ')}

DAILY CLINICAL PROTOCOL:
${plan.milestones.map((m) => `[${m.title}] -> Morning: ${m.morning_routine.join(' -> ')} | Evening: ${m.evening_routine.join(' -> ')}`).join('\n')}
=========================================
Powered by Perfect Corp YouCam AI
    `.trim();

    const blob = new Blob([textData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventglow-plan-${plan.event_type}.txt`;
    a.click();
  };

  const displayUserImage =
    customImagePreview || selectedModel?.image_url || models[0]?.image_url || '/test-samples/alex.jpg';

  const displayGlowImage =
    analysis?.transformed_glow_url ||
    selectedModel?.glow_image_url ||
    models.find((m) => m.id === selectedModel?.id)?.glow_image_url ||
    customImagePreview ||
    '/test-samples/alex-glow.jpg';

  const selectedMilestone = plan?.milestones?.[activeMilestoneDayIndex] || plan?.milestones?.[0];

  const metricList = analysis
    ? [
        { label: 'Hydration', data: analysis.metrics.moisture, icon: Droplets, color: 'text-sky-400' },
        { label: 'Radiance', data: analysis.metrics.radiance, icon: Sparkles, color: 'text-amber-300' },
        { label: 'Redness', data: analysis.metrics.redness, icon: Flame, color: 'text-rose-400' },
        { label: 'Under-Eye', data: analysis.metrics.dark_circles, icon: Eye, color: 'text-indigo-400' },
        { label: 'Pores', data: analysis.metrics.pores, icon: Disc, color: 'text-purple-400' },
        { label: 'Texture', data: analysis.metrics.texture, icon: Sun, color: 'text-emerald-400' },
        { label: 'Firmness', data: analysis.metrics.wrinkles, icon: Activity, color: 'text-teal-400' },
        { label: 'Sebum', data: analysis.metrics.oiliness, icon: Droplets, color: 'text-amber-400' },
        { label: 'Blemishes', data: analysis.metrics.acne, icon: ShieldAlert, color: 'text-red-400' }
      ]
    : [];

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#07080b] text-gray-100 flex flex-col font-['Plus_Jakarta_Sans'] select-none">
      {/* 1. ULTRA-SLIM LUXURY TOPBAR */}
      <header className="h-14 shrink-0 glass-panel border-b border-white/10 px-4 flex items-center justify-between gap-3 z-30">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e6ca65] via-[#f59e0b] to-[#ec4899] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-base font-bold gold-gradient-text m-0 font-['Outfit']">EventGlow AI</h1>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#e6ca65]/10 text-[#e6ca65] border border-[#e6ca65]/25">
              YouCam Studio
            </span>
          </div>
        </div>

        {/* Dynamic Event Selector Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          {EVENT_CONFIGS.map((evt) => {
            const Icon = evt.icon;
            const isSelected = selectedEvent === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => handleEventChange(evt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#e6ca65] text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title={evt.subtitle}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{evt.title}</span>
              </button>
            );
          })}
        </div>

        {/* Countdown Pill & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Days Dropdown/Pills */}
          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-xs">
            {TIMELINE_OPTIONS.map((days) => (
              <button
                key={days}
                onClick={() => handleDaysChange(days)}
                className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                  daysRemaining === days ? 'bg-[#e6ca65] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>

          {/* Quota Shield Indicator */}
          <div
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 ${
              status?.mock_mode
                ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            {status?.mock_mode ? <ShieldCheck className="w-3.5 h-3.5 text-[#e6ca65]" /> : <Zap className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden lg:inline">{status?.mock_mode ? 'Safe Shield (1,000 Safe)' : 'Live YouCam API'}</span>
          </div>

          <button
            onClick={handleToggleMode}
            disabled={isLoadingMode}
            className="p-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer transition-all"
            title="Toggle between Safe Mock and Live Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMode ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      {/* 2. MAIN COCKPIT VIEWPORT (Fills remaining height, zero page scroll) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* LEFT DOCK: Intake Studio & Controls (3 Cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col border-r border-white/10 bg-black/30 p-4 space-y-3.5 overflow-y-auto">
          {/* Persona / Model Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6ca65]">
                1. Persona & Face Intake
              </span>
              {/* Dual Gender Segmented Control */}
              <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => handleSwitchGender('men')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    userGender === 'men'
                      ? 'bg-[#e6ca65] text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Curate for Men"
                >
                  👔 Men
                </button>
                <button
                  onClick={() => handleSwitchGender('women')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    userGender === 'women'
                      ? 'bg-[#e6ca65] text-black shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Curate for Women"
                >
                  👗 Women
                </button>
              </div>
            </div>


            <div className="flex items-center gap-1.5">
              {models.map((model) => {
                const isSelected = selectedModel?.id === model.id && !customImagePreview;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model)}
                    className={`flex-1 p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#e6ca65]/15 border-[#e6ca65] shadow-md ring-1 ring-[#e6ca65]/40'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={model.image_url} alt={model.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-[10px] font-semibold text-gray-200 truncate w-full text-center">
                      {model.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              {/* Live / Uploaded Custom Face Persona */}
              {customImagePreview && (
                <button
                  onClick={() => setSelectedModel(null)}
                  className={`flex-1 p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    selectedModel === null
                      ? 'bg-[#e6ca65]/20 border-[#e6ca65] shadow-md ring-1 ring-[#e6ca65]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                  title="Your Custom Intake Face"
                >
                  <img
                    src={customImagePreview}
                    alt="You"
                    className="w-8 h-8 rounded-full object-cover border border-[#e6ca65]"
                  />
                  <span className="text-[10px] font-bold text-[#e6ca65] truncate w-full text-center">
                    You ★
                  </span>
                </button>
              )}
            </div>

            {/* Custom Photo / Camera Row */}
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  customImageFile && selectedModel === null
                    ? 'bg-[#e6ca65]/15 border-[#e6ca65] text-[#e6ca65] ring-1 ring-[#e6ca65]/40'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
              <button
                onClick={handleStartWebcam}
                className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  isWebcamActive
                    ? 'bg-[#e6ca65] text-black font-bold border-[#e6ca65] shadow-lg animate-pulse'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Webcam
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          {/* Trigger Scan Button */}
          <button
            onClick={runIntakeScan}
            disabled={isAnalyzing}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-black flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
              isAnalyzing
                ? 'bg-gradient-to-r from-amber-400 to-[#e6ca65] opacity-90 cursor-wait'
                : 'bg-gradient-to-r from-[#e6ca65] via-[#f59e0b] to-[#e6ca65] hover:scale-[1.02] active:scale-[0.98] ring-2 ring-[#e6ca65]/50 animate-pulse'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-black" />
                <span>Calibrating Biometrics ({scanProgressPercent}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Scan Face & Synthesize Look</span>
              </>
            )}
          </button>

          {/* Dynamic Event & Readiness Gauge */}
          {plan && (
            <div className="glass-panel rounded-xl p-3 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#e6ca65] font-bold truncate">{plan.event_name.split(' Ceremony')[0]}</span>
                <span className="font-extrabold text-white">{plan.glow_readiness_index}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#e6ca65] to-[#f59e0b] rounded-full transition-all duration-700"
                  style={{ width: `${plan.glow_readiness_index}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>Undertone: <strong className="text-emerald-300 capitalize">{analysis?.metrics.undertone}</strong></span>
                <span>Skin Age: <strong className="text-purple-300">{analysis?.metrics.skin_age} yrs</strong></span>
              </div>
            </div>
          )}

          {/* Curated Wardrobe List */}
          <div className="flex-1 min-h-0 flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#e6ca65]">
                2. Curated {userGender === 'men' ? "Men's" : "Women's"} Couture
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded-lg border border-white/10">
                  <button
                    onClick={() => handleSwitchGender('men')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      userGender === 'men' ? 'bg-[#e6ca65] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Switch to Men's Suits"
                  >
                    👔
                  </button>
                  <button
                    onClick={() => handleSwitchGender('women')}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      userGender === 'women' ? 'bg-[#e6ca65] text-black shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                    title="Switch to Women's Gowns"
                  >
                    👗
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 capitalize bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  {selectedEvent}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {currentWardrobesList.map((item) => {
                const isSelected = activeWardrobe?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectWardrobe(item)}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#e6ca65]/15 border-[#e6ca65] shadow-sm ring-1 ring-[#e6ca65]/40'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <img src={item.image_url} alt={item.name} className="w-10 h-12 rounded object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate m-0">{item.name}</h4>
                        <span className="text-[10px] font-bold text-[#e6ca65] shrink-0">{item.harmony_score}%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 m-0 truncate mt-0.5">{item.fabric}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER STAGE: High-Impact Visual Studio & Split-Slider (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 lg:p-4 bg-black/60 relative overflow-hidden">
          {/* Studio View Switcher */}
          <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10 mb-2 z-10 shadow-lg">
            <button
              onClick={() => {
                setStudioView('glow');
                setActiveHeatmap('none');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                studioView === 'glow' && activeHeatmap === 'none'
                  ? 'bg-gradient-to-r from-[#e6ca65] to-[#f59e0b] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Face Glow Transformation
            </button>
            <button
              onClick={() => setStudioView('vto')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                studioView === 'vto'
                  ? 'bg-gradient-to-r from-[#e6ca65] to-[#f59e0b] text-black shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              Event Couture (VTO)
            </button>
          </div>

          {/* Real YouCam Heatmap Diagnostic Selector Bar */}
          {studioView === 'glow' && analysis && (
            <div className="flex items-center gap-1 mb-2 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10">
              <span className="text-[10px] text-gray-400 mr-1 font-semibold flex items-center gap-1">
                <Activity className="w-3 h-3 text-[#e6ca65]" />
                YouCam Heatmaps:
              </span>
              {(['none', 'pore', 'redness', 'radiance', 'wrinkle'] as const).map((key) => {
                const labels: Record<string, string> = {
                  none: 'Clean Face',
                  pore: '🟣 Pores',
                  redness: '🔴 Redness',
                  radiance: '✨ Radiance',
                  wrinkle: '⚡ Wrinkles'
                };
                const isActive = activeHeatmap === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveHeatmap(key)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#e6ca65] text-black shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {labels[key]}
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Comparison Canvas */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black group select-none">
            {/* Live Camera View Mode */}
            {isWebcamActive ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />

                {/* Top Close / Cancel Button */}
                <button
                  onClick={handleStopWebcam}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 text-gray-300 hover:text-white hover:bg-black border border-white/20 transition-all z-20 cursor-pointer shadow-lg"
                  title="Close Camera"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Centered Biometric Framing Guide */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 pointer-events-none">
                  <div className="w-52 h-68 border-2 border-dashed border-[#e6ca65] rounded-[48%] animate-pulse shadow-[0_0_15px_rgba(230,202,101,0.3)]" />
                  <p className="text-[11px] text-[#e6ca65] bg-black/80 px-3 py-1 rounded-full mt-3 backdrop-blur-md border border-[#e6ca65]/30">
                    Center face inside oval for YouCam Clinical AI
                  </p>
                </div>

                {/* Bottom Capture / Cancel Actions */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                  <button
                    onClick={handleCaptureSnapshot}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#e6ca65] to-[#f59e0b] text-black font-bold text-xs shadow-lg hover:brightness-110 cursor-pointer flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Capture Face
                  </button>
                  <button
                    onClick={handleStopWebcam}
                    className="px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-gray-300 hover:text-white text-xs font-semibold border border-white/20 cursor-pointer transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : studioView === 'glow' ? (
              /* Before/After Split Comparison Slider (SAME PERSON GLOW TRANSFORMATION!) */
              <div
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
                className="relative w-full h-full cursor-ew-resize"
              >
                {/* Background Image: Day 14 Event Luminous Glow (SAME PERSON!) */}
                <img
                  src={displayGlowImage}
                  alt="Day 14 Event Look"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />

                {/* Foreground Image: Baseline Raw Face (Clipped via slider position) */}
                <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                  <img
                    src={displayUserImage}
                    alt="Current Face"
                    className="absolute inset-0 w-[420px] h-full object-cover object-top max-w-none"
                  />
                  {/* Real YouCam AI Cloud Diagnostic Heatmap (Clipped with baseline side) */}
                  {activeHeatmap !== 'none' && analysis?.overlay_masks?.[activeHeatmap] && (
                    <img
                      src={analysis.overlay_masks[activeHeatmap]}
                      alt={`${activeHeatmap} diagnostic heatmap`}
                      className="absolute inset-0 w-[420px] h-full object-cover object-top max-w-none mix-blend-screen opacity-90 pointer-events-none"
                    />
                  )}
                </div>

                {/* Split Handle Divider Line */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)] flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-7 h-7 rounded-full bg-black/90 backdrop-blur-md border border-[#e6ca65] text-[#e6ca65] flex items-center justify-center shadow-lg text-[10px] font-bold">
                    ↔
                  </div>
                </div>

                {/* Corner Badges */}
                <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-gray-300 border border-white/10">
                  {activeHeatmap !== 'none' ? `Day 1: ${activeHeatmap.toUpperCase()} Heatmap` : 'Day 1 Baseline Face'}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-[#e6ca65] border border-[#e6ca65]/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Day {daysRemaining} {selectedEvent.toUpperCase()} Glow
                </div>

                {/* Diagnostic Heatmap Indicator Label */}
                {activeHeatmap !== 'none' && (
                  <div className="absolute bottom-10 left-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#e6ca65]/40 text-[#e6ca65] text-[10px] font-bold z-10">
                    YouCam S2S Cloud Diagnostic: {activeHeatmap.toUpperCase()} Layer
                  </div>
                )}
              </div>

            ) : (
              /* Couture Virtual Try-On View */
              <div className="relative w-full h-full flex flex-col justify-end">
                <img
                  src={activeWardrobe?.try_on_result_url || activeWardrobe?.image_url}
                  alt={activeWardrobe?.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

                {/* Top Corner Badges for VTO View */}
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 z-10 shadow-lg">
                  <img src={displayUserImage} alt="User Face" className="w-5 h-5 rounded-full border border-[#e6ca65] object-cover" />
                  <span className="text-[10px] font-bold text-gray-200">{selectedModel?.name || 'Your Face'} Fitted</span>
                </div>
                <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#e6ca65]/30 flex items-center gap-1.5 z-10 shadow-lg">
                  <Crown className="w-3 h-3 text-[#e6ca65]" />
                  <span className="text-[10px] font-bold text-[#e6ca65] capitalize">{selectedEvent} Ready</span>
                </div>

                {/* Clean Bottom VTO Card Footer without Text Overlap */}
                <div className="relative p-4 space-y-1.5 z-10">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e6ca65]/20 border border-[#e6ca65]/40 text-[#e6ca65] text-[10px] font-bold">
                      <Crown className="w-3 h-3" />
                      YouCam VTO Precision Fitting • {activeWardrobe?.harmony_score}% Color Harmony
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="text-gray-300 hover:text-white flex items-center gap-1 text-[11px] bg-black/60 px-2 py-0.5 rounded-lg border border-white/15 cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      Inspect
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-white drop-shadow-md m-0">{activeWardrobe?.name}</h3>
                  <p className="text-[11px] text-gray-300 m-0 line-clamp-2">{activeWardrobe?.fabric_sensitivity_note}</p>
                </div>
              </div>
            )}

            {/* Cinematic Holographic Scanning Progress Overlay (Active during analysis) */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 z-30">
                {/* Scanner Laser Beam Sweep */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e6ca65] to-transparent shadow-[0_0_20px_#e6ca65] animate-laser-scan" />

                {/* Holographic Landmark Reticle Frame */}
                <div className="relative w-44 h-52 border border-[#e6ca65]/40 rounded-2xl flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    <span className="text-[8px] font-mono text-[#e6ca65]/70">[+] TRICHO</span>
                    <span className="text-[8px] font-mono text-[#e6ca65]/70">[+] TEMPORAL</span>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-10 h-10 rounded-full border border-dashed border-[#e6ca65]/60 animate-spin" />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[8px] font-mono text-[#e6ca65]/70">[+] NASION</span>
                    <span className="text-[8px] font-mono text-[#e6ca65]/70">[+] GNATHION</span>
                  </div>
                </div>

                {/* Stage Ticker */}
                <div className="text-center space-y-2 w-full max-w-[280px]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#e6ca65]">
                    <span className="truncate pr-2">{scanStepMessage}</span>
                    <span className="font-mono">{scanProgressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#e6ca65] via-[#f59e0b] to-[#ec4899] rounded-full transition-all duration-300 shadow-[0_0_10px_#e6ca65]"
                      style={{ width: `${scanProgressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 block">
                    {status?.mock_mode ? 'Engine: Safe Fixture Calibration (0 Credits Burned)' : 'Engine: Perfect Corp YouCam S2S Cloud AI'}
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Floating Bar on Canvas — ONLY rendered in Glow View to avoid text overlap */}
            {studioView === 'glow' && (
              <div className="absolute bottom-2 inset-x-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-300 truncate">
                  Day 1 Raw Face ↔ Day {daysRemaining} {selectedEvent.toUpperCase()} Glass-Skin Glow
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  Inspect
                </button>
              </div>
            )}
          </div>

          {/* Quick Mobile/Tablet Trigger Bar for Small Screens */}
          <div className="lg:hidden flex items-center gap-2 mt-3 w-full max-w-[420px]">
            <button
              onClick={() => {
                setActiveTab('diagnostics');
                setIsDrawerOpen(true);
              }}
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-200 cursor-pointer text-center"
            >
              Diagnostics ({analysis?.metrics.overall_score}%)
            </button>
            <button
              onClick={() => {
                setActiveTab('roadmap');
                setIsDrawerOpen(true);
              }}
              className="flex-1 py-2 rounded-xl bg-[#e6ca65]/15 border border-[#e6ca65]/30 text-xs font-bold text-[#e6ca65] cursor-pointer text-center"
            >
              {daysRemaining}d Protocol
            </button>
          </div>
        </div>

        {/* RIGHT DOCK: Clinical Diagnostics & Dynamic Roadmap Console (4 Cols) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col border-l border-white/10 bg-black/40 overflow-hidden">
          {/* Console Tab Selector */}
          <div className="flex border-b border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'roadmap'
                  ? 'border-[#e6ca65] text-[#e6ca65] bg-white/[0.02]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {daysRemaining}-Day {selectedEvent} Plan
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'diagnostics'
                  ? 'border-[#e6ca65] text-[#e6ca65] bg-white/[0.02]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Clinical Scan (9)
            </button>
            <button
              onClick={() => setActiveTab('fabric')}
              className={`flex-1 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 ${
                activeTab === 'fabric'
                  ? 'border-[#e6ca65] text-[#e6ca65] bg-white/[0.02]'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Fabric Guard
            </button>
          </div>

          {/* Console Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB 1: ROADMAP PROTOCOL */}
            {activeTab === 'roadmap' && plan && selectedMilestone && (
              <div className="space-y-4 animate-modal-pop">
                {/* Event Heading */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-sm font-bold text-white m-0 font-['Outfit']">{plan.event_name}</h3>
                    <p className="text-[11px] text-[#e6ca65] m-0">Target: {plan.days_remaining}-Day Progressive Turnaround</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Active Protocol
                  </span>
                </div>

                {/* Milestone Day Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {plan.milestones.map((m, idx) => (
                    <button
                      key={m.day_number}
                      onClick={() => setActiveMilestoneDayIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        activeMilestoneDayIndex === idx
                          ? 'bg-[#e6ca65] text-black shadow-sm'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      Day {m.day_number}
                    </button>
                  ))}
                </div>

                {/* Selected Day Card */}
                <div className="bg-black/50 border border-white/10 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white m-0 font-['Outfit']">
                      {selectedMilestone.title}
                    </h4>
                    <span className="text-[10px] font-bold text-[#e6ca65] uppercase">
                      {selectedMilestone.focus}
                    </span>
                  </div>

                  {/* Morning Routine */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Sun className="w-3 h-3" /> Morning Regimen
                    </span>
                    <ul className="text-[11px] text-gray-300 m-0 pl-3 space-y-1">
                      {selectedMilestone.morning_routine.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Evening Routine */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> Evening Regenerative
                    </span>
                    <ul className="text-[11px] text-gray-300 m-0 pl-3 space-y-1">
                      {selectedMilestone.evening_routine.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Warning */}
                  {selectedMilestone.warning_notes && (
                    <div className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/25 flex items-start gap-1.5 text-[10px] text-amber-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{selectedMilestone.warning_notes}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPlan}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export Regimen
                  </button>
                  <button
                    onClick={handleCelebrate}
                    className="flex-1 glow-btn py-2 px-3 rounded-lg text-xs font-bold text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3 h-3 text-black" /> Lock & Celebrate
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: DIAGNOSTICS */}
            {activeTab === 'diagnostics' && analysis && (
              <div className="space-y-3 animate-modal-pop">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">9-Parameter YouCam AI Scan:</span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10">
                    {analysis.source === 'youcam_live' ? '⚡ Live S2S' : '🛡️ Safe Fixture'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {metricList.map(({ label, data, icon: Icon, color }) => (
                    <div
                      key={label}
                      onClick={() => {
                        const mapKey = label.toLowerCase();
                        if (mapKey.includes('pore')) setActiveHeatmap('pore');
                        else if (mapKey.includes('redness')) setActiveHeatmap('redness');
                        else if (mapKey.includes('radiance')) setActiveHeatmap('radiance');
                        else if (mapKey.includes('firmness') || mapKey.includes('wrinkle')) setActiveHeatmap('wrinkle');
                        setStudioView('glow');
                      }}
                      className="bg-black/40 border border-white/10 hover:border-[#e6ca65]/50 rounded-lg p-2.5 space-y-1 cursor-pointer transition-all hover:bg-white/[0.04]"
                      title="Click to project YouCam Diagnostic Heatmap onto your face"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span>{label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400 group-hover:text-[#e6ca65] transition-colors">
                            Project ↗
                          </span>
                          <span className="text-xs font-bold font-['Outfit'] text-white">{data.score}%</span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
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
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#e6ca65] via-amber-400 to-[#f59e0b] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(230,202,101,0.4)]"
                          style={{ width: `${data.score}%` }}
                        />
                      </div>
                    </div>

                  ))}
                </div>

                {/* Clinical summary */}
                <div className="p-3 rounded-xl bg-[#e6ca65]/5 border border-[#e6ca65]/20 text-[11px] text-gray-300 leading-relaxed">
                  <strong className="text-[#e6ca65]">Diagnosis: </strong>
                  {analysis.summary}
                </div>
              </div>
            )}

            {/* TAB 3: FABRIC GUARD */}
            {activeTab === 'fabric' && plan && (
              <div className="space-y-3 animate-modal-pop">
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-1.5">
                  <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                    Anti-Return DermoCommerce Shield
                  </span>
                  <p className="text-[11px] text-purple-300/80 m-0 leading-relaxed">
                    {plan.fabric_compatibility_assessment.explanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs">
                    <strong className="text-emerald-300 block mb-0.5">✓ Safe Luxury Weaves:</strong>
                    <span className="text-gray-300 text-[11px]">
                      {plan.fabric_compatibility_assessment.safe_fabrics.join(' • ')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs">
                    <strong className="text-rose-300 block mb-0.5">✗ High-Friction Risk Fabrics:</strong>
                    <span className="text-gray-300 text-[11px]">
                      {plan.fabric_compatibility_assessment.risk_fabrics.join(' • ')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. MOBILE BOTTOM DRAWER (Sliding Sheet for phone/tablet) */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-modal-pop">
          <div className="glass-panel rounded-t-2xl border-t border-white/20 p-5 max-h-[80vh] flex flex-col space-y-4 animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white capitalize m-0">{activeTab} View</h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeTab === 'roadmap' ? 'bg-[#e6ca65] text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                Roadmap
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeTab === 'diagnostics' ? 'bg-[#e6ca65] text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                Diagnostics
              </button>
              <button
                onClick={() => setActiveTab('fabric')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                  activeTab === 'fabric' ? 'bg-[#e6ca65] text-black' : 'bg-white/5 text-gray-400'
                }`}
              >
                Fabric Guard
              </button>
            </div>

            <div className="overflow-y-auto flex-1 max-h-[50vh] pr-1">
              {activeTab === 'roadmap' && plan && selectedMilestone && (
                <div className="space-y-2 text-xs text-gray-300">
                  <h4 className="font-bold text-[#e6ca65] m-0">{selectedMilestone.title}</h4>
                  <p className="m-0 text-[11px]">{selectedMilestone.skin_status_projected}</p>
                </div>
              )}
              {activeTab === 'diagnostics' && analysis && (
                <div className="space-y-2">
                  {metricList.map(({ label, data, icon: Icon, color }) => (
                    <div key={label} className="flex items-center justify-between p-2 rounded-lg bg-black/40 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
                      </span>
                      <span className="font-bold text-[#e6ca65]">{data.score}%</span>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'fabric' && plan && (
                <div className="text-xs text-gray-300 leading-relaxed">
                  {plan.fabric_compatibility_assessment.explanation}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. ANIMATED INSPECTION MODAL (Desktop Detailed View) */}
      {isModalOpen && plan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-modal-pop">
          <div className="glass-panel-glow rounded-2xl max-w-2xl w-full p-6 border border-[#e6ca65]/40 space-y-5 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#e6ca65]" />
              <h3 className="text-lg font-bold text-white font-['Outfit'] m-0">
                {plan.event_name} • Full Studio Inspection
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-gray-400 block mb-1">Diagnosed Undertone:</span>
                <strong className="text-emerald-300 text-sm capitalize">{analysis?.metrics.undertone}</strong>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                <span className="text-gray-400 block mb-1">Selected Garment Drape:</span>
                <strong className="text-[#e6ca65] text-sm">{activeWardrobe.name}</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 leading-relaxed">
              <strong className="text-white block mb-1">Fabric Compatibility Advisory:</strong>
              {plan.fabric_compatibility_assessment.explanation}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleExportPlan}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-200 cursor-pointer"
              >
                Export Plan (.txt)
              </button>
              <button
                onClick={() => {
                  handleCelebrate();
                  setIsModalOpen(false);
                }}
                className="glow-btn px-5 py-2 rounded-xl text-xs font-bold text-black cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                Confirm & Rehearse Look
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
