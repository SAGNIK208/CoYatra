import { FileText, Plus, Trash2, Eye, Loader2, Info } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { fileService } from "../lib/fileService";

interface TripFile {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  url: string;
}

export function FilesModule({ tripId }: { tripId: string }) {
  const [files, setFiles] = useState<TripFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const data = await fileService.getTripFiles(tripId);
      const mapped = data.map((f: any) => ({
        id: f._id || f.id,
        name: f.fileName,
        type: f.mimeType.split('/')[1]?.toUpperCase() || 'FILE',
        size: f.fileSize > 1024 * 1024 
          ? `${(f.fileSize / (1024 * 1024)).toFixed(1)} MB` 
          : `${(f.fileSize / 1024).toFixed(0)} KB`,
        date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        url: f.fileUrl
      }));
      setFiles(mapped);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [tripId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File constraints
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      alert("File is too large. Maximum size is 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload standard documents or images.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Get Presigned URL
      const { uploadUrl, fileKey } = await fileService.getUploadUrl(tripId, file.name, file.type);
      
      // 2. Upload to S3
      await fileService.uploadToS3(uploadUrl, file);
      
      // 3. Confirm with Backend
      await fileService.confirmUpload({
        tripId,
        fileName: file.name,
        fileKey,
        fileSize: file.size,
        mimeType: file.type
      });

      // 4. Refresh List
      await fetchFiles();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file. Check if LocalStack is running.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await fileService.deleteFile(id);
      setFiles(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const getFileIconColor = (type: string) => {
    switch(type) {
      case 'PDF': return 'text-red-500 bg-red-50';
      case 'PNG':
      case 'JPG':
      case 'JPEG': return 'text-blue-500 bg-blue-50';
      case 'DOC':
      case 'DOCX': return 'text-indigo-500 bg-indigo-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center text-slate-400 font-bold animate-pulse">Scanning storage...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Trip Storage</h3>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          accept=".pdf,.doc,.docx,.txt,.csv,image/jpeg,image/png,image/webp"
          className="hidden" 
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {files.map((file) => (
          <div key={file.id} className="card bg-white shadow-sm group hover:border-primary transition-all p-4 flex flex-col items-center relative overflow-hidden text-center border-border">
            {/* Quick Actions Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 border-t border-slate-50 transform translate-y-full group-hover:translate-y-0 transition-transform flex justify-center gap-2">
              <a 
                href={file.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-primary rounded-md transition-colors" 
                title="View"
              >
                <Eye size={16} />
              </a>
                <button 
                  onClick={() => handleDelete(file.id)}
                  className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-colors" 
                  title="Delete"
                >
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
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="card border-2 border-dashed border-slate-100 bg-transparent flex flex-col items-center justify-center group cursor-pointer hover:border-primary hover:bg-blue-50/20 transition-all p-8 disabled:opacity-50 relative"
          >
            <div 
              className="absolute top-3 right-3 text-slate-300 hover:text-primary transition-colors cursor-help"
              title="Supported: PDF, DOC, TSV, CSV, JPG, PNG, WEBP (Max 10MB)"
            >
              <Info size={16} />
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-primary transition-all mb-3 text-center">
              {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
            </div>
            <p className="font-bold text-slate-400 group-hover:text-primary transition-colors text-sm">
              {isUploading ? 'Uploading...' : 'Upload'}
            </p>
          </button>
      </div>
    </div>
  );
}
