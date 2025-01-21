import { useState, ChangeEvent, FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Video {
    id: number
    title: string
    category: string
    image: string
    videoUrl: string
    description: string
}

interface EditVideoModalProps {
    isOpen: boolean
    onClose: () => void
    video: Video
    onSubmit: (video: Video) => void
}

const PREDEFINED_CATEGORIES = ["Música", "Educação", "Mentoria", "Outros"]

export function EditVideoModal({ isOpen, onClose, video, onSubmit }: EditVideoModalProps) {
    const [editedVideo, setEditedVideo] = useState<Video>(video)

    if (!video) return null

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditedVideo((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!editedVideo.image) {
            const videoId = new URL(editedVideo.videoUrl).searchParams.get("v")
            if (videoId) {
                editedVideo.image = `https://img.youtube.com/vi/${videoId}/0.jpg`
            }
        }
        onSubmit(editedVideo)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Video</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="title" value={editedVideo.title} onChange={handleChange} placeholder="Title" />
                    <Input name="image" value={editedVideo.image} onChange={handleChange} placeholder="Image URL" />
                    <span className="text-xs mr-2 text-gray-500">
                        Deixe em branco para usar a imagem do vídeo do YouTube
                    </span>
                    <Input name="videoUrl" value={editedVideo.videoUrl} onChange={handleChange} placeholder="Video URL" />
                    <span className="text-xs mr-2 text-gray-500">
                        Suporta vídeos do YouTube
                    </span>
                    <Textarea
                        name="description"
                        value={editedVideo.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <div>
                        <label className="block text-sm font-medium">Categoria</label>
                        <select
                            name="category"
                            value={editedVideo.category}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-black"
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {PREDEFINED_CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit">Save Changes</Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
