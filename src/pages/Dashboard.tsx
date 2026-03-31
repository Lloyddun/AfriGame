import { LayoutDashboard, Users, Heart, DollarSign, TrendingUp, Key, Settings } from "lucide-react";

const stats = [
  { label: "Viewers Actuels", value: "1,243", change: "+12%", icon: Users, color: "text-blue-400" },
  { label: "Nouveaux Followers", value: "450", change: "+5%", icon: Heart, color: "text-crimson" },
  { label: "Revenus (Mars)", value: "125,000 FCFA", change: "+24%", icon: DollarSign, color: "text-emerald" },
  { label: "Temps de Stream", value: "42h 15m", change: "+8%", icon: TrendingUp, color: "text-gold" },
];

export default function Dashboard() {
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
        <button className="bg-crimson text-white px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity glow-crimson">
          LANCER LE LIVE
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
        {/* Stream Key Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Key className="text-gold w-5 h-5" />
              CONFIGURATION DU STREAM
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Serveur RTMP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="rtmp://stream.afrigame.com/live"
                    className="flex-1 bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none"
                  />
                  <button className="bg-border px-4 py-2 rounded-xl text-xs font-bold hover:bg-border/80 transition-colors">Copier</button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground uppercase">Clé de stream</label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    readOnly
                    value="live_542198754_afri_xX99Zz"
                    className="flex-1 bg-background border border-border rounded-xl py-2 px-4 text-sm focus:outline-none"
                  />
                  <button className="bg-border px-4 py-2 rounded-xl text-xs font-bold hover:bg-border/80 transition-colors">Copier</button>
                </div>
              </div>
            </div>
            <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl">
              <p className="text-xs text-gold leading-relaxed">
                <strong>Conseil :</strong> Utilisez OBS Studio avec le profil "AfriGame Mobile" pour une meilleure stabilité sur les connexions instables.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold">HISTORIQUE DES DONS</h3>
            <div className="space-y-4">
              {[
                { user: "Moussa_Gamer", amount: "5,000 FCFA", method: "Orange Money", date: "Il y a 2h" },
                { user: "Fatou_MLBB", amount: "2,500 FCFA", method: "Wave", date: "Il y a 5h" },
                { user: "Koffi_Pro", amount: "10,000 FCFA", method: "MTN Mobile Money", date: "Hier" },
              ].map((don, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-border/50 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald/20 text-emerald rounded-full flex items-center justify-center font-bold">
                      {don.user[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{don.user}</p>
                      <p className="text-xs text-muted-foreground">{don.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald">{don.amount}</p>
                    <p className="text-[10px] text-muted-foreground">{don.date}</p>
                  </div>
                </div>
              ))}
            </div>
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
