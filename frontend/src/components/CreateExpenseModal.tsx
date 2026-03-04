import { X, DollarSign } from "lucide-react";
import { useState } from "react";

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (expense: { item: string; amount: number; paidBy: string; sharedWith: string[] }) => void;
  members: string[];
  currencySymbol: string;
}

export function CreateExpenseModal({ isOpen, onClose, onCreate, members, currencySymbol }: CreateExpenseModalProps) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(members[0] || "");
  const [sharedWith, setSharedWith] = useState<string[]>(members);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim() || !amount) return;
    onCreate({ 
      item, 
      amount: parseFloat(amount), 
      paidBy, 
      sharedWith 
    });
    setItem("");
    setAmount("");
    onClose();
  };

  const toggleSelectAll = () => {
    if (sharedWith.length === members.length) {
      setSharedWith([]);
    } else {
      setSharedWith(members);
    }
  };

  const toggleMember = (member: string) => {
    if (sharedWith.includes(member)) {
      setSharedWith(sharedWith.filter(m => m !== member));
    } else {
      setSharedWith([...sharedWith, member]);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl text-secondary">
              <DollarSign size={22} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Add Expense</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">What did you pay for?</label>
            <input 
              autoFocus
              type="text"
              placeholder="e.g., Dinner at Oia"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Amount ({currencySymbol})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currencySymbol}</span>
                <input 
                  type="number"
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paid By</label>
              <select 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-slate-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2014%2014%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M3.5%205.25L7%208.75L10.5%205.25%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:14px_14px] bg-[right_1rem_center] bg-no-repeat"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
              >
                {members.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Split with</label>
              <button 
                type="button" 
                onClick={toggleSelectAll}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                {sharedWith.length === members.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            {/* Scrollable Members Container */}
            <div className="max-height-[200px] overflow-y-auto pr-2 -mr-2 space-y-1 custom-scrollbar" style={{ maxHeight: '180px' }}>
              <div className="flex flex-wrap gap-2 pb-2">
                {members.map((member) => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => toggleMember(member)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      sharedWith.includes(member)
                      ? 'bg-blue-50 text-primary border-primary ring-1 ring-primary/20'
                      : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'
                    }`}
                  >
                    {member}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 mt-4"
          >
            Create Expense
          </button>
        </form>
      </div>
    </div>
  );
}
