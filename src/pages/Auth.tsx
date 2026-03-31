import React, { useState } from "react";
import { Mail, Lock, User, Globe, ChevronRight, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("Sénégal");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countries = [
    "Sénégal", "Côte d'Ivoire", "Cameroun", "Nigéria", "Kenya", "Afrique du Sud", "RD Congo", "Gabon"
  ];

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName });

        // Create user doc in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName,
          email,
          country,
          bio: "Passionné de gaming africain.",
          followersCount: 0,
          followingCount: 0,
          badges: [],
          isVerified: false,
          createdAt: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user doc exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          country: "Afrique",
          bio: "Passionné de gaming africain.",
          followersCount: 0,
          followingCount: 0,
          badges: [],
          isVerified: false,
          createdAt: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

        {error && (
          <div className="bg-crimson/10 border border-crimson/20 text-crimson p-3 rounded-xl flex items-center gap-2 mb-6 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase">Pseudo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gold text-background py-3 rounded-xl font-bold mt-4 hover:opacity-90 transition-opacity glow-gold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "CHARGEMENT..." : isLogin ? "SE CONNECTER" : "CRÉER MON COMPTE"}
            {!loading && <ChevronRight className="w-5 h-5" />}
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

          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full border border-border py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-border transition-colors disabled:opacity-50"
          >
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
