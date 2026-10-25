import React, { useState, useRef } from 'react';
import { Camera, Upload, User, Scan, Sparkles, CheckCircle2 } from 'lucide-react';
import type { PersonaModel } from '../types';

interface FaceScannerStudioProps {
  models: PersonaModel[];
  selectedModel: PersonaModel | null;
  onSelectModel: (model: PersonaModel) => void;
  customImagePreview: string | null;
  onCustomImageSelected: (file: File, previewUrl: string) => void;
  isAnalyzing: boolean;
  onTriggerScan: () => void;
}

export const FaceScannerStudio: React.FC<FaceScannerStudioProps> = ({
  models,
  selectedModel,
  onSelectModel,
  customImagePreview,
  onCustomImageSelected,
  isAnalyzing,
  onTriggerScan
}) => {
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'camera'>('preset');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active display image
  const displayImage = customImagePreview || selectedModel?.image_url || models[0]?.image_url;

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onCustomImageSelected(file, url);
      setActiveTab('upload');
    }
  };

  // Start webcam
  const handleStartWebcam = async () => {
    try {
      setIsWebcamActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 640 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied or unavailable:', err);
      setIsWebcamActive(false);
      alert('Camera access unavailable. Using preloaded demo models.');
    }
  };

  // Capture photo from webcam
  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'webcam-capture.jpg', { type: 'image/jpeg' });
          onCustomImageSelected(file, dataUrl);
          // Stop stream
          const stream = videoRef.current?.srcObject as MediaStream;
          stream?.getTracks().forEach((track) => track.stop());
          setIsWebcamActive(false);
          setActiveTab('upload');
        }
      }, 'image/jpeg');
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#e6ca65]">
            <span className="w-6 h-6 rounded-full bg-[#e6ca65]/20 text-[#e6ca65] flex items-center justify-center text-xs">
              2
            </span>
            Step 2: Face & Skin Intake
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1 font-['Outfit'] m-0">
            Intake Persona or Live Camera Scan
          </h2>
        </div>

        {/* Input Method Switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('preset')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preset' ? 'bg-[#e6ca65] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            1-Click Models
          </button>
          <button
            onClick={() => {
              setActiveTab('upload');
              fileInputRef.current?.click();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'upload' ? 'bg-[#e6ca65] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
          <button
            onClick={() => {
              setActiveTab('camera');
              handleStartWebcam();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'camera' ? 'bg-[#e6ca65] text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Preloaded Persona Chips */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold m-0">
            Quick-Select Test Personas (Instant Zero-Friction Demo):
          </p>
          <div className="space-y-2.5">
            {models.map((model) => {
              const isSelected = selectedModel?.id === model.id && !customImagePreview;
              return (
                <div
                  key={model.id}
                  id={`model-card-${model.id}`}
                  onClick={() => {
                    onSelectModel(model);
                    setActiveTab('preset');
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#e6ca65]/10 border-[#e6ca65] shadow-lg shadow-[#e6ca65]/10 ring-1 ring-[#e6ca65]/40'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
                >
                  <img
                    src={model.image_url}
                    alt={model.name}
                    className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white m-0 truncate">{model.name}</h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#e6ca65] shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 m-0 mt-0.5 line-clamp-1">{model.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Scan Viewport & Laser Animation */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/60 group">
            {/* Live Camera View or Photo Preview */}
            {activeTab === 'camera' && isWebcamActive ? (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                <div className="absolute inset-0 flex flex-col items-center justify-between p-4 pointer-events-none">
                  <div className="w-52 h-64 border-2 border-dashed border-[#e6ca65]/80 rounded-[50%] animate-pulse" />
                  <p className="text-xs text-[#e6ca65] bg-black/80 px-3 py-1 rounded-full">
                    Align face inside the oval
                  </p>
                </div>
                <button
                  onClick={handleCaptureSnapshot}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#e6ca65] text-black font-bold text-xs shadow-lg cursor-pointer"
                >
                  Capture Face
                </button>
              </div>
            ) : (
              <img
                src={displayImage}
                alt="Selected persona"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
              />
            )}

            {/* Glowing Laser Scan Animation Beam */}
            {isAnalyzing && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#e6ca65] to-transparent shadow-[0_0_15px_#e6ca65] animate-[scan_2s_ease-in-out_infinite]" />
            )}

            {/* Scan Overlay Badge */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 flex items-center gap-1.5 text-[11px] text-gray-300">
              <Scan className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>YouCam Face Diagnostic Stream</span>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <button
            id="trigger-skin-analysis-btn"
            onClick={onTriggerScan}
            disabled={isAnalyzing}
            className="mt-5 w-full max-w-[380px] glow-btn py-3.5 px-6 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-black" />
                Analyzing via YouCam Skin AI...
              </>
            ) : (
              <>
                <Scan className="w-4 h-4 text-black" />
                Launch YouCam Diagnostic & VTO Protocol
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
