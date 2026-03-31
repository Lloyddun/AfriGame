import { useState } from "react";
import { Mail, Lock, User, Globe, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [country, setCountry] = useState("Sénégal");

  const countries = [
    "Sénégal", "Côte d'Ivoire", "Cameroun", "Nigéria", "Kenya", "Afrique du Sud", "RD Congo", "Gabon"
  ];

  return (
    <div className="max-w-md mx-auto mt-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">
          AFRI<span className="text-gold">GAME</span>
        </h1>
        <p className="text-muted-foreground">
          {isLogin ? "Bon retour parmi nous, Gamer !" : "Rejoignez la plus grande communauté gaming d'Afrique."}
        </p>
      </div>

      <div className="bg-card border border-border p-8 rounded-2xl shadow-xl">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 pb-2 font-bold transition-colors border-b-2 ${
              isLogin ? "border-gold text-gold" : "border-transparent text-muted-foreground"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 pb-2 font-bold transition-colors border-b-2 ${
              !isLogin ? "border-gold text-gold" : "border-transparent text-muted-foreground"
            }`}
          >
            Inscription
          </button>
        </div>

        <form className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Pseudo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Gamer_221"
                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-muted-foreground uppercase">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Pays</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-gold appearance-none"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button className="w-full bg-gold text-background py-3 rounded-xl font-bold mt-4 hover:opacity-90 transition-opacity glow-gold flex items-center justify-center gap-2">
            {isLogin ? "SE CONNECTER" : "CRÉER MON COMPTE"}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continuer avec</span>
            </div>
          </div>

          <button className="w-full border border-border py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-border transition-colors">
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" />
            Google
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        En continuant, vous acceptez nos <Link to="#" className="text-gold">Conditions d'utilisation</Link> et notre <Link to="#" className="text-gold">Politique de confidentialité</Link>.
      </p>
    </div>
  );
}
