import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"
import UploadModal from "@/components/UploadModal"
import AuthModal from "@/components/AuthModal"

export default function Header() {
  const [showUpload, setShowUpload] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="flex justify-between items-center">
          <div className="text-white text-sm uppercase tracking-wide">VideoFlow</div>
          <nav className="flex items-center gap-6">
            <a
              href="#features"
              className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
            >
              Возможности
            </a>
            <a
              href="#pricing"
              className="text-white hover:text-neutral-400 transition-colors duration-300 uppercase text-sm"
            >
              Тарифы
            </a>

            {/* Upload button */}
            <button
              onClick={() => setShowUpload(true)}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Загрузить видео"
            >
              <Icon name="Plus" size={18} />
            </button>

            {/* Profile button */}
            <button
              onClick={() => setShowAuth(true)}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
              title="Войти в аккаунт"
            >
              <Icon name="User" size={17} />
            </button>
          </nav>
        </div>
      </header>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  )
}