import { useNavigate, useParams } from "react-router-dom";
import { Plane, Users, Calendar, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.jpg";

export function JoinTripPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Mock invited trip data
  const trip = {
    title: "Alpine Adventure",
    destination: "Zermatt, Switzerland",
    dates: "Dec 15 - Dec 22, 2026",
    owner: "Sagnik Guru",
    memberCount: 2
  };

  const handleJoin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
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

        <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Invited!</h1>
        <p className="text-slate-500 mb-8">
          {trip.owner} has invited you to join their trip to {trip.destination}.
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Destination</p>
              <p className="font-semibold text-slate-900">{trip.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Dates</p>
              <p className="font-semibold text-slate-900">{trip.dates}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-primary shadow-sm">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Current Group</p>
              <p className="font-semibold text-slate-900">{trip.memberCount} members</p>
            </div>
          </div>
        </div>

        <button 
          onClick={handleJoin}
          disabled={loading}
          className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-3 h-[60px]"
        >
          {loading ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <>
              <span>Join Trip</span>
              <Plane size={20} className="rotate-45" />
            </>
          )}
        </button>
        
        <p className="mt-6 text-sm text-slate-400">
          Trip Invite Code: <span className="font-mono text-slate-600">{inviteCode}</span>
        </p>
      </div>
    </div>
  );
}
