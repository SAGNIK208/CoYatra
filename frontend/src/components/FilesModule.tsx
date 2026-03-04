import { FileText, Plus, Download, Trash2, Eye } from "lucide-react";

interface TripFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

export function FilesModule() {
  const files: TripFile[] = [
    { id: "1", name: "Tickets.pdf", type: "PDF", size: "1.2 MB", date: "Aug 1" },
    { id: "2", name: "Villa_Reciept.jpg", type: "IMG", size: "2.4 MB", date: "Aug 2" },
    { id: "3", name: "Itinerary_Draft.docx", type: "DOC", size: "850 KB", date: "Aug 3" },
  ];

  const getFileIconColor = (type: string) => {
    switch(type) {
      case 'PDF': return 'text-red-500 bg-red-50';
      case 'IMG': return 'text-blue-500 bg-blue-50';
      case 'DOC': return 'text-indigo-500 bg-indigo-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Trip Storage</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {files.map((file) => (
          <div key={file.id} className="card bg-white shadow-sm group hover:border-primary transition-all p-4 flex flex-col items-center relative overflow-hidden text-center border-border">
            {/* Quick Actions Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 border-t border-slate-50 transform translate-y-full group-hover:translate-y-0 transition-transform flex justify-center gap-2">
              <button className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-primary rounded-md transition-colors" title="View">
                <Eye size={16} />
              </button>
              <button className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-primary rounded-md transition-colors" title="Download">
                <Download size={16} />
              </button>
              <button className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-colors" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>

            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300 ${getFileIconColor(file.type)}`}>
              <FileText size={32} />
            </div>
            
            <div className="w-full">
              <p className="text-sm font-bold text-slate-900 truncate mb-0.5">{file.name}</p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>{file.type}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span>{file.size}</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-2">{file.date}</p>
            </div>
          </div>
        ))}

        {/* Upload Button Card */}
        <div className="card border-2 border-dashed border-slate-100 bg-transparent flex flex-col items-center justify-center group cursor-pointer hover:border-primary hover:bg-blue-50/20 transition-all p-8">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-primary transition-all mb-3 text-center">
            <Plus size={24} />
          </div>
          <p className="font-bold text-slate-400 group-hover:text-primary transition-colors text-sm">Upload</p>
        </div>
      </div>
    </div>
  );
}
