import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import UploadModal from "@/components/UploadModal"
import AuthModal from "@/components/AuthModal"

const mockVideos = [
  {
    id: 1,
    author: "Алексей",
    avatar: "А",
    avatarColor: "from-purple-500 to-pink-500",
    title: "Как я за месяц набрал 10к подписчиков",
    hashtags: ["#рост", "#советы", "#влог"],
    views: 12400,
    likes: 870,
    preview: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&q=80",
  },
  {
    id: 2,
    author: "Мария",
    avatar: "М",
    avatarColor: "from-blue-500 to-cyan-500",
    title: "Обзор нового iPhone — стоит ли покупать?",
    hashtags: ["#обзор", "#техника", "#iphone"],
    views: 34200,
    likes: 2100,
    preview: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  },
  {
    id: 3,
    author: "Дмитрий",
    avatar: "Д",
    avatarColor: "from-orange-500 to-red-500",
    title: "Влог — день из жизни разработчика",
    hashtags: ["#влог", "#разработка", "#it"],
    views: 8900,
    likes: 450,
    preview: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
  {
    id: 4,
    author: "Анна",
    avatar: "А",
    avatarColor: "from-green-500 to-teal-500",
    title: "Рецепт идеальной пасты карбонара",
    hashtags: ["#еда", "#рецепт", "#кулинария"],
    views: 21000,
    likes: 1340,
    preview: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  },
  {
    id: 5,
    author: "Игорь",
    avatar: "И",
    avatarColor: "from-yellow-500 to-orange-500",
    title: "Путешествие в Японию — первые впечатления",
    hashtags: ["#путешествие", "#япония", "#влог"],
    views: 45600,
    likes: 3200,
    preview: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&q=80",
  },
  {
    id: 6,
    author: "Света",
    avatar: "С",
    avatarColor: "from-pink-500 to-rose-500",
    title: "Тренировка дома без оборудования — 20 минут",
    hashtags: ["#спорт", "#тренировка", "#фитнес"],
    views: 18700,
    likes: 980,
    preview: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
  },
]

export default function Feed() {
  const [liked, setLiked] = useState<number[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  const toggleLike = (id: number) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur-sm px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="text-white text-sm uppercase tracking-wide hover:text-white/70 transition-colors cursor-pointer">
          VideoFlow
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUpload(true)}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Загрузить видео"
          >
            <Icon name="Plus" size={18} />
          </button>
          <button
            onClick={() => setShowAuth(true)}
            className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            title="Войти"
          >
            <Icon name="User" size={17} />
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-lg font-medium mb-6 text-white/80">Популярные видео</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockVideos.map((video) => (
            <div key={video.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-neutral-800">
                <img
                  src={video.preview}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon name="Play" size={20} className="text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 rounded px-2 py-0.5 text-xs text-white/80 flex items-center gap-1">
                  <Icon name="Eye" size={10} />
                  {video.views.toLocaleString()}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${video.avatarColor} flex items-center justify-center text-xs font-medium`}>
                    {video.avatar}
                  </div>
                  <span className="text-xs text-white/50">{video.author}</span>
                </div>
                <p className="text-sm font-medium leading-snug mb-3">{video.title}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {video.hashtags.map((tag) => (
                    <span key={tag} className="text-blue-400 text-xs">{tag}</span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleLike(video.id)}
                    className={`flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${liked.includes(video.id) ? "text-red-400" : "text-white/40 hover:text-red-400"}`}
                  >
                    <Icon name="Heart" size={14} />
                    {video.likes + (liked.includes(video.id) ? 1 : 0)}
                  </button>
                  <button className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-colors cursor-pointer">
                    <Icon name="Share2" size={12} />
                    Поделиться
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
