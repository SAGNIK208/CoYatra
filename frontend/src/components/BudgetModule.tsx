import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Check, Info, RotateCcw, Globe } from "lucide-react";
import { useState } from "react";
import { CreateExpenseModal } from "./CreateExpenseModal";

interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid' | 'Settled';
  paidBy: string;
  sharedWith: string[];
}

const CURRENCIES = [
    { symbol: "$", code: "USD", name: "US Dollar" },
    { symbol: "€", code: "EUR", name: "Euro" },
    { symbol: "₹", code: "INR", name: "Indian Rupee" },
    { symbol: "£", code: "GBP", name: "British Pound" },
    { symbol: "¥", code: "JPY", name: "Japanese Yen" },
    { symbol: "د.إ", code: "AED", name: "UAE Dirham" },
    { symbol: "¤", code: "OTHER", name: "Other Currency" },
];

export function BudgetModule() {
  const members = [
    "Sagnik Guru", 
    "John Doe", 
    "Elena Smith-Rodriguez", 
    "Marcus Aurelius Antoninus", 
    "Sarah Connor", 
    "David", "Yuki", "Amara", "Lucas", "Sophie"
  ];

  const [currency, setCurrency] = useState(CURRENCIES[1]); // Default Euro
  const [expenses, setExpenses] = useState<Expense[]>([
    { 
      id: "1", 
      item: "International Flight Tickets (Business Class)", 
      amount: 1450, 
      date: "Aug 1", 
      status: "Paid", 
      paidBy: "Marcus Aurelius Antoninus", 
      sharedWith: ["Sagnik Guru", "John Doe", "Elena Smith-Rodriguez", "Marcus Aurelius Antoninus", "Sarah Connor"] 
    },
    { 
      id: "2", 
      item: "Luxury Villa Booking with Private Pool", 
      amount: 4200, 
      date: "Aug 2", 
      status: "Pending", 
      paidBy: "Elena Smith-Rodriguez", 
      sharedWith: ["John Doe", "Elena Smith-Rodriguez", "Marcus Aurelius Antoninus"] 
    },
    { 
        id: "3", 
        item: "Fine Dining Experience at Oia (Highly Recommended)", 
        amount: 850, 
        date: "Aug 3", 
        status: "Settled", 
        paidBy: "Sagnik Guru", 
        sharedWith: [...members] 
      },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalBudget = 10000;
  const spentSoFar = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - spentSoFar;

  const handleAddExpense = (data: { item: string; amount: number; paidBy: string; sharedWith: string[] }) => {
    setExpenses([...expenses, {
      id: Date.now().toString(),
      item: data.item,
      amount: data.amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      status: "Pending",
      paidBy: data.paidBy,
      sharedWith: data.sharedWith
    }]);
  };

  const handleStatusUpdate = (id: string, newStatus: 'Pending' | 'Paid' | 'Settled') => {
    setExpenses(expenses.map(exp => 
      exp.id === id ? { ...exp, status: newStatus } : exp
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Budget Settings Section */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe size={16} className="text-primary" />
                Trip Budget Settings
            </h4>
            <p className="text-xs text-slate-500 font-medium">Configure how you track group finances</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trip Currency</label>
                <div className="relative">
                    <select 
                        value={currency.code}
                        onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[1])}
                        className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer"
                    >
                        {CURRENCIES.map(c => (
                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                        ))}
                    </select>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-[10px] font-black text-primary pointer-events-none">
                        {currency.symbol}
                    </span>
                </div>
            </div>

            <div className="bg-slate-50/80 border border-slate-100 rounded-2xl px-4 py-2 flex items-center gap-3">
                <div className="p-1.5 bg-white rounded-lg shadow-xs text-primary shrink-0">
                    <Info size={14} />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-900 leading-none">Equal Split Policy</p>
                    <p className="text-[9px] text-slate-500 mt-1 font-medium truncate max-w-[150px]">Custom splits coming soon</p>
                </div>
            </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Budget</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{currency.symbol}{totalBudget.toLocaleString()}</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-primary" size={20} />
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 mb-1">Spent So Far</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{currency.symbol}{spentSoFar.toLocaleString()}</h3>
            <div className="p-2 bg-red-50 rounded-lg">
              <ArrowUpRight className="text-red-500" size={20} />
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 mb-1">Remaining</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900">{currency.symbol}{remaining.toLocaleString()}</h3>
            <div className="p-2 bg-teal-50 rounded-lg">
              <ArrowDownRight className="text-secondary" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card bg-white shadow-sm p-0 overflow-hidden border-border max-w-5xl">
        <div className="p-6 border-b border-border bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900">Expense History</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage group payments and finalize settlements</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-primary/10"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Item</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid By</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared With</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group align-top">
                  <td className="px-6 py-6 min-w-[200px]">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-primary transition-colors shrink-0">
                        <Wallet size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 leading-tight row-span-2">{exp.item}</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-1">{exp.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 min-w-[150px]">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-[10px] font-black text-primary shrink-0 mt-0.5">
                        {exp.paidBy[0]}
                      </div>
                      <span className="text-sm font-bold text-slate-700 leading-tight break-words max-w-[120px]">{exp.paidBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-1.5 flex-wrap max-w-[180px]">
                      {exp.sharedWith.length === members.length ? (
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-md mb-1">Everyone</span>
                      ) : exp.sharedWith.length > 3 ? (
                        <>
                          {exp.sharedWith.slice(0, 3).map(m => (
                            <div key={m} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-white mb-1" title={m}>
                              {m[0]}
                            </div>
                          ))}
                          <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[9px] font-bold text-slate-400 border border-white mb-1">
                            +{exp.sharedWith.length - 3}
                          </div>
                        </>
                      ) : (
                        exp.sharedWith.map(m => (
                          <div key={m} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-white mb-1" title={m}>
                            {m[0]}
                          </div>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <p className="font-black text-slate-900 leading-tight">{currency.symbol}{exp.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">{currency.symbol}{(exp.amount / exp.sharedWith.length).toFixed(2)} / each</p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center min-w-[140px]">
                    {exp.status === 'Settled' ? (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest bg-blue-50 text-primary border-blue-100">
                        <Check size={10} strokeWidth={3} />
                        {exp.status}
                      </span>
                    ) : exp.status === 'Paid' ? (
                        <div className="flex flex-col gap-2 items-center">
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest bg-teal-50 text-secondary border-teal-100">
                                <Check size={10} strokeWidth={3} />
                                {exp.status}
                            </span>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => handleStatusUpdate(exp.id, 'Pending')}
                                    className="p-1.5 text-slate-300 hover:text-amber-500 transition-colors group/undo flex items-center gap-1"
                                    title="Undo Mark as Paid"
                                >
                                    <RotateCcw size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-tighter hidden group-hover/undo:inline">Undo</span>
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate(exp.id, 'Settled')}
                                    className="text-[9px] font-black text-primary hover:text-blue-700 transition-colors uppercase tracking-widest"
                                >
                                    Settle
                                </button>
                            </div>
                        </div>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(exp.id, 'Paid')}
                        className="text-[10px] font-black text-white bg-primary hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-primary/20 uppercase tracking-widest"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateExpenseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleAddExpense}
        members={members}
        currencySymbol={currency.symbol}
      />
    </div>
  );
}
