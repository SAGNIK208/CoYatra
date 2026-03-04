import { Users, Mail, Shield, ShieldCheck, MoreVertical } from "lucide-react";
import { useState } from "react";
import { ContributionsModal } from "./ContributionsModal";

interface Member {
  name: string;
  role: 'Owner' | 'Editor' | 'Viewer';
  avatar: string;
  email: string;
}

export function MembersModule() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isContribModalOpen, setIsContribModalOpen] = useState(false);

  const members: Member[] = [
    { name: "Sagnik", role: "Owner", avatar: "S", email: "sagnik@example.com" },
    { name: "John", role: "Editor", avatar: "J", email: "john@example.com" },
    { name: "Elena", role: "Viewer", avatar: "E", email: "elena@example.com" },
  ];

  const handleViewContrib = (member: Member) => {
    setSelectedMember(member);
    setIsContribModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-bold text-slate-900">Trip Members</h3>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{members.length} Total</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member, i) => (
          <div key={i} className="card bg-white shadow-sm hover:shadow-md transition-all border-border relative group p-6 rounded-2xl">
            <button className="absolute right-4 top-4 p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all opacity-0 group-hover:opacity-100">
              <MoreVertical size={16} />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-black text-primary ring-4 ring-blue-50">
                {member.avatar}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-slate-900 truncate">{member.name}</h4>
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
                <p className="text-xs font-medium">Joined Aug 12, 2026</p>
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

      <ContributionsModal 
        isOpen={isContribModalOpen}
        onClose={() => setIsContribModalOpen(false)}
        memberName={selectedMember?.name || ''}
        avatar={selectedMember?.avatar || ''}
      />
    </div>
  );
}
