import { Link, useLocation } from "react-router-dom";
import { Home, Compass, Trophy, LayoutDashboard, User, Users, Gamepad2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: Compass, label: "Découvrir", path: "/browse" },
  { icon: Trophy, label: "Tournois", path: "/tournaments" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Clans", path: "/clans" },
];

const recommendedStreamers = [
  { name: "GamerDZ", game: "FIFA 24", viewers: "1.2k", avatar: "https://picsum.photos/seed/gamer1/100" },
  { name: "QueenOfLagos", game: "PUBG Mobile", viewers: "850", avatar: "https://picsum.photos/seed/gamer2/100" },
  { name: "DakarPro", game: "Free Fire", viewers: "2.4k", avatar: "https://picsum.photos/seed/gamer3/100" },
];

export default function Sidebar() {
  const location = useLocation();

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
        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4 px-3">Chaînes recommandées</h3>
        <ul className="space-y-3">
          {recommendedStreamers.map((streamer) => (
            <li key={streamer.name}>
              <Link to={`/stream/${streamer.name}`} className="flex items-center gap-3 px-3 hover:bg-border py-1 rounded-lg transition-colors group">
                <div className="relative">
                  <img src={streamer.avatar} alt={streamer.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald border-2 border-card rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{streamer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{streamer.game}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-crimson rounded-full"></div>
                  <span className="text-[10px] font-bold text-crimson">{streamer.viewers}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="bg-gradient-to-br from-gold/20 to-crimson/20 p-4 rounded-xl border border-gold/30">
          <p className="text-xs font-bold mb-2">MODE ÉCONOMIE DE DONNÉES</p>
          <p className="text-[10px] text-muted-foreground mb-3 leading-tight">
            Optimisez votre streaming pour les réseaux 3G/4G.
          </p>
          <button className="w-full bg-gold text-background text-xs font-bold py-1.5 rounded-lg hover:opacity-90 transition-opacity">
            ACTIVER
          </button>
        </div>
      </div>
    </aside>
  );
}
