import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface TripCardProps {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  destination?: string;
  memberCount: number;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  imageUrl?: string;
}

export function TripCard({ id, title, startDate, endDate, destination, memberCount, role, imageUrl }: TripCardProps) {
  const roleColors = {
    OWNER: 'bg-blue-100 text-blue-700',
    EDITOR: 'bg-teal-100 text-teal-700',
    VIEWER: 'bg-amber-100 text-amber-700'
  };

  return (
    <Link to={`/trips/${id}`} className="block h-full">
      <div className="card group hover:border-primary h-full transition-all duration-300 cursor-pointer overflow-hidden p-0">
        {imageUrl ? (
          <div className="h-32 bg-slate-200 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                // Fallback for broken images
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80";
              }}
            />
          </div>
        ) : (
          <div className="h-32 bg-slate-100 flex items-center justify-center">
            <MapPin size={32} className="text-slate-300" />
          </div>
        )}
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider ${roleColors[role]}`}>
              {role}
            </span>
          </div>
          
          <h3 className="text-lg font-bold text-slate-900 mb-1 truncate group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {destination && (
            <div className="flex items-center gap-1 text-slate-400 text-xs mb-3">
              <MapPin size={10} />
              <span>{destination}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Calendar size={14} />
              <span>{startDate} - {endDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Users size={14} />
              <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
