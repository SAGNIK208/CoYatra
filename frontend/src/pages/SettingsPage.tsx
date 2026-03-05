import { useUser, UserProfile, useClerk } from "@clerk/clerk-react";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  ChevronLeft, 
  Save,
  Camera,
  Globe,
  Heart
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { userService } from "../lib/userService";

export function SettingsPage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { openUserProfile } = useClerk();
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Local form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    travelStyle: "",
    homeBase: ""
  });

  // Fetch backend user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const backendUser = await userService.getMe();
        setFormData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          bio: backendUser.bio || "",
          travelStyle: backendUser.travelStyle || "",
          homeBase: backendUser.homeBase || ""
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClerkLoaded) {
      fetchUserData();
    }
  }, [isClerkLoaded, user]);

  if (!isClerkLoaded || isLoading) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Loading settings...</div>;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // 1. Update Clerk profile
      const clerkUpdateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };
      


      await user?.update(clerkUpdateData);
      
      // 2. Update Backend profile
      await userService.updateMe({
        firstName: formData.firstName,
        lastName: formData.lastName,
        bio: formData.bio,
        homeBase: formData.homeBase,
        travelStyle: formData.travelStyle
      });
      
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile. Please ensure username is unique and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'preferences', label: 'Travel Preferences', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-border flex items-center px-4 justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <img src={logo} alt="CoYatra" className="h-8 w-8 rounded-md" />
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Account Settings</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col md:flex-row gap-10">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all
                ${activeSection === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'text-slate-500 hover:bg-white hover:text-slate-900'}
              `}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {activeSection === 'profile' && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">My Profile</h2>
                  <p className="text-slate-500 font-medium">Manage your public information and how others see you.</p>
                </div>
                <button 
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                </button>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-10">
                {/* Avatar Section */}
                <div className="flex items-center gap-8">
                  <div className="relative group">
                    <img 
                      src={user?.imageUrl} 
                      alt="Profile" 
                      className="w-32 h-32 rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-md group-hover:brightness-90 transition-all" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Camera size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900">Profile Picture</h4>
                    <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">Managed via Clerk Security settings.</p>
                    <div className="flex gap-2 pt-2">
                      <button type="button" onClick={() => openUserProfile()} className="text-xs font-bold text-primary px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">Update Photo</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>



                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio</label>
                  <textarea 
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-slate-700 resize-none"
                    placeholder="Tell us about your travels..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Globe size={12} /> Home Base
                    </label>
                    <input 
                      type="text" 
                      value={formData.homeBase}
                      onChange={(e) => setFormData({...formData, homeBase: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Heart size={12} /> Travel Style
                    </label>
                    <input 
                      type="text" 
                      value={formData.travelStyle}
                      onChange={(e) => setFormData({...formData, travelStyle: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h2 className="text-3xl font-black text-slate-900 mb-2">Security & Identity</h2>
               <p className="text-slate-500 font-medium mb-10">Manage your password, email, and authentication methods.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-primary mb-4">
                      <User size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Account Details</h4>
                    <p className="text-xs text-slate-500 mb-4">Update your name, email, and profile photo.</p>
                    <button onClick={() => openUserProfile()} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                      Manage via Clerk
                    </button>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-600 mb-4">
                      <Shield size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-2">Password</h4>
                    <p className="text-xs text-slate-500 mb-4">Change your password or set a new one for email login.</p>
                    <button onClick={() => openUserProfile()} className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all">
                      Security Settings
                    </button>
                  </div>
               </div>

               <div className="border border-slate-100 rounded-[2rem] overflow-hidden opacity-60">
                 <UserProfile routing="hash" />
                </div>
            </div>
          )}

          {/* Placeholders for other sections */}
          {(activeSection === 'notifications' || activeSection === 'preferences') && (
            <div className="p-12 text-center py-32">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Settings size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Under Construction</h3>
              <p className="text-slate-500">We're working hard to bring you these settings soon!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
