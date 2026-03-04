import { X, DollarSign, CheckSquare, Clock } from "lucide-react";
import { useState } from "react";

interface ContributionItem {
  id: string;
  type: 'Expense' | 'Task';
  title: string;
  date: string;
  amount?: string;
}

interface ContributionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  avatar: string;
}

export function ContributionsModal({ isOpen, onClose, memberName, avatar }: ContributionsModalProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'expenses'>('tasks');

  if (!isOpen) return null;

  const contributions: ContributionItem[] = [
    { id: '1', type: 'Task', title: 'Booked Ferry Tickets to Santorini', date: 'Yesterday' },
    { id: '2', type: 'Expense', title: 'Paid for Dinner at Oia', date: '2 days ago', amount: '€85' },
    { id: '3', type: 'Task', title: 'Confirmed Hotel Check-in', date: '3 days ago' },
    { id: '4', type: 'Expense', title: 'Gas for Rental Car', date: 'Aug 12', amount: '€40' },
    { id: '5', type: 'Task', title: 'Downloaded Offline Maps', date: 'Aug 10' },
  ];

  const filteredItems = contributions.filter(item => 
    activeTab === 'tasks' ? item.type === 'Task' : item.type === 'Expense'
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-lg font-black text-primary ring-4 ring-blue-50">
              {avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{memberName}'s activity</h3>
              <p className="text-xs text-slate-400 font-medium">Tracking trip contributions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-50">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'tasks' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CheckSquare size={14} />
            Tasks
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === 'expenses' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <DollarSign size={14} />
            Expenses
          </button>
        </div>

        <div className="p-8 max-h-[50vh] overflow-y-auto bg-slate-50/20">
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${item.type === 'Task' ? 'bg-indigo-50 text-indigo-500' : 'bg-teal-50 text-teal-500'}`}>
                    {item.type === 'Task' ? <CheckSquare size={18} /> : <DollarSign size={18} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.title}</h4>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
                      <Clock size={10} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
                {item.amount && (
                  <span className="text-sm font-black text-teal-600">{item.amount}</span>
                )}
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-slate-400">No {activeTab} found for this member.</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
