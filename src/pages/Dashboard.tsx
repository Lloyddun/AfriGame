import { useState, useEffect } from "react";
import { LayoutDashboard, Users, Heart, DollarSign, TrendingUp, Settings } from "lucide-react";
import { StreamerView } from "../components/streaming/StreamerView";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";

export default function Dashboard() {
  const [stats, setStats] = useState([
    { label: "Viewers Actuels", value: "0", change: "0%", icon: Users, color: "text-blue-400" },
    { label: "Nouveaux Followers", value: "0", change: "0%", icon: Heart, color: "text-crimson" },
    { label: "Revenus (Mois)", value: "0 FCFA", change: "0%", icon: DollarSign, color: "text-emerald" },
    { label: "Temps de Stream", value: "0h 0m", change: "0%", icon: TrendingUp, color: "text-gold" },
  ]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const donationsRef = collection(db, "donations");
    const q = query(
      donationsRef, 
      where("toStreamerId", "==", auth.currentUser.uid), 
      orderBy("timestamp", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setDonations(docs);
      
      // Update stats based on real data
      const totalRevenue = docs.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
      setStats(prev => prev.map(s => {
        if (s.label === "Revenus (Mois)") return { ...s, value: `${totalRevenue.toLocaleString()} FCFA` };
        return s;
      }));
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "donations"));

    return () => unsub();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-gold w-8 h-8" />
            DASHBOARD STREAMER
          </h1>
          <p className="text-muted-foreground">Gérez votre chaîne et suivez vos performances.</p>
        </div>
        <button className="bg-crimson text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity glow-crimson uppercase">
          Lancer le Live
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border p-6 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-emerald text-xs font-bold">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stream Manager Section */}
        <div className="lg:col-span-2 space-y-6">
          <StreamerView streamerId={auth.currentUser?.uid || ""} />

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold">HISTORIQUE DES DONS</h3>
            {donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((don) => (
                  <div key={don.id} className="flex items-center justify-between p-3 hover:bg-border/50 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald/20 text-emerald rounded-full flex items-center justify-center font-bold">
                        {don.fromUserName?.[0] || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{don.fromUserName}</p>
                        <p className="text-xs text-muted-foreground">{don.provider}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald">{don.amount} {don.currency}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(don.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Aucun don reçu pour le moment.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Settings className="text-gold w-5 h-5" />
              RÉGLAGES RAPIDES
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Chat réservé aux abonnés</span>
                <div className="w-10 h-5 bg-border rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mode lent (3s)</span>
                <div className="w-10 h-5 bg-gold rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Afficher les dons à l'écran</span>
                <div className="w-10 h-5 bg-gold rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
