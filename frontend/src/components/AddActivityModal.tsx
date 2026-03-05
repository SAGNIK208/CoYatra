import { X, Calendar, Clock, MapPin, Tag, AlignLeft, Plane } from "lucide-react";
import { useState } from "react";
import { DateTime } from "luxon";

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (activity: any) => void;
  defaultDate?: string;
  tripStartDate: string;
  tripEndDate: string;
  tripTimezone: string;
  initialData?: any; // When set, modal works in edit mode
}

export function AddActivityModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  defaultDate, 
  tripStartDate, 
  tripEndDate,
  tripTimezone,
  initialData,
}: AddActivityModalProps) {
  const isEditMode = !!initialData;
  const [title, setTitle] = useState(initialData?.title || "");
  const [date, setDate] = useState(initialData?.date || defaultDate || tripStartDate);
  const [startTime, setStartTime] = useState(initialData?.startTime || "09:00");
  const [endTime, setEndTime] = useState(initialData?.endTime || "10:00");
  const [location, setLocation] = useState(initialData?.location || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "Other");
  const [subType, setSubType] = useState(initialData?.subType || "");
  const [error, setError] = useState<string | null>(null);

  const formatDDMMYYYY = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const CATEGORY_TO_TYPE: Record<string, string> = {
    "Adventure": "OTHER",
    "Food": "FOOD",
    "Relaxation": "OTHER",
    "Culture": "VISIT",
    "Travel": "TRAVEL",
    "Sightseeing": "VISIT",
    "Other": "OTHER"
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Activity title is required");
      return;
    }

    const selectedDate = new Date(date);
    const start = new Date(tripStartDate);
    const end = new Date(tripEndDate);

    // Normalize to dates only for comparison
    const normSelected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const normStart = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const normEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    if (normSelected < normStart || normSelected > normEnd) {
      setError(`Date must be between ${formatDDMMYYYY(tripStartDate)} and ${formatDDMMYYYY(tripEndDate)}`);
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    // Generate UTC ISO strings using the trip's timezone
    const startISO = DateTime.fromFormat(`${date} ${startTime}`, "yyyy-MM-dd HH:mm", { zone: tripTimezone }).toUTC().toISO();
    const endISO = DateTime.fromFormat(`${date} ${endTime}`, "yyyy-MM-dd HH:mm", { zone: tripTimezone }).toUTC().toISO();

    onCreate({
      id: initialData?.id || Date.now().toString(),
      title,
      date,
      startTime,
      endTime,
      location,
      description,
      category,
      type: CATEGORY_TO_TYPE[category] || "OTHER",
      subType: category === "Travel" ? subType : undefined,
      startDateTime: startISO,
      endDateTime: endISO,
      timezone: tripTimezone
    });

    setTitle("");
    setLocation("");
    setDescription("");
    setSubType("");
    onClose();
  };

  const categories = ["Adventure", "Food", "Relaxation", "Culture", "Travel", "Sightseeing", "Other"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-xl text-primary">
              <Calendar size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">{isEditMode ? "Edit Activity" : "Add Activity"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <input 
              autoFocus
              type="text"
              placeholder="Activity Title (e.g., Morning Surf Lesson)"
              className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-primary outline-none transition-all text-xl font-bold text-slate-900 placeholder:text-slate-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Date
              </label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag size={12} /> Category
              </label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M3.5%205.25L7%208.75L10.5%205.25%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_1rem_center] bg-no-repeat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> Start Time
              </label>
              <input 
                type="time"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} /> End Time
              </label>
              <input 
                type="time"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} /> Location
            </label>
            <input 
              type="text"
              placeholder="Add address or landmark"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          {category === "Travel" && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Plane size={12} /> Travel Type
              </label>
              <input 
                type="text"
                placeholder="e.g. Flight LX161, Eurostar, Uber"
                className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft size={12} /> Notes
            </label>
            <textarea 
              rows={3}
              placeholder="What's the plan? Any reservation numbers?"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-300 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 mt-4"
          >
            {isEditMode ? "Save Changes" : "Create Activity"}
          </button>
        </form>
      </div>
    </div>
  );
}
