import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const Home = lazy(() => import("./pages/Home"));
const Browse = lazy(() => import("./pages/Browse"));
const StreamPage = lazy(() => import("./pages/StreamPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const Auth = lazy(() => import("./pages/Auth"));

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-1 pt-16">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 ml-0 md:ml-64">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/stream/:id" element={<StreamPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
    </Router>
  );
}
