import { Wallet, TrendingUp, Plus, Check, Info, Globe, Users, CreditCard } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { CreateExpenseModal } from "./CreateExpenseModal";
import { SplitDetailsModal } from "./SplitDetailsModal";
import { financeService } from "../lib/financeService";
import { tripService } from "../lib/tripService";
import { useUser } from "@clerk/clerk-react";

interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Paid' | 'Settled';
  paidBy: string;
  paidByUserId: string;
  payees: {
    userId: string;
    name: string;
    amount: number;
    isPaid: boolean;
  }[];
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

export function BudgetModule({ tripId }: { tripId: string }) {
  const { user } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState(CURRENCIES[2]); // Default INR
  const [trip, setTrip] = useState<any>(null);

  // Fetch expenses and trip details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseData, tripData] = await Promise.all([
          financeService.getByTripId(tripId),
          tripService.getById(tripId)
        ]);

        setTrip(tripData);
        if (tripData.defaultCurrency) {
          const found = CURRENCIES.find(c => c.code === tripData.defaultCurrency);
          if (found) setCurrency(found);
        }

        const mapped = expenseData.map((e: any) => ({
          id: e._id || e.id,
          item: e.title,
          amount: e.amount,
          date: new Date(e.createdAt || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: e.status || "Pending",
          paidBy: e.paidByUserId?.name || "Unknown",
          paidByUserId: e.paidByUserId?._id || e.paidByUserId,
          payees: e.payees?.map((p: any) => ({
            userId: p.user?._id || p.user,
            name: p.user?.name || "Unknown",
            amount: p.amount,
            isPaid: p.isPaid
          })) || []
        }));
        setExpenses(mapped);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tripId]);

  // Get current user's database ID
  const currentUserId = useMemo(() => {
    if (!user) return "";
    return trip?.members?.find((m: any) => m.user?.clerkId === user.id)?.user?._id || "";
  }, [user, trip]);

  // "Total Spent" is the sum of all expenses committed
  const totalSpent = useMemo(() => expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);
  
  // "Settled by You" is your share of total spent (only if marked as paid)
  const personalSpent = useMemo(() => {
     if (!currentUserId) return 0;
     return expenses.reduce((sum, exp) => {
       const myShare = exp.payees.find(p => p.userId === currentUserId);
       return sum + (myShare?.isPaid ? myShare.amount : 0);
     }, 0);
  }, [expenses, currentUserId]);

  const handleAddExpense = async (data: { item: string; amount: number; paidByUserId: string; payeeUserIds: string[] }) => {
    try {
      const perPersonAmount = data.amount / (data.payeeUserIds.length || 1);

      const backendData = {
        tripId,
        title: data.item,
        amount: data.amount,
        currency: currency.code,
        status: "Pending",
        paidByUserId: data.paidByUserId,
        payees: data.payeeUserIds,
        splitType: 'Equal'
      };
      
      const newExpense = await financeService.create(backendData);
      
      const paidByMember = trip?.members?.find((m: any) => m.user?._id === data.paidByUserId);
      const payeeMembersList = data.payeeUserIds.map(id => 
        trip?.members?.find((m: any) => m.user?._id === id)
      ).filter(Boolean);

      const mapped: Expense = {
        id: newExpense._id || newExpense.id,
        item: newExpense.title,
        amount: newExpense.amount,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: "Pending",
        paidBy: paidByMember?.user?.name || "Unknown",
        paidByUserId: data.paidByUserId,
        payees: payeeMembersList.map(m => ({
          userId: m.user?._id,
          name: m.user?.name,
          amount: perPersonAmount,
          isPaid: m.user?._id === data.paidByUserId // Always auto-paid by the payer
        }))
      };
      
      setExpenses([mapped, ...expenses]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense.");
    }
  };

  const handlePayeeUpdate = (expenseId: string, userId: string, isPaid: boolean) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== expenseId) return exp;
      const newPayees = exp.payees.map(p => 
        p.userId === userId ? { ...p, isPaid } : p
      );
      // Update overall status
      const allPaid = newPayees.every(p => p.isPaid);
      const overallStatus = allPaid ? 'Settled' : (newPayees.some(p => p.isPaid) ? 'Paid' : 'Pending');
      
      const updatedExp = { ...exp, payees: newPayees, status: overallStatus as any };
      if (selectedExpense?.id === expenseId) setSelectedExpense(updatedExp);
      return updatedExp;
    }));
  };

  const members = trip?.members?.map((m: any) => ({
    userId: m.user?._id,
    name: m.user?.name
  })).filter((m: any) => m.userId && m.name) || [];

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading budget...</div>;

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
                        onChange={(e) => {
                          const c = CURRENCIES.find(curr => curr.code === e.target.value) || CURRENCIES[2];
                          setCurrency(c);
                        }}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Spent</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 uppercase">{currency.symbol}{totalSpent.toLocaleString()}</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="text-primary" size={20} />
            </div>
          </div>
        </div>
        <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-slate-500 mb-1">Settled by You</p>
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-slate-900 uppercase">{currency.symbol}{personalSpent.toLocaleString()}</h3>
            <div className="p-2 bg-teal-50 rounded-lg">
              <CreditCard className="text-secondary" size={20} />
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
                    <div className="flex items-center gap-2">
                       <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400">
                         <Users size={14} />
                       </div>
                       <span className="text-xs font-bold text-slate-600">
                         {exp.payees.length === members.length ? 'Everyone' : `${exp.payees.length} Members`}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right whitespace-nowrap">
                    <div className="flex flex-col items-end">
                      <p className="font-black text-slate-900 leading-tight">{currency.symbol}{exp.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                        {currency.symbol}{(exp.amount / (exp.payees.length || 1)).toFixed(2)} / each
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center min-w-[140px]">
                    <div className="flex flex-col gap-1.5 items-center">
                      <button 
                        onClick={() => setSelectedExpense(exp)}
                        className={`inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest transition-all hover:scale-105 ${
                          exp.status === 'Settled' 
                          ? 'bg-blue-50 text-primary border-blue-100'
                          : exp.status === 'Paid'
                          ? 'bg-teal-50 text-secondary border-teal-100'
                          : 'bg-white text-slate-400 border-slate-200 shadow-sm'
                        }`}
                      >
                        {exp.status === 'Settled' || exp.status === 'Paid' ? <Check size={10} strokeWidth={3} /> : null}
                        {exp.status}
                      </button>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {exp.payees.filter(p => p.isPaid).length}/{exp.payees.length} Paid
                      </p>
                    </div>
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

      {selectedExpense && (
        <SplitDetailsModal
          isOpen={!!selectedExpense}
          onClose={() => setSelectedExpense(null)}
          expense={{
            ...selectedExpense,
            currencySymbol: currency.symbol
          }}
          currentUserId={currentUserId}
          onUpdate={(userId, isPaid) => handlePayeeUpdate(selectedExpense.id, userId, isPaid)}
        />
      )}
    </div>
  );
}
