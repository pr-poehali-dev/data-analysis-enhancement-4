import { useState, useRef } from "react"
import Icon from "@/components/ui/icon"

interface UploadModalProps {
  onClose: () => void
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [hashtags, setHashtags] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const parsedTags = hashtags.match(/#\w+/g) || []

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type.startsWith("video/")) setFile(dropped)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-lg font-medium">Загрузить видео</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer mb-4 ${
            dragging ? "border-white/50 bg-white/5" : "border-white/20 hover:border-white/30"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFile} />
          {file ? (
            <>
              <Icon name="CheckCircle" size={32} className="text-green-400" />
              <p className="text-white text-sm font-medium text-center">{file.name}</p>
              <p className="text-white/50 text-xs">{(file.size / 1024 / 1024).toFixed(1)} МБ</p>
            </>
          ) : (
            <>
              <Icon name="Upload" size={32} className="text-white/40" />
              <p className="text-white/70 text-sm text-center">Перетащи видео сюда<br />или нажми для выбора</p>
              <p className="text-white/30 text-xs">MP4, MOV, AVI — до 2 ГБ</p>
            </>
          )}
        </div>

        <input
          type="text"
          placeholder="Название видео..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-white/30 mb-3"
        />

        <input
          type="text"
          placeholder="#хэштег #ещёодин #тематика"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 outline-none focus:border-white/30 mb-2"
        />

        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {parsedTags.map((tag) => (
              <span key={tag} className="text-blue-400 text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}

        <button
          disabled={!file || !title}
          className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 cursor-pointer"
        >
          Опубликовать
        </button>
      </div>
    </div>
  )
}