import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Calendar, 
  Wallet, 
  CheckSquare, 
  FileText, 
  Users, 
  ChevronLeft
} from "lucide-react";
import logo from "../assets/logo.jpg";
import { UserButton } from "@clerk/clerk-react";
import { BudgetModule } from "../components/BudgetModule";
import { ChecklistModule } from "../components/ChecklistModule";
import { MembersModule } from "../components/MembersModule";
import { FilesModule } from "../components/FilesModule";
import { InviteModal } from "../components/InviteModal";
import { ItineraryModule } from "../components/ItineraryModule";

export function TripWorkspacePage() {
  const { id: _id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'checklist' | 'files' | 'members'>('itinerary');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Mock Trip Data
  const trip = {
    title: "Summer in Santorini",
    dates: "Aug 10 - Aug 20, 2026",
    members: [
      { name: "Sagnik", role: "Owner", avatar: "S", email: "sagnik@example.com" },
      { name: "John", role: "Editor", avatar: "J", email: "john@example.com" },
      { name: "Elena", role: "Viewer", avatar: "E", email: "elena@example.com" },
    ]
  };

  const navItems = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'members', label: 'Members', icon: Users },
  ];

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
              <h1 className="text-sm font-bold text-slate-900 leading-tight">{trip.title}</h1>
              <span className="text-[10px] text-slate-500 font-medium">{trip.dates}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2 mr-4">
            {trip.members.map((m, i) => (
              <div 
                key={i} 
                onClick={() => setActiveTab('members')}
                className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-slate-100 cursor-pointer hover:ring-primary transition-all" 
                title={m.name}
              >
                {m.avatar}
              </div>
            ))}
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="btn-primary text-xs px-4 py-2"
          >
            Invite
          </button>
          <div className="h-8 w-[1px] bg-border mx-2" />
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Workspace Sidebar */}
        <aside className="w-64 bg-white border-r border-border p-4 flex flex-col gap-2">
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
              <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h2>
            </div>

            {activeTab === 'itinerary' && <ItineraryModule />}
            {activeTab === 'budget' && <BudgetModule />}
            {activeTab === 'checklist' && <ChecklistModule />}
            {activeTab === 'members' && <MembersModule />}
            {activeTab === 'files' && <FilesModule />}
          </div>
        </main>
      </div>

      <InviteModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        tripTitle={trip.title}
      />
    </div>
  );
}
