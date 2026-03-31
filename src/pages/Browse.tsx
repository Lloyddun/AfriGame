import { Search, Filter, Play, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const streams = [
  { id: "1", streamer: "NairobiLegend", title: "Road to Global Elite - CS2", game: "CS2", viewers: "3.2k", country: "Kenya", language: "English", thumbnail: "https://picsum.photos/seed/cs2/400/225" },
  { id: "2", streamer: "DakarQueen", title: "PUBG Mobile - Squad Wipe", game: "PUBG Mobile", viewers: "1.8k", country: "Sénégal", language: "Français", thumbnail: "https://picsum.photos/seed/pubg/400/225" },
  { id: "3", streamer: "JoburgPro", title: "Free Fire World Series Qualifiers", game: "Free Fire", viewers: "5.4k", country: "South Africa", language: "English", thumbnail: "https://picsum.photos/seed/ff/400/225" },
  { id: "4", streamer: "LagosGamer", title: "Mobile Legends: Bang Bang", game: "MLBB", viewers: "2.1k", country: "Nigeria", language: "English", thumbnail: "https://picsum.photos/seed/mlbb/400/225" },
  { id: "5", streamer: "AbidjanPro", title: "FIFA 24 Ultimate Team", game: "FIFA 24", viewers: "1.5k", country: "Côte d'Ivoire", language: "Français", thumbnail: "https://picsum.photos/seed/fifa2/400/225" },
  { id: "6", streamer: "KigaliGamer", title: "Wild Rift Ranked", game: "Wild Rift", viewers: "900", country: "Rwanda", language: "Swahili", thumbnail: "https://picsum.photos/seed/wild/400/225" },
];

export default function Browse() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">DÉCOUVRIR</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-card border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-gold w-64"
            />
          </div>
          <button className="p-2 bg-card border border-border rounded-xl hover:border-gold transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {["En direct", "Replays", "Clips", "Catégories"].map((tab) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-colors ${
              tab === "En direct" ? "bg-gold text-background" : "bg-card border border-border hover:border-gold"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {streams.map((stream) => (
          <Link key={stream.id} to={`/stream/${stream.id}`} className="group space-y-3">
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 bg-crimson text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Users className="w-3 h-3" />
                {stream.viewers}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {stream.language}
              </div>
            </div>
            <div className="flex gap-3">
              <img src={`https://picsum.photos/seed/${stream.streamer}/100`} className="w-10 h-10 rounded-full border-2 border-border" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate group-hover:text-gold transition-colors">{stream.title}</h3>
                <p className="text-xs text-muted-foreground">{stream.streamer} • {stream.country}</p>
                <p className="text-xs text-gold font-medium">{stream.game}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
