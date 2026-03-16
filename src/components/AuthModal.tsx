import Icon from "@/components/ui/icon"

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white text-lg font-medium">Войти в аккаунт</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer">
            <Icon name="X" size={20} />
          </button>
        </div>
        <p className="text-white/40 text-sm mb-8">Выбери удобный способ входа</p>

        <div className="flex flex-col gap-3">
          {/* VK */}
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#0077FF]/15 border border-[#0077FF]/30 hover:bg-[#0077FF]/25 transition-all cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-[#0077FF] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.27h-1.61c-.61 0-.8-.49-1.89-1.59-.96-.93-1.38-.93-1.38 0v1.59c0 .45-.14.59-1.27.59-1.87 0-3.94-1.13-5.4-3.25C4.38 10.1 3.75 8.1 3.75 7.7c0-.2.07-.39.28-.39h1.61c.21 0 .29.1.37.31.41 1.19 1.1 2.24 1.38 2.24.1 0 .15-.05.15-.31V8.07c-.04-.72-.41-1.07-.41-1.07s-.14-.17.1-.17h2.54c.17 0 .24.1.24.31v2.74c0 .17.07.24.12.24.1 0 .19-.07.39-.27 1.2-1.35 2.07-3.44 2.07-3.44.07-.17.17-.31.38-.31h1.61c.48 0 .59.24.48.45-.2.93-2.09 3.56-2.09 3.56-.17.27-.24.41 0 .72 1.36 1.51 1.75 2.22 1.75 2.22.1.19.04.48-.48.48z"/>
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Войти через VK</span>
            <Icon name="ChevronRight" size={16} className="text-white/30 ml-auto group-hover:text-white/60 transition-colors" />
          </button>

          {/* Telegram */}
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-[#26A5E4]/15 border border-[#26A5E4]/30 hover:bg-[#26A5E4]/25 transition-all cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-[#26A5E4] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.56-.46.7-.93.43l-2.58-1.9-1.24 1.19c-.14.14-.26.26-.52.26l.19-2.66 4.84-4.37c.21-.19-.05-.29-.32-.1L7.6 14.08l-2.55-.8c-.55-.17-.56-.55.12-.82l9.97-3.84c.46-.17.87.11.5 1.18z"/>
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Войти через Telegram</span>
            <Icon name="ChevronRight" size={16} className="text-white/30 ml-auto group-hover:text-white/60 transition-colors" />
          </button>

          {/* Google */}
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Войти через Google</span>
            <Icon name="ChevronRight" size={16} className="text-white/30 ml-auto group-hover:text-white/60 transition-colors" />
          </button>
        </div>

        <p className="text-white/20 text-xs text-center mt-6">
          Входя, вы соглашаетесь с условиями использования
        </p>
      </div>
    </div>
  )
}
