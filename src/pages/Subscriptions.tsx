import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import AuthModal from "@/components/AuthModal"

const SUBSCRIPTIONS_FEED_URL = "https://functions.poehali.dev/c0cc7c09-3c84-40e4-b51f-06e7d996d89d"
const SUBSCRIBE_URL = "https://functions.poehali.dev/19738def-18c7-452c-9b41-395da0956288"

interface Video {
  id: number
  title: string
  hashtags: string[]
  preview_url: string
  views: number
  likes: number
  author_id: number
  author_username: string
  author_name: string
  is_liked: boolean
}

export default function Subscriptions() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState<Video[]>([])
  const [liked, setLiked] = useState<number[]>([])
  const [subscribed, setSubscribed] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState<{ id: number; username: string; first_name: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("auth_user")
    const token = localStorage.getItem("auth_token")
    if (!saved || !token) {
      setLoading(false)
      setShowAuth(true)
      return
    }
    setUser(JSON.parse(saved))
    fetchFeed(token)
  }, [])

  const fetchFeed = async (token: string) => {
    setLoading(true)
    try {
      const res = await fetch(SUBSCRIPTIONS_FEED_URL, {
        headers: { "X-Auth-Token": token },
      })
      const data = await res.json()
      if (data.videos) {
        setVideos(data.videos)
        setLiked(data.videos.filter((v: Video) => v.is_liked).map((v: Video) => v.id))
        setSubscribed(data.videos.map((v: Video) => v.author_id))
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleLike = (id: number) => {
    setLiked((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const toggleSubscribe = async (authorId: number) => {
    const token = localStorage.getItem("auth_token")
    const isSubscribed = subscribed.includes(authorId)
    setSubscribed((prev) => isSubscribed ? prev.filter((i) => i !== authorId) : [...prev, authorId])
    await fetch(SUBSCRIBE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token || "" },
      body: JSON.stringify({ author_id: authorId, action: isSubscribed ? "unsubscribe" : "subscribe" }),
    })
  }

  const handleAuth = (authUser: { id: number; username: string; first_name: string }) => {
    setUser(authUser)
    const token = localStorage.getItem("auth_token")
    if (token) fetchFeed(token)
  }

  const avatarColors = [
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-500",
    "from-orange-500 to-red-500",
    "from-green-500 to-teal-500",
    "from-yellow-500 to-orange-500",
    "from-pink-500 to-rose-500",
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/90 backdrop-blur-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate("/")} className="text-white text-sm uppercase tracking-wide hover:text-white/70 transition-colors cursor-pointer">
            VideoFlow
          </button>
          <div className="flex items-center gap-2 text-white/80">
            <Icon name="Users" size={16} />
            <span className="text-sm font-medium">Подписки</span>
          </div>
          <button
            onClick={() => navigate("/feed")}
            className="flex items-center gap-1.5 text-white/50 text-sm hover:text-white transition-colors cursor-pointer"
          >
            <Icon name="Compass" size={15} />
            Все видео
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Icon name="Users" size={28} className="text-white/30" />
            </div>
            <p className="text-white/50 text-lg mb-2">Пока нет подписок</p>
            <p className="text-white/30 text-sm mb-6">Подпишись на авторов в ленте, чтобы видеть их видео здесь</p>
            <button
              onClick={() => navigate("/feed")}
              className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-all cursor-pointer"
            >
              Перейти в ленту
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-lg font-medium mb-6 text-white/80">Видео от авторов, на которых ты подписан</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, i) => (
                <div key={video.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 transition-all">
                  <div className="relative aspect-video overflow-hidden bg-neutral-800">
                    {video.preview_url ? (
                      <img src={video.preview_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Icon name="Video" size={32} className="text-white/20" />
                      </div>
                    )}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-xs font-medium`}>
                          {(video.author_name || video.author_username || "?")[0].toUpperCase()}
                        </div>
                        <span className="text-xs text-white/50">{video.author_name || video.author_username}</span>
                      </div>
                      <button
                        onClick={() => toggleSubscribe(video.author_id)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          subscribed.includes(video.author_id)
                            ? "bg-white/10 border-white/20 text-white/50"
                            : "border-white/20 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {subscribed.includes(video.author_id) ? "Подписан" : "+ Подписаться"}
                      </button>
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
          </>
        )}
      </div>

      {showAuth && <AuthModal onClose={() => { setShowAuth(false); navigate("/feed") }} onAuth={handleAuth} />}
    </div>
  )
}
