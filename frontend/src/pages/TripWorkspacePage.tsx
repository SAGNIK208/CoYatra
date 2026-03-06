import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  Wallet, 
  CheckSquare, 
  FileText, 
  Users, 
  ChevronLeft,
  Settings,
  Image,
  PartyPopper
} from "lucide-react";
import logo from "../assets/logo.jpg";
import { UserButton } from "@clerk/clerk-react";
import { BudgetModule } from "../components/BudgetModule";
import { ChecklistModule } from "../components/ChecklistModule";
import { MembersModule } from "../components/MembersModule";
import { FilesModule } from "../components/FilesModule";
import { InviteModal } from "../components/InviteModal";
import { ItineraryModule } from "../components/ItineraryModule";
import { TripSettingsModule } from "../components/TripSettingsModule";
import { tripService } from "../lib/tripService";

export function TripWorkspacePage() {
  const { id: _id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'checklist' | 'files' | 'members' | 'settings' | 'memories'>('itinerary');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [trip, setTrip] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!_id) return;
      try {
        const data = await tripService.getById(_id);
        setTrip(data);
      } catch (error) {
        console.error("Error fetching trip:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [_id]);

  const navItems = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'memories', label: 'Memories', icon: Image },
    { id: 'members', label: 'Members', icon: Users },
    ...(trip?.role === 'OWNER' ? [{ id: 'settings', label: 'Settings', icon: Settings }] : []),
  ];

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading workspace...</div>;
  if (!trip) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Trip not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-border flex items-center px-4 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="CoYatra" className="h-8 w-8 rounded-md" />
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 leading-tight">{trip?.title || 'Trip Details'}</h1>
              <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                {trip?.startDateTime ? DateTime.fromISO(trip.startDateTime).setZone(trip.timezone).toFormat('MMM d') : '...'} — {trip?.endDateTime ? DateTime.fromISO(trip.endDateTime).setZone(trip.timezone).toFormat('MMM d, yyyy') : '...'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4 overflow-hidden">
            {trip.members?.map((m: any, i: number) => (
              <div 
                key={i} 
                onClick={() => setActiveTab('members')}
                className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-slate-100 cursor-pointer hover:ring-primary transition-all shrink-0" 
                title={m.user?.name || 'Member'}
              >
                {(m.user?.name || '?')[0].toUpperCase()}
              </div>
            ))}
          </div>
          {trip?.role !== 'VIEWER' && (
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-primary hover:bg-blue-700 text-white text-[10px] font-bold px-4 py-2 rounded-lg transition-all shadow-sm"
            >
              Invite
            </button>
          )}
          <div className="h-8 w-[1px] bg-border mx-2" />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Workspace Sidebar */}
        <aside className="w-64 bg-white border-r border-border p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md font-medium text-sm transition-all
                ${activeTab === item.id 
                  ? 'bg-blue-50 text-primary shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-primary' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{activeTab}</h2>
            </div>

            {activeTab === 'itinerary' && <ItineraryModule tripId={_id!} />}
            {activeTab === 'budget' && <BudgetModule tripId={_id!} />}
            {activeTab === 'checklist' && <ChecklistModule tripId={_id!} members={trip.members} />}
            {activeTab === 'members' && (
              <MembersModule 
                members={trip.members} 
                onInvite={trip?.role !== 'VIEWER' ? () => setIsInviteModalOpen(true) : undefined}
                tripId={_id!}
                currentUserRole={trip.role as any}
                onMemberRemoved={() => {
                  // Re-fetch trip to get updated members
                  tripService.getById(_id!).then(data => setTrip(data));
                }}
              />
            )}
            {activeTab === 'files' && <FilesModule tripId={_id!} />}
            {activeTab === 'memories' && (
              <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <PartyPopper size={40} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Memories</h3>
                <p className="text-slate-500 max-w-md">Our magical photo galleries and shared albums are coming soon to the CoYatra UI! Stay tuned for updates.</p>
              </div>
            )}
            {activeTab === 'settings' && trip?.role === 'OWNER' && (
              <TripSettingsModule 
                trip={trip} 
                onUpdate={(updated) => setTrip((prev: any) => ({ ...prev, ...updated }))} 
              />
            )}
          </div>
        </main>
      </div>

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        tripTitle={trip.title}
        tripId={_id!}
      />
    </div>
  );
}
