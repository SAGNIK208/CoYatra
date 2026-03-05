import { X, Check, Clock } from "lucide-react";
import { financeService } from "../lib/financeService";

interface Payee {
  userId: string;
  name: string;
  amount: number;
  isPaid: boolean;
}

interface SplitDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: {
    id: string;
    item: string;
    amount: number;
    currencySymbol: string;
    payees: Payee[];
  };
  currentUserId: string; // Add this
  onUpdate: (userId: string, isPaid: boolean) => void;
}

export function SplitDetailsModal({ isOpen, onClose, expense, currentUserId, onUpdate }: SplitDetailsModalProps) {
  if (!isOpen) return null;

  const handleToggle = async (userId: string, currentStatus: boolean) => {
    if (userId !== currentUserId) return; // Permission check
    try {
      await financeService.updatePayeeStatus(expense.id, userId, !currentStatus);
      onUpdate(userId, !currentStatus);
    } catch (error) {
      console.error("Error updating payee status:", error);
    }
  };

  const paidCount = expense.payees.filter(p => p.isPaid).length;
  const totalCount = expense.payees.length;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{expense.item}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Split details • {paidCount}/{totalCount} Paid
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 shadow-sm border border-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            {expense.payees.map((payee) => {
              const isMe = payee.userId === currentUserId;
              
              return (
                <div 
                  key={payee.userId} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    payee.isPaid 
                    ? 'bg-teal-50/30 border-teal-100/50' 
                    : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-colors ${
                      payee.isPaid ? 'bg-teal-100 text-secondary' : 'bg-white text-slate-400 shadow-sm'
                    }`}>
                      {payee.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-bold ${payee.isPaid ? 'text-slate-900' : 'text-slate-600'}`}>
                          {payee.name}
                        </p>
                        {isMe && (
                          <span className="text-[8px] font-black bg-blue-100 text-primary px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {expense.currencySymbol}{payee.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    disabled={!isMe}
                    onClick={() => handleToggle(payee.userId, payee.isPaid)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      payee.isPaid
                      ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'
                      : isMe 
                        ? 'bg-white text-slate-400 border border-slate-200 hover:border-primary hover:text-primary shadow-sm' 
                        : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
                    }`}
                  >
                    {payee.isPaid ? (
                      <>
                        <Check size={12} strokeWidth={3} />
                        Paid
                      </>
                    ) : (
                      <>
                        <Clock size={12} strokeWidth={3} />
                        {isMe ? 'Mark Paid' : 'Pending'}
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Expense</span>
            <span className="text-lg font-black text-slate-900">{expense.currencySymbol}{expense.amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
