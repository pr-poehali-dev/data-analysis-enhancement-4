import { useState } from "react"
import Icon from "@/components/ui/icon"
import UploadModal from "@/components/UploadModal"
import { useNavigate } from "react-router-dom"

const mockVideos = [
  { id: 1, title: "Мой первый ролик", views: 1240, likes: 87 },
  { id: 2, title: "Обзор продукта", views: 3400, likes: 210 },
  { id: 3, title: "Влог — день из жизни", views: 890, likes: 45 },
]

export default function Profile() {
  const [showUpload, setShowUpload] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <button onClick={() => navigate("/")} className="text-white/50 hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">VideoFlow</span>
        </button>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-all cursor-pointer"
        >
          <Icon name="Plus" size={16} />
          Загрузить видео
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Avatar + info */}
        <div className="flex items-center gap-5 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Icon name="User" size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-medium">Мой профиль</h1>
            <p className="text-white/50 text-sm mt-1">@username</p>
            <div className="flex gap-4 mt-2 text-xs text-white/40">
              <span><b className="text-white">3</b> видео</span>
              <span><b className="text-white">148</b> подписчиков</span>
              <span><b className="text-white">12</b> подписок</span>
            </div>
          </div>
        </div>

        {/* Videos */}
        <h2 className="text-sm uppercase tracking-wide text-white/40 mb-4">Мои видео</h2>
        <div className="flex flex-col gap-3">
          {mockVideos.map((v) => (
            <div key={v.id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 flex justify-between items-center hover:bg-white/8 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon name="Play" size={16} className="text-white/60" />
                </div>
                <span className="text-sm">{v.title}</span>
              </div>
              <div className="flex gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><Icon name="Eye" size={12} />{v.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Icon name="Heart" size={12} />{v.likes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty CTA */}
        <button
          onClick={() => setShowUpload(true)}
          className="mt-6 w-full border border-dashed border-white/20 rounded-xl py-6 flex flex-col items-center gap-2 text-white/40 hover:border-white/40 hover:text-white/60 transition-all cursor-pointer"
        >
          <Icon name="Plus" size={24} />
          <span className="text-sm">Загрузить новое видео</span>
        </button>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}
