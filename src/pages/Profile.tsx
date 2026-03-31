import { User, Heart, Trophy, Video, Settings, MapPin, Calendar } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
        <img src="https://picsum.photos/seed/banner/1200/400" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-end gap-6">
          <div className="relative">
            <img src="https://picsum.photos/seed/me/200" className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-background shadow-xl" />
            <div className="absolute -bottom-2 -right-2 bg-gold text-background p-1.5 rounded-lg shadow-lg">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="pb-2">
            <h1 className="text-3xl font-bold">DakarPro_221</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Sénégal</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Membre depuis 2024</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold uppercase text-xs text-muted-foreground tracking-widest">À propos</h3>
            <p className="text-sm leading-relaxed">
              Joueur pro de Free Fire et créateur de contenu passionné. Je stream tous les soirs à partir de 20h GMT. 
              Rejoignez la meute des Lions ! 🦁
            </p>
            <div className="flex gap-4">
              <div className="text-center flex-1">
                <p className="text-xl font-bold">12k</p>
                <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
              </div>
              <div className="text-center flex-1 border-x border-border">
                <p className="text-xl font-bold">45</p>
                <p className="text-[10px] text-muted-foreground uppercase">Tournois</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xl font-bold">850</p>
                <p className="text-[10px] text-muted-foreground uppercase">Vidéos</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold uppercase text-xs text-muted-foreground tracking-widest">Badges gagnés</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Lion", color: "bg-gold", icon: Trophy },
                { name: "Donateur", color: "bg-emerald", icon: Heart },
                { name: "Vétéran", color: "bg-blue-500", icon: User },
                { name: "Streamer", color: "bg-crimson", icon: Video },
              ].map(badge => (
                <div key={badge.name} className="group relative">
                  <div className={`w-12 h-12 ${badge.color} rounded-xl flex items-center justify-center text-white shadow-lg cursor-help`}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {badge.name}
                  </span >
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4 border-b border-border pb-4">
            <button className="text-gold font-bold border-b-2 border-gold pb-4 -mb-4.5">Derniers Replays</button>
            <button className="text-muted-foreground font-bold hover:text-foreground transition-colors pb-4 -mb-4.5">Clips Favoris</button>
            <button className="text-muted-foreground font-bold hover:text-foreground transition-colors pb-4 -mb-4.5">Tournois</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="group cursor-pointer space-y-3">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={`https://picsum.photos/seed/replay${i}/400/225`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">1:24:15</div>
                </div>
                <h4 className="font-bold text-sm group-hover:text-gold transition-colors">Entraînement intensif Free Fire - Session {i}</h4>
                <p className="text-xs text-muted-foreground">Il y a {i} jours • 1.2k vues</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
