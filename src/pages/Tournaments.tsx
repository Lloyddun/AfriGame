import { useState } from "react";
import { Trophy, Calendar, Users, Filter, Search } from "lucide-react";

const tournaments = [
  {
    id: "1",
    title: "COUPES DES LIONS - MLBB",
    game: "Mobile Legends",
    region: "Afrique Centrale",
    date: "15 Avril 2026",
    prize: "1,000,000 FCFA",
    entry: "2,000 FCFA",
    slots: "64/128",
    status: "Inscriptions ouvertes",
    image: "https://picsum.photos/seed/tourn1/800/400",
  },
  {
    id: "2",
    title: "LAGOS SHOWDOWN - PUBG",
    game: "PUBG Mobile",
    region: "Afrique de l'Ouest",
    date: "22 Avril 2026",
    prize: "500,000 Naira",
    entry: "Gratuit",
    slots: "150/200",
    status: "Inscriptions ouvertes",
    image: "https://picsum.photos/seed/tourn2/800/400",
  },
  {
    id: "3",
    title: "DAKAR OPEN - FIFA 24",
    game: "FIFA 24",
    region: "Afrique de l'Ouest",
    date: "10 Mai 2026",
    prize: "250,000 FCFA",
    entry: "1,000 FCFA",
    slots: "32/32",
    status: "Complet",
    image: "https://picsum.photos/seed/tourn3/800/400",
  },
];

export default function Tournaments() {
  const [filter, setFilter] = useState("Tous");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="text-gold w-8 h-8" />
            TOURNOIS ESPORTS
          </h1>
          <p className="text-muted-foreground">Participez aux plus grandes compétitions du continent.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-gold text-background px-6 py-2 rounded-full font-bold hover:opacity-90 transition-opacity">Créer un tournoi</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un tournoi..."
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {["Tous", "FIFA", "MLBB", "PUBG", "Free Fire"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-gold text-background" : "bg-card border border-border hover:border-gold"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tournaments.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-gold transition-colors">
            <div className="relative aspect-video">
              <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold border border-gold/30">
                {t.region}
              </div>
              <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                t.status === "Complet" ? "bg-crimson text-white" : "bg-emerald text-white"
              }`}>
                {t.status}
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{t.title}</h3>
                <span className="text-gold font-bold">{t.prize}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {t.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {t.slots} joueurs
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  {t.game}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-emerald">
                  Frais: {t.entry}
                </div>
              </div>
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                t.status === "Complet" 
                ? "bg-border text-muted-foreground cursor-not-allowed" 
                : "bg-gold text-background hover:opacity-90 glow-gold"
              }`}>
                {t.status === "Complet" ? "TOURNOI COMPLET" : "S'INSCRIRE MAINTENANT"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
