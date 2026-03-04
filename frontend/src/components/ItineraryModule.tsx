import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Calendar as CalendarIcon, X, List, LayoutGrid, MoreVertical } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { AddActivityModal } from "./AddActivityModal";

interface Activity {
  id: string;
  title: string;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  location: string;
  description: string;
  category: string;
  date: string; // "YYYY-MM-DD"
}

export function ItineraryModule() {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [baseDate, setBaseDate] = useState(new Date("2026-08-10"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: "1",
      title: "Breakfast at Oia",
      startTime: "09:00",
      endTime: "10:30",
      location: "Oia Village Center",
      description: "Traditional Greek breakfast with a view.",
      category: "Food",
      date: "2026-08-11"
    },
    {
      id: "2",
      title: "Sunset Catamaran Cruise",
      startTime: "14:00",
      endTime: "19:00",
      location: "Amoudi Bay",
      description: "5-hour cruise around the volcanic islands.",
      category: "Travel",
      date: "2026-08-11"
    },
    {
      id: "overlap-1",
      title: "Photography Workshop",
      startTime: "15:00",
      endTime: "16:30",
      location: "Oia Cliffs",
      description: "Capture the perfect golden hour shots.",
      category: "Adventure",
      date: "2026-08-11"
    },
    {
        id: "overlap-2",
        title: "Wine Tasting Tour",
        startTime: "16:00",
        endTime: "18:00",
        location: "Santo Winery",
        description: "Taste local wines while watching the sunset.",
        category: "Food",
        date: "2026-08-11"
      }
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      return date;
    });
  }, [baseDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const navigateWeek = (weeks: number) => {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + weeks * 7);
    setBaseDate(nextDate);
  };

  const calculatePosition = (startTime: string, endTime: string, overlapIndex = 0, totalOverlap = 1) => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    const startPos = startH * 60 + startM;
    const duration = (endH * 60 + endM) - startPos;
    
    return {
      top: `${(startPos / 60) * 80}px`, // 80px per hour
      height: `${(duration / 60) * 80}px`,
      width: `${100 / totalOverlap}%`,
      left: `${(100 / totalOverlap) * overlapIndex}%`
    };
  };

  const getOverlapData = (dayActivities: Activity[]) => {
    const sorted = [...dayActivities].sort((a, b) => a.startTime.localeCompare(b.startTime));
    const groups: Activity[][] = [];
    sorted.forEach(activity => {
      let inserted = false;
      for (const group of groups) {
        const hasOverlap = group.some(a => (activity.startTime < a.endTime && activity.endTime > a.startTime));
        if (hasOverlap) {
          group.push(activity);
          inserted = true;
          break;
        }
      }
      if (!inserted) groups.push([activity]);
    });
    const result = new Map<string, { index: number, total: number }>();
    groups.forEach(group => group.forEach((activity, index) => result.set(activity.id, { index, total: group.length })));
    return result;
  };

  const timeIndicatorPos = useMemo(() => {
    const h = currentTime.getHours();
    const m = currentTime.getMinutes();
    return (h * 60 + m) / 60 * 80;
  }, [currentTime]);

  const handleCreateActivity = (newActivity: Activity) => {
    setActivities([...activities, newActivity]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* View Toggle & Navigation Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-slate-100 rounded-2xl p-1">
            <button 
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={14} /> Calendar
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={14} /> List View
            </button>
          </div>

          <div className="flex items-center bg-slate-50 rounded-2xl p-1">
            <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500">
              <ChevronRight size={20} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-slate-900 hidden sm:block">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h3>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} /> Add Activity
        </button>
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-[700px]">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <div className="w-16 shrink-0" />
            {weekDates.map(date => (
              <div key={date.toISOString()} className="flex-1 py-4 text-center border-l border-slate-100 first:border-l-0">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <p className={`text-sm font-bold mt-1 ${date.toDateString() === new Date().toDateString() ? 'text-primary' : 'text-slate-900'}`}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <div className="flex relative min-h-[1920px]">
              {/* Current Time Indicator Line */}
              <div className="absolute left-16 right-0 z-30 pointer-events-none" style={{ top: `${timeIndicatorPos}px` }}>
                <div className="w-full border-t border-red-400 relative">
                  <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-400 rounded-full border-2 border-white shadow-sm" />
                </div>
              </div>

              <div className="w-16 shrink-0 bg-white sticky left-0 z-20 border-r border-slate-50">
                {hours.map(hour => (
                  <div key={hour} className="h-[80px] pr-2 text-right">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block pt-1">
                      {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                    </span>
                  </div>
                ))}
              </div>

              {weekDates.map(date => {
                const dateStr = date.toISOString().split('T')[0];
                const dayActivities = activities.filter(a => a.date === dateStr);
                const overlapMap = getOverlapData(dayActivities);

                return (
                  <div key={dateStr} className="flex-1 border-l border-slate-50 relative group/col">
                    {hours.map(hour => <div key={hour} className="h-[80px] border-t border-slate-50/50 w-full" />)}
                    {dayActivities.map(activity => {
                      const overlap = overlapMap.get(activity.id) || { index: 0, total: 1 };
                      const pos = calculatePosition(activity.startTime, activity.endTime, overlap.index, overlap.total);
                      return (
                        <div 
                          key={activity.id}
                          onClick={() => setSelectedActivity(activity)}
                          className="absolute rounded-xl bg-blue-50/90 border-l-[3px] border-l-primary p-2 shadow-sm cursor-pointer hover:bg-blue-100 transition-all z-10 group/card overflow-hidden"
                          style={{ ...pos }}
                        >
                          <p className="text-[9px] font-black text-primary uppercase tracking-tighter truncate">{activity.startTime} - {activity.endTime}</p>
                          <h4 className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-2 mt-0.5">{activity.title}</h4>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-6">
          {weekDates.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayActivities = activities.filter(a => a.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));
            if (dayActivities.length === 0) return null;

            return (
              <section key={dateStr} className="relative pl-8">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-blue-50/50 absolute top-0" />
                </div>
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-3">
                  {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                <div className="space-y-3">
                  {dayActivities.map(activity => (
                    <div 
                      key={activity.id}
                      onClick={() => setSelectedActivity(activity)}
                      className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-primary transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-primary transition-colors">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">{activity.startTime} — {activity.endTime}</p>
                          <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{activity.title}</h4>
                          <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                            <MapPin size={12} />
                            <span className="text-xs font-medium">{activity.location}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-slate-600">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Add & Detail Modals remain same but use selectedActivity state */}
      <AddActivityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateActivity} defaultDate={baseDate.toISOString().split('T')[0]} />

      {selectedActivity && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)} />
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 p-8">
            <button onClick={() => setSelectedActivity(null)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-primary"><CalendarIcon size={24} /></div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">{selectedActivity.category}</span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{selectedActivity.title}</h3>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><Clock size={18} className="text-slate-400" /></div><div><p className="text-sm font-bold text-slate-900">{selectedActivity.startTime} — {selectedActivity.endTime}</p><p className="text-xs font-medium text-slate-400">Scheduled time</p></div></div>
              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><MapPin size={18} className="text-slate-400" /></div><div><p className="text-sm font-bold text-slate-900">{selectedActivity.location}</p><p className="text-xs font-medium text-slate-400">Location</p></div></div>
              {selectedActivity.description && <div className="mt-8 pt-6 border-t border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description / Notes</p><p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedActivity.description}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
