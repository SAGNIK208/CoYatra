import { useNavigate, useParams } from "react-router-dom";
import { Plane, Users, Calendar, MapPin, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { inviteService } from "../lib/inviteService";
import logo from "../assets/logo.jpg";

export function JoinTripPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!inviteCode) return;
      try {
        const data = await inviteService.getDetails(inviteCode);
        setTripData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Invalid or expired invite link");
      } finally {
        setLoading(false);
      }
    };

    fetchInviteDetails();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!inviteCode) return;
    setJoining(true);
    setError(null);
    try {
      const res = await inviteService.join(inviteCode);
      navigate(`/trips/${res.tripId || tripData?.trip?._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to join trip");
      setJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex items-center gap-2">
        <img src={logo} alt="CoYatra" className="h-10 w-10 rounded-xl" />
        <span className="text-2xl font-bold text-primary tracking-tight">CoYatra</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Plane size={40} className="text-primary" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-slate-500 font-medium">Verifying invite link...</p>
          </div>
        ) : error && !tripData ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-red-50 rounded-full text-red-500 mb-2">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Link</h1>
            <p className="text-red-500 font-medium text-center px-4">{error}</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        ) : tripData ? (
          <>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
            <p className="text-slate-500 mb-8">
              <span className="font-bold text-slate-700">{tripData.owner}</span> has invited you to join their trip to <span className="font-bold text-slate-700">{tripData.trip?.destination}</span>.
            </p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl border border-red-100 flex items-center justify-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4 text-left border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm ring-1 ring-slate-100">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                  <p className="font-bold text-slate-900">{tripData.trip?.destination}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm ring-1 ring-slate-100">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dates</p>
                  <p className="font-bold text-slate-900 text-sm">
                    {DateTime.fromISO(tripData.trip?.startDateTime).setZone(tripData.trip?.timezone || 'UTC').toFormat("MMM d")} — {DateTime.fromISO(tripData.trip?.endDateTime).setZone(tripData.trip?.timezone || 'UTC').toFormat("MMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg text-primary shadow-sm ring-1 ring-slate-100">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Role</p>
                  <p className="font-bold text-slate-900 capitalize">{tripData.role.toLowerCase()}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleJoin}
              disabled={joining}
              className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-3 h-[60px] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all font-bold"
            >
              {joining ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <>
                  <span>Accept & Join Trip</span>
                  <Plane size={20} className="rotate-45" />
                </>
              )}
            </button>
            
            <p className="mt-6 text-xs text-slate-400 font-medium">
              Invite token: <span className="font-mono text-slate-500">{inviteCode}</span>
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}
