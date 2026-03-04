import { X, Clock, MapPin, AlignLeft, DollarSign, Image as ImageIcon, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
    title: string;
    time: string;
    location: string;
    description?: string;
    cost?: string;
    type: string;
  } | null;
}

export function ActivityDrawer({ isOpen, onClose, activity }: ActivityDrawerProps) {
  const [comment, setComment] = useState("");

  if (!activity) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside className={`
        fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 line-clamp-1">{activity.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 text-slate-600">
                <Clock className="mt-1 text-primary" size={20} />
                <div>
                  <p className="font-semibold text-slate-900">Time</p>
                  <p className="text-sm">{activity.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-slate-600">
                <MapPin className="mt-1 text-primary" size={20} />
                <div>
                  <p className="font-semibold text-slate-900">Location</p>
                  <p className="text-sm">{activity.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-slate-600">
                <DollarSign className="mt-1 text-primary" size={20} />
                <div>
                  <p className="font-semibold text-slate-900">Estimated Cost</p>
                  <p className="text-sm">{activity.cost || "Free / Non-specified"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <AlignLeft size={18} />
                <span>Description</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg">
                {activity.description || "No description provided for this activity."}
              </p>
            </div>

            {/* Media/Attachments Preview */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <ImageIcon size={18} />
                <span>Attachments</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                  <div className="text-center">
                    <ImageIcon size={24} className="mx-auto mb-1" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 pb-2 border-b border-border">
                <MessageSquare size={18} />
                <span>Comments</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">S</div>
                  <div className="bg-slate-50 p-3 rounded-2xl rounded-tl-none">
                    <p className="text-xs font-bold text-slate-900 mb-1">Sagnik</p>
                    <p className="text-xs text-slate-600 italic">I think we should book this in advance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-border bg-slate-50">
            <div className="relative">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-white border border-border rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-20"
              />
              <button className="absolute right-3 bottom-3 p-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
