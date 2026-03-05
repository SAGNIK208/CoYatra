import { Users, Mail, ShieldCheck, Shield, Plus, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { ContributionsModal } from "./ContributionsModal";
import { tripService } from "../lib/tripService";

interface Member {
  name: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  avatar: string;
  email: string;
  clerkId: string;
}

export function MembersModule({ 
  members: rawMembers, 
  onInvite,
  tripId,
  currentUserRole,
  onMemberRemoved
}: { 
  members: any[]; 
  onInvite?: () => void;
  tripId?: string;
  currentUserRole?: 'OWNER' | 'EDITOR' | 'VIEWER';
  onMemberRemoved?: () => void;
}) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const members: Member[] = rawMembers?.map(m => ({
    name: m.user?.name || 'Unknown',
    role: (m.role.charAt(0).toUpperCase() + m.role.slice(1).toLowerCase()) as any,
    avatar: (m.user?.name || '?')[0].toUpperCase(),
    email: m.user?.email || '',
    clerkId: m.user?.clerkId || ''
  })) || [];

  const handleViewContrib = (member: Member) => {
    setSelectedMember(member);
    setIsContribModalOpen(true);
  };

  const handleDeleteMember = async (memberClerkId: string) => {
    if (!tripId || !onMemberRemoved) return;
    try {
      setDeletingId(memberClerkId);
      await tripService.removeMember(tripId, memberClerkId);
      onMemberRemoved();
    } catch (error) {
      console.error("Failed to remove member", error);
      alert("Failed to remove member. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-bold text-slate-900">Trip Members</h3>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{members.length} Total</span>
        </div>
        {onInvite && (
          <button 
            onClick={onInvite}
            className="flex items-center gap-2 bg-primary hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            <Plus size={16} />
            Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, i) => (
          <div key={i} className="card bg-white shadow-sm hover:shadow-md transition-all border-border relative group p-6 rounded-2xl">
            {/* Delete Option */}
            {currentUserRole === 'OWNER' && member.role !== 'Owner' && (
              <button 
                onClick={() => handleDeleteMember(member.clerkId)}
                disabled={deletingId === member.clerkId}
                title="Remove Member"
                className="absolute right-4 top-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
              >
                {deletingId === member.clerkId ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>
            )}
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-black text-primary ring-4 ring-blue-50">
                {member.avatar}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 break-words">{member.name}</h4>
                <div className="flex items-center gap-1.5 text-slate-500">
                  {member.role === 'Owner' ? (
                    <ShieldCheck size={14} className="text-blue-600" />
                  ) : (
                    <Shield size={14} className="text-slate-400" />
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    member.role === 'Owner' ? 'text-blue-600' : 'text-slate-500'
                  }`}>
                    {member.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Mail size={14} />
                </div>
                <p className="text-xs font-medium truncate">{member.email}</p>
              </div>
              <div className="flex items-center gap-3 text-slate-500">
                <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                  <Users size={14} />
                </div>
                <p className="text-xs font-medium">Joined Trip</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-50 flex gap-2">
              <button 
                onClick={() => handleViewContrib(member)}
                className="flex-1 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 uppercase tracking-widest"
              >
                View Contributions
              </button>
            </div>
          </div>
        ))}

      </div>

      {selectedMember && (
        <ContributionsModal 
          isOpen={isContribModalOpen}
          onClose={() => setIsContribModalOpen(false)}
          memberName={selectedMember.name}
          avatar={selectedMember.avatar}
        />
      )}
    </div>
  );
}
