import { useState } from "react";
import { DateTime } from "luxon";
import { Save, Image as ImageIcon, Calendar, MapPin, AlignLeft, Trash2 } from "lucide-react";
import { tripService } from "../lib/tripService";
import { useNavigate } from "react-router-dom";

interface TripSettingsModuleProps {
  trip: any;
  onUpdate: (updatedTrip: any) => void;
}

export function TripSettingsModule({ trip, onUpdate }: TripSettingsModuleProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(trip.title);
  const [description, setDescription] = useState(trip.description || "");
  const [location, setLocation] = useState(trip.location || "");
  const [startDateTime, setStartDateTime] = useState(trip.startDateTime ? DateTime.fromISO(trip.startDateTime).setZone(trip.timezone).toFormat('yyyy-MM-dd') : "");
  const [endDateTime, setEndDateTime] = useState(trip.endDateTime ? DateTime.fromISO(trip.endDateTime).setZone(trip.timezone).toFormat('yyyy-MM-dd') : "");
  const [imageUrl, setImageUrl] = useState(trip.imageUrl || "");
  const [timezone, setTimezone] = useState(trip.timezone || "UTC");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert to UTC ISO using trip's selected timezone
      const startISO = DateTime.fromISO(startDateTime, { zone: timezone }).startOf('day').toUTC().toISO();
      const endISO = DateTime.fromISO(endDateTime, { zone: timezone }).endOf('day').toUTC().toISO();

      const updatedData = {
        title,
        description,
        location,
        startDateTime: startISO,
        endDateTime: endISO,
        imageUrl,
        timezone
      };
      const updatedTrip = await tripService.update(trip.id || trip._id, updatedData);
      onUpdate(updatedTrip);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error updating trip:", err);
      setError(err.response?.data?.error || "Failed to update trip details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip? This action cannot be undone.")) return;
    
    try {
      await tripService.delete(trip.id || trip._id);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error deleting trip:", err);
      alert("Failed to delete trip.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Trip Details</h3>
          <p className="text-sm text-slate-500 mt-1">Update your trip information and preferences.</p>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-sm font-medium">
              Trip updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Trip Title
            </label>
            <input 
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> Start Date
              </label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={12} /> End Date
              </label>
              <input 
                type="date"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} /> Location
            </label>
            <input 
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Switzerland"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Timezone
            </label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M3.5%205.25L7%208.75L10.5%205.25%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_1rem_center] bg-no-repeat"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              {(Intl as any).supportedValuesOf('timeZone').map((tz: string) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={12} /> Trip Cover Photo (URL)
            </label>
            <div className="flex gap-4">
              <input 
                type="text"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-700"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
              {imageUrl && (
                <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <AlignLeft size={12} /> Description
            </label>
            <textarea 
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium text-slate-700 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us more about this trip..."
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button 
              type="button"
              onClick={handleDelete}
              className="px-6 py-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all flex items-center gap-2"
            >
              <Trash2 size={18} /> Delete Trip
            </button>
            <button 
              type="submit"
              disabled={isSaving}
              className="px-8 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
