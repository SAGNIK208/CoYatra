import { CheckCircle2, Circle, Trash2, User, Paperclip, Filter, Plus, CheckSquare, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { CreateTaskModal } from "./CreateTaskModal";
import { checklistService } from "../lib/checklistService";
import { fileService } from "../lib/fileService";
import { useUser } from "@clerk/clerk-react";

interface ChecklistItem {
  id: string;
  task: string;
  done: boolean;
  assignee?: string;
  assigneeId?: string;
  hasAttachment?: boolean;
}

export function ChecklistModule({ tripId, members = [] }: { tripId: string; members?: any[] }) {
  const { user: clerkUser } = useUser();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingTaskId, setUploadingTaskId] = useState<string | null>(null);

  // Find the database user ID for the current clerk user
  const currentMember = members.find(m => m.user?.clerkId === clerkUser?.id);
  const currentDbUserId = currentMember?.user?._id;

  const memberNames = members.map(m => m.user?.name).filter(Boolean) as string[];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await checklistService.getByTripId(tripId, filterAssignee);
        const mapped = data.map((t: any) => ({
          id: t._id || t.id,
          task: t.title,
          done: t.isDone,
          assignee: t.assignedToUserId?.name || undefined,
          assigneeId: t.assignedToUserId?._id || t.assignedToUserId || undefined,
          hasAttachment: t.attachments && t.attachments.length > 0
        }));
        setItems(mapped);
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [tripId, filterAssignee]);

  const toggleTask = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (item.assigneeId && item.assigneeId !== currentDbUserId) {
      alert("Only the assignee can update this task.");
      return;
    }
    
    try {
      await checklistService.update(id, { isDone: !item.done });
      setItems(items.map(i => i.id === id ? { ...i, done: !item.done } : i));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleFileUpload = async (taskId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const item = items.find(i => i.id === taskId);
    if (!item) return;

    if (item.assigneeId && item.assigneeId !== currentDbUserId) {
      alert("Only the assignee can attach files to this assigned task.");
      return;
    }

    try {
      setUploadingTaskId(taskId);
      const { uploadUrl, fileKey } = await fileService.getUploadUrl(tripId, file.name, file.type);
      await fileService.uploadToS3(uploadUrl, file);
      await fileService.confirmUpload({
        tripId,
        fileName: file.name,
        fileKey,
        fileSize: file.size,
        mimeType: file.type,
        checklistItemId: taskId
      });
      
      setItems(items.map(i => i.id === taskId ? { ...i, hasAttachment: true } : i));
      alert("File uploaded and linked successfully!");
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploadingTaskId(null);
    }
  };

  const handleCreateTask = async (data: { name: string; assignee: string }) => {
    try {
      const selectedMember = members.find(m => m.user?.name === data.assignee);
      const backendData = {
        tripId,
        title: data.name,
        assignedToUserId: selectedMember?.user?._id
      };
      const newTask = await checklistService.create(backendData);
      
      setItems([...items, { 
        id: newTask._id || newTask.id, 
        task: newTask.title, 
        done: false, 
        assignee: data.assignee || undefined,
        assigneeId: selectedMember?.user?._id,
        hasAttachment: false
      }]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const removeTask = async (id: string) => {
    try {
      await checklistService.delete(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const completedCount = items.filter(i => i.done).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading checklist...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">Task Completion</h4>
              <span className="text-xs font-black text-primary bg-blue-50 px-2 py-1 rounded-lg">{Math.round(progress)}%</span>
           </div>
           <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
             {completedCount} of {items.length} tasks completed
           </p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">Filter Tasks</h4>
                <p className="text-xs text-slate-500 font-medium">View tasks by assignee</p>
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select 
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20 appearance-none transition-all cursor-pointer"
                >
                    <option value="all">All Members</option>
                    {members.map(m => (
                      <option key={m.user?._id} value={m.user?._id}>{m.user?.name}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-xl text-white shadow-lg shadow-primary/20">
                <CheckSquare size={18} />
             </div>
             <h3 className="font-bold text-slate-900">Essential Checklist</h3>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-xl border border-slate-100 transition-all shadow-sm"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        <div className="divide-y divide-slate-50">
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-all">
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={() => toggleTask(item.id)}
                  disabled={!!item.assigneeId && item.assigneeId !== currentDbUserId}
                  className={`transition-colors duration-300 ${item.done ? 'text-primary' : 'text-slate-300 hover:text-slate-400'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {item.done ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="min-w-0">
                  <p className={`text-sm font-bold transition-all duration-300 ${item.done ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                    {item.task}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {item.assignee && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                        <User size={10} />
                        {item.assignee}
                      </div>
                    )}
                    {item.hasAttachment && (
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-tight">
                        <Paperclip size={10} />
                        Attached
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <label className={`p-2 rounded-lg transition-all cursor-pointer ${
                  (item.assigneeId && item.assigneeId !== currentDbUserId)
                    ? 'text-slate-100 cursor-not-allowed'
                    : 'text-slate-300 hover:text-primary hover:bg-blue-50'
                }`}>
                  {uploadingTaskId === item.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Paperclip size={16} />
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    disabled={uploadingTaskId === item.id || (!!item.assigneeId && item.assigneeId !== currentDbUserId)}
                    onChange={(e) => handleFileUpload(item.id, e)}
                  />
                </label>
                <button 
                  onClick={() => removeTask(item.id)}
                  disabled={!!item.assigneeId && item.assigneeId !== currentDbUserId}
                  className="p-2 text-slate-200 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="p-20 text-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                  <CheckSquare size={32} />
               </div>
               <p className="text-sm font-bold text-slate-400">No tasks found</p>
               <button onClick={() => setIsModalOpen(true)} className="text-xs font-black text-primary uppercase mt-2 hover:underline">Create your first task</button>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
        members={memberNames}
      />
    </div>
  );
}
