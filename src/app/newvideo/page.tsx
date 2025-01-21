"use client"
import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface Video {
    title: string
    category: string
    image: string
    videoUrl: string
    description: string
}

const PREDEFINED_CATEGORIES = ["Música", "Educação", "Mentoria", "Outros"]

export default function NewVideoPage() {
    const [video, setVideo] = useState<Video>({
        title: "",
        category: "",
        image: "",
        videoUrl: "",
        description: ""
    })
    const { toast } = useToast()
    const router = useRouter()

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setVideo(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(video),
            })
            if (res.ok) {
                toast({
                    title: "Vídeo Salvo",
                    description: "O vídeo foi salvo com sucesso.",
                })
                setVideo({
                    title: "",
                    category: "",
                    image: "",
                    videoUrl: "",
                    description: ""
                })
                router.push('/')
            } else {
                throw new Error('Falha ao salvar o vídeo')
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Erro",
                description: "Houve um problema ao salvar o vídeo.",
            })
        }
    }

    return (
        <main className="bg-black text-white">
            <div className="max-w-2xl mx-auto p-4 mt-16">
                <h1 className="text-3xl font-bold mb-4">Adicionar Novo Vídeo</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        name="title"
                        value={video.title}
                        onChange={handleChange}
                        placeholder="Título"
                        required
                    />
                    <div>
                        <label className="block text-sm font-medium">Categoria</label>
                        <select
                            name="category"
                            value={video.category}
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
                    <Input
                        name="image"
                        value={video.image}
                        onChange={handleChange}
                        placeholder="URL da Imagem"
                    />
                    <span className="text-xs mr-2 text-gray-500">
                        Deixe em branco para usar a imagem do vídeo do YouTube
                    </span>
                    <Input
                        name="videoUrl"
                        value={video.videoUrl}
                        onChange={handleChange}
                        placeholder="URL do Vídeo"
                        required
                    />
                    <Textarea
                        name="description"
                        value={video.description}
                        onChange={handleChange}
                        placeholder="Descrição"
                        required
                    />
                   <div className="flex justify-between w-flex">
                   <Button type="submit" variant="secondary">Salvar Vídeo</Button>

                    <Button variant="destructive" onClick={() => router.push('/')}>
                        Cancelar
                    </Button>
                   </div>
                </form>
            </div>
        </main>
    )
}