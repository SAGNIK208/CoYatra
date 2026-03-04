import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { Calendar, Wallet, CheckCircle2 } from "lucide-react";
import logo from "../assets/logo.jpg";
import { Link, useSearchParams } from "react-router-dom";

export function LandingPage() {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Already Signed In Redirect handled by App.tsx, but good to have a CTA here just in case */}
      <SignedIn>
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-4">
          <img src={logo} alt="CoYatra" className="h-16 w-16 rounded-2xl mb-6 shadow-xl" />
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">You're already signed in!</h2>
          <p className="text-slate-500 mb-8 text-center max-w-sm">Ready to continue planning your amazing journeys?</p>
          <Link to="/dashboard" className="btn-primary px-8 py-3 text-lg h-[54px] flex items-center justify-center min-w-[200px]">
            Go to Dashboard
          </Link>
        </div>
      </SignedIn>

      <SignedOut>
        {/* Left Side: Messaging */}
        <div className="flex-1 bg-primary relative overflow-hidden flex flex-col p-8 md:p-16 justify-center items-center min-h-[50vh] md:min-h-screen text-center">
          {/* Subtle Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-white blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-xl flex flex-col items-center">
            <div className="flex flex-col items-center gap-6 mb-10">
              <img src={logo} alt="CoYatra Logo" className="h-24 w-24 md:h-32 md:w-32 rounded-3xl shadow-2xl border-4 border-white/20" />
              <span className="text-4xl font-black text-white tracking-tighter">CoYatra</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
              Plan your next journey <br />
              <span className="text-teal-300">together, seamlessly.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-50/80 mb-12 leading-relaxed font-medium">
              The all-in-one workspace for travel groups. Coordinate itineraries, split expenses, and manage checklists without the spreadsheet headache.
            </p>

            <div className="space-y-4 w-full max-w-sm">
              {[
                { icon: Calendar, text: "Unified Itinerary Planner", color: "text-blue-200" },
                { icon: Wallet, text: "Shared Expense Management", color: "text-teal-300" },
                { icon: CheckCircle2, text: "Group Trip Checklists", color: "text-blue-100" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 text-white/90 group justify-start">
                  <div className={`p-2 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/20 transition-colors ${feature.color}`}>
                    <feature.icon size={20} />
                  </div>
                  <span className="font-semibold text-sm md:text-base">{feature.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-16 flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              <CheckCircle2 size={12} />
              <span>Trusted by 10,000+ travelers worldwide</span>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50">
          <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-right-4 duration-700">
            {isSignUp ? (
              <SignUp 
                routing="path" 
                path="/" 
                signInUrl="/?mode=signin"
                afterSignUpUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "shadow-none border-none bg-transparent p-0",
                    headerTitle: "text-2xl font-black text-slate-900 tracking-tight",
                    headerSubtitle: "text-slate-500 font-medium",
                    socialButtonsBlockButton: "bg-white border-border hover:bg-slate-50 transition-all font-semibold text-slate-600 h-12",
                    formButtonPrimary: "bg-primary hover:bg-blue-700 transition-all font-bold h-12 shadow-md shadow-primary/20",
                    footerActionLink: "text-primary hover:text-blue-700 font-bold",
                    formFieldInput: "h-12 border-slate-200 focus:border-primary focus:ring-primary/20",
                    formFieldLabel: "text-slate-700 font-bold text-xs uppercase"
                  }
                }}
              />
            ) : (
              <SignIn 
                routing="path" 
                path="/" 
                signUpUrl="/?mode=signup"
                afterSignInUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "shadow-none border-none bg-transparent p-0",
                    headerTitle: "text-2xl font-black text-slate-900 tracking-tight",
                    headerSubtitle: "text-slate-500 font-medium",
                    socialButtonsBlockButton: "bg-white border-border hover:bg-slate-100 transition-all font-semibold text-slate-600 h-12",
                    formButtonPrimary: "bg-primary hover:bg-blue-700 transition-all font-bold h-12 shadow-md shadow-primary/20",
                    footerActionLink: "text-primary hover:text-blue-700 font-bold",
                    formFieldInput: "h-12 border-slate-200 focus:border-primary focus:ring-primary/20",
                    formFieldLabel: "text-slate-700 font-bold text-xs uppercase"
                  }
                }}
              />
            )}
          </div>
          
          <div className="mt-8 text-center text-[10px] text-slate-400 font-medium max-w-[280px]">
            By continuing, you agree to CoYatra's Terms of Service and Privacy Policy.
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
