import { X, Copy, Check, Link as LinkIcon, Shield, Clock, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { inviteService } from "../lib/inviteService";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  tripId: string;
}

export function InviteModal({ isOpen, onClose, tripTitle, tripId }: InviteModalProps) {
  const [copied, setCopied] = useState(false);
  const [role, setRole] = useState<'Editor' | 'Viewer'>('Editor');
  const [expiryDays, setExpiryDays] = useState('7');
  const [inviteLink, setInviteLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setInviteLink('');
      setError(null);
    }
  }, [isOpen]);

  const generateLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let expiresAt: string | undefined;
      if (expiryDays !== 'never') {
        const date = new Date();
        date.setDate(date.getDate() + parseInt(expiryDays));
        expiresAt = date.toISOString();
      }

      const res = await inviteService.generate(tripId, role.toUpperCase(), expiresAt);
      setInviteLink(`${window.location.origin}/join/${res.inviteToken}`);
    } catch (err) {
      console.error(err);
      setError('Failed to generate invite link');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;


  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <LinkIcon size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Invite Members</h3>
              <p className="text-xs text-slate-400 font-medium">to "{tripTitle}"</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Link Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                 Shareable Link
              </label>
              {error && <span className="text-[10px] font-bold text-red-500">{error}</span>}
            </div>

            {!inviteLink ? (
              <button
                onClick={generateLink}
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 border-dashed rounded-2xl text-sm font-bold text-slate-500 hover:text-primary hover:border-primary hover:bg-blue-50/50 transition-all focus:outline-none"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                {isLoading ? "Generating..." : "Generate Invite Link"}
              </button>
            ) : (
              <div className="flex gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded-2xl group focus-within:border-primary transition-colors ring-offset-0 focus-within:ring-2 focus-within:ring-primary/10">
                <div className="flex-1 px-4 py-3 text-sm text-slate-600 font-medium truncate select-all">
                  {inviteLink}
                </div>
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 rounded-xl font-bold text-sm transition-all ${
                    copied 
                    ? 'bg-secondary text-white shadow-lg shadow-teal-500/20' 
                    : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Shield size={12} /> Link Role
              </label>
              <div className="grid grid-cols-1 gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                {(['Editor', 'Viewer'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                        setRole(r);
                        setInviteLink('');
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      role === r 
                      ? 'bg-white text-primary shadow-sm ring-1 ring-slate-100' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-1.5">
                <Clock size={12} /> Expiry
              </label>
              <select 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/10 appearance-none cursor-pointer"
                value={expiryDays}
                onChange={(e) => {
                  setExpiryDays(e.target.value);
                  setInviteLink('');
                }}
              >
                <option value="1">1 Day</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="never">No Expiry</option>
              </select>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-xs text-blue-600 font-medium leading-relaxed">
            Anyone with this link will be added to your trip group as an <span className="font-bold underlineDecoration-indigo-50">{role}</span>. You can manage member roles anytime from the Members tab.
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
