import { CheckCircle2, Circle, Trash2, User, Paperclip, Filter, Plus, CheckSquare } from "lucide-react";
import { useState } from "react";
import { CreateTaskModal } from "./CreateTaskModal";

interface ChecklistItem {
  id: string;
  task: string;
  done: boolean;
  assignee?: string;
  hasAttachment?: boolean;
}

export function ChecklistModule() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", task: "Book ferry to Mykonos", done: true, assignee: "Sagnik" },
    { id: "2", task: "Pack swimsuit and sunscreen", done: false, assignee: "Elena" },
    { id: "3", task: "Confirm dinner at Sunset Grill", done: false },
    { id: "4", task: "Download offline maps", done: true, assignee: "John", hasAttachment: true },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");

  const toggleTask = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const handleCreateTask = (data: { name: string; assignee: string; hasAttachment: boolean }) => {
    setItems([...items, { 
      id: Date.now().toString(), 
      task: data.name, 
      done: false, 
      assignee: data.assignee || undefined,
      hasAttachment: data.hasAttachment
    }]);
  };

  const removeTask = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = filterAssignee === "all" 
    ? items 
    : items.filter(item => item.assignee === filterAssignee);

  const completedCount = items.filter(i => i.done).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const assignees = ["Sagnik", "John", "Elena"];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress Header */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900 text-lg">Trip Progress</h3>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500 font-medium">
            {completedCount} of {items.length} tasks completed
          </p>
        </div>

        {/* Global Action Button - Suited place */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-primary/20 transition-all flex flex-col items-center justify-center p-6 group h-full"
        >
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="font-bold text-lg">New Task</span>
          <span className="text-[10px] text-white/60 font-medium uppercase tracking-widest mt-1">Add details & assignee</span>
        </button>
      </div>

      {/* Filters Area */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Filter by</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterAssignee("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterAssignee === "all" ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              All Tasks
            </button>
            {assignees.map(name => (
              <button 
                key={name}
                onClick={() => setFilterAssignee(name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterAssignee === name ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs font-bold text-slate-400">{filteredItems.length} {filteredItems.length === 1 ? 'task' : 'tasks'} found</span>
      </div>

      {/* Checklist Grid */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="card bg-white shadow-sm flex items-center justify-between py-4 hover:border-primary transition-all group border-border px-6"
          >
            <div 
              className="flex items-center gap-4 cursor-pointer flex-1"
              onClick={() => toggleTask(item.id)}
            >
              <div className="transition-transform active:scale-90">
                {item.done ? (
                  <CheckCircle2 size={24} className="text-secondary shrink-0" />
                ) : (
                  <Circle size={24} className="text-slate-200 group-hover:text-primary shrink-0 transition-colors" />
                )}
              </div>
              <div className="flex flex-col">
                <span className={`font-medium transition-colors ${item.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {item.task}
                </span>
                {item.assignee && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
                      <User size={10} className="text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.assignee}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                className={`p-2 rounded-lg transition-all ${item.hasAttachment ? 'text-primary bg-blue-50' : 'text-slate-300 hover:text-primary hover:bg-slate-50 opacity-0 group-hover:opacity-100'}`}
                title="View/Upload attachment"
              >
                <Paperclip size={18} />
              </button>
              <button 
                onClick={() => removeTask(item.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <CheckSquare size={32} />
            </div>
            <p className="text-slate-400 font-medium">No tasks match your filter.</p>
          </div>
        )}
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateTask} 
      />
    </div>
  );
}
