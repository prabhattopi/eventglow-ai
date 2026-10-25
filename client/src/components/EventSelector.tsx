import React from 'react';
import { Crown, Sparkles, Mic, Briefcase, Wine, Calendar } from 'lucide-react';

export type EventType = 'wedding' | 'gala' | 'keynote' | 'interview' | 'datenight';

interface EventSelectorProps {
  selectedEvent: EventType;
  onSelectEvent: (event: EventType) => void;
  daysRemaining: number;
  onChangeDays: (days: number) => void;
}

const EVENTS: { id: EventType; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
  {
    id: 'wedding',
    title: 'Royal Wedding',
    subtitle: 'Ceremony & Grand Reception',
    icon: Crown
  },
  {
    id: 'gala',
    title: 'Charity Gala',
    subtitle: 'Black-Tie & Red Carpet Dinner',
    icon: Sparkles
  },
  {
    id: 'keynote',
    title: 'Tech Keynote',
    subtitle: 'Stage Lights & HD Broadcast',
    icon: Mic
  },
  {
    id: 'interview',
    title: 'Board Interview',
    subtitle: 'Executive Leadership Panel',
    icon: Briefcase
  },
  {
    id: 'datenight',
    title: 'Anniversary Dinner',
    subtitle: 'Candlelit Intimate Romance',
    icon: Wine
  }
];

const TIMELINES = [5, 7, 14, 21, 30];

export const EventSelector: React.FC<EventSelectorProps> = ({
  selectedEvent,
  onSelectEvent,
  daysRemaining,
  onChangeDays
}) => {
  return (
    <section className="glass-panel rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#e6ca65]">
            <span className="w-6 h-6 rounded-full bg-[#e6ca65]/20 text-[#e6ca65] flex items-center justify-center text-xs">
              1
            </span>
            Step 1: Event Context & Timeline
          </div>
          <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white mt-1 font-['Outfit'] m-0">
            Select Your Target Milestone
          </h2>
        </div>

        {/* Countdown Timeline Selector */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
          <Calendar className="w-4 h-4 text-[#e6ca65] ml-2 shrink-0" />
          <span className="text-xs text-gray-400 font-medium mr-1">Countdown:</span>
          {TIMELINES.map((days) => (
            <button
              key={days}
              id={`timeline-days-${days}`}
              onClick={() => onChangeDays(days)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                daysRemaining === days
                  ? 'bg-gradient-to-r from-[#e6ca65] to-[#c49a2c] text-black shadow-md shadow-[#e6ca65]/30 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {EVENTS.map((event) => {
          const IconComponent = event.icon;
          const isSelected = selectedEvent === event.id;

          return (
            <button
              key={event.id}
              id={`event-card-${event.id}`}
              onClick={() => onSelectEvent(event.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 group relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-[#e6ca65]/15 to-transparent border-[#e6ca65] shadow-lg shadow-[#e6ca65]/10 ring-1 ring-[#e6ca65]/50'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#e6ca65]/30 to-transparent pointer-events-none rounded-bl-2xl" />
              )}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[#e6ca65] text-black shadow-md' : 'bg-white/5 text-gray-300 group-hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>

              <div>
                <h3 className={`text-sm font-semibold m-0 transition-colors ${isSelected ? 'text-[#e6ca65]' : 'text-gray-200'}`}>
                  {event.title}
                </h3>
                <p className="text-[11px] text-gray-400 m-0 mt-0.5 line-clamp-1">{event.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
