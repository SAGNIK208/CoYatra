import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { TripWorkspacePage } from "@/pages/TripWorkspacePage";
import { JoinTripPage } from "@/pages/JoinTripPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { AuthProxy } from "./components/AuthProxy";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <AuthProxy>
                  <DashboardPage />
                </AuthProxy>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/trips/:id" 
          element={
            <>
              <SignedIn>
                <AuthProxy>
                  <TripWorkspacePage />
                </AuthProxy>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/join/:inviteCode" 
          element={
            <>
              <SignedIn>
                <AuthProxy>
                  <JoinTripPage />
                </AuthProxy>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <>
              <SignedIn>
                <AuthProxy>
                  <SettingsPage />
                </AuthProxy>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
