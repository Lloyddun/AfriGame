import { useState, useEffect } from "react";
import { Home, Compass, Trophy, LayoutDashboard, Users, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Sidebar() {
  const location = useLocation();
  const [recommendedStreamers, setRecommendedStreamers] = useState<any[]>([]);

  useEffect(() => {
    const streamsRef = collection(db, "streams");
    const q = query(streamsRef, where("isLive", "==", true), limit(5));

    const unsub = onSnapshot(q, (snapshot) => {
      setRecommendedStreamers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "streams"));

    return () => unsub();
  }, []);

  const navItems = [
    { icon: Home, label: "Accueil", path: "/" },
    { icon: Compass, label: "Découvrir", path: "/browse" },
    { icon: Trophy, label: "Tournois", path: "/tournaments" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clans", path: "/clans" },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border hidden md:flex flex-col overflow-y-auto">
      <div className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-gold text-background font-bold"
                    : "hover:bg-border text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-border">
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 px-3 tracking-widest">Chaînes recommandées</h3>
        <ul className="space-y-3">
          {recommendedStreamers.length > 0 ? (
            recommendedStreamers.map((streamer) => (
              <li key={streamer.id}>
                <Link to={`/stream/${streamer.id}`} className="flex items-center gap-3 px-3 hover:bg-border py-1 rounded-lg transition-colors group">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${streamer.streamerId}/100`} alt={streamer.streamerName} className="w-8 h-8 rounded-full object-cover border border-border" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald border-2 border-card rounded-full"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate group-hover:text-gold transition-colors">{streamer.streamerName}</p>
                    <p className="text-xs text-muted-foreground truncate">{streamer.game}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-crimson rounded-full"></div>
                    <span className="text-[10px] font-bold text-crimson">{streamer.viewers || 0}</span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-3 text-xs text-muted-foreground italic">Aucun live en cours</li>
          )}
        </ul>
      </div>

      <div className="mt-auto p-4 border-t border-border space-y-2">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg font-bold hover:bg-border transition-colors text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
          Paramètres
        </Link>
        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-bold text-crimson hover:bg-crimson/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
