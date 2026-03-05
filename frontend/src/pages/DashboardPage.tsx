import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, PlusCircle, Settings, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { TripCard } from "../components/TripCard";
import { CreateTripModal } from "../components/CreateTripModal";
import { tripService } from "../lib/tripService";
import { useEffect } from "react";

export function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await tripService.getAll();
        setTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching trips:", error);
        setTrips([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleCreateTrip = async (data: any) => {
    try {
      const newTrip = await tripService.create(data);
      if (newTrip) {
        setTrips(prev => [newTrip, ...prev]);
        setIsCreateModalOpen(false);
        navigate(`/trips/${newTrip.id || newTrip._id}`);
      }
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip. Please try again.");
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-white border-r border-border transition-all duration-300 flex flex-col fixed h-full z-40
      `}>
        <div className="h-16 border-b border-border flex items-center px-6 justify-between">
          <div className={`flex items-center gap-2 ${!isSidebarOpen && 'hidden'}`}>
            <img src={logo} alt="CoYatra" className="h-8 w-8 rounded-md" />
            <span className="text-lg font-bold text-primary tracking-tight">CoYatra</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} className="mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-primary rounded-md font-medium transition-colors">
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium transition-colors"
          >
            <PlusCircle size={20} />
            {isSidebarOpen && <span>New Trip</span>}
          </button>
          <Link 
            to="/settings"
            className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md font-medium transition-colors"
          >
            <Settings size={20} />
            {isSidebarOpen && <span>Settings</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <UserButton showName={isSidebarOpen} appearance={{ elements: { userButtonBox: 'flex-row-reverse' } }} />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="h-16 bg-white border-b border-border flex items-center px-8 justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search trips..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Welcome User */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.firstName || 'Traveler'}!</h2>
              <p className="text-slate-500">You have {trips?.length || 0} active trips planned.</p>
            </div>
          </div>

          {/* Trip Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trips.map((trip: any) => (
                <TripCard
                  key={trip.id || trip._id}
                  id={trip.id || trip._id}
                  title={trip.title}
                  startDateTime={trip.startDateTime}
                  endDateTime={trip.endDateTime}
                  timezone={trip.timezone}
                  location={trip.location}
                  memberCount={trip.memberCount || 1}
                  role={trip.role || "OWNER"}
                  imageUrl={trip.imageUrl}
                />
              ))}
            
            {/* Create New Static Card */}
            <div 
              onClick={() => setIsCreateModalOpen(true)}
              className="border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center p-6 hover:border-primary hover:bg-blue-50/50 cursor-pointer transition-all group h-full min-h-[250px]"
            >
              <div className="bg-slate-100 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <PlusCircle size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
              </div>
              <span className="font-semibold text-slate-500 group-hover:text-primary transition-colors">New Trip</span>
            </div>
          </div>
        </div>
      </main>

      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateTrip} 
      />
    </div>
  );
}
