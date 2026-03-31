import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, User, Menu, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 hover:bg-border rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
            <span className="text-background font-display font-bold text-xl">A</span>
          </div>
          <span className="font-display font-bold text-2xl hidden sm:block tracking-tighter">
            AFRI<span className="text-gold">GAME</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher des streams, jeux, tournois..."
            className="w-full bg-background border border-border rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <select className="bg-transparent border-none text-xs font-bold focus:outline-none cursor-pointer hidden sm:block">
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="sw">SW</option>
        </select>
        <button className="p-2 hover:bg-border rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson rounded-full"></span>
        </button>
        
        {user ? (
          <div className="flex items-center gap-3">
            <Link to={`/profile/${user.uid}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100`} 
                alt={user.displayName} 
                className="w-8 h-8 rounded-full border border-gold"
              />
              <span className="hidden sm:block text-sm font-bold truncate max-w-[100px]">{user.displayName || "Gamer"}</span>
            </Link>
            <button 
              onClick={() => auth.signOut()}
              className="p-2 hover:bg-border rounded-full text-muted-foreground hover:text-crimson transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 bg-gold text-background px-4 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">
            <User className="w-5 h-5" />
            <span className="hidden sm:block">Connexion</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
