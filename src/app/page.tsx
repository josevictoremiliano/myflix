"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Edit, Trash2, Plus, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoModal } from "@/components/videoModal"
import { EditVideoModal } from "@/components/editVideo"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: number
  title: string
  category: string
  image: string
  videoUrl: string
  description: string
}

const extractYouTubeID = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v')
    } else if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1)
    }
    return null
  } catch (e) {
    return null
  }
}

export default function Home() {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    fetch('/api/videos')
      .then(res => res.json())
      .then(data => {
        setVideos(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error(err)
        setIsLoading(false)
      })
  }, [])

  const categories = Array.from(new Set(videos.map(video => video.category)))

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video)
    setVideoModalOpen(true)
  }

  const handleEditClick = (video: Video) => {
    setSelectedVideo(video)
    setEditModalOpen(true)
  }

  const handleDeleteClick = async (videoId: number) => {
    try {
      const res = await fetch(`/api/videos/${videoId}`, { method: 'DELETE' })
      if (res.ok) {
        setVideos(videos.filter(video => video.id !== videoId))
        toast({
          title: "Video Deleted",
          description: "The video has been successfully deleted.",
        })
      } else {
        throw new Error('Failed to delete video')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was a problem deleting the video.",
      })
    }
  }

  const handleEditSubmit = async (editedVideo: Video) => {
    try {
      const res = await fetch(`/api/videos/${editedVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editedVideo,
        }),
      })
      if (res.ok) {
        const updatedVideo = await res.json()
        setVideos(videos.map(video => video.id === updatedVideo.id ? updatedVideo : video))
        setEditModalOpen(false)
        toast({
          title: "Video Updated",
          description: "The video has been successfully updated.",
        })
      } else {
        throw new Error('Failed to update video')
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was a problem updating the video.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-48 pb-20 mb-8 bg-[url('/hero.png')] bg-cover bg-center">
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <h2 className="text-6xl font-bold mb-4">Procurou salvou e não esqueceu!</h2>
          <p className="text-lg mb-6 max-w-2xl">
            No MyFlix vc não esquece aquele video que era para ficar guardado!
          </p>
        </div>
      </section>

      {/* Categories Section */}
      {categories.map((category) => {
        const categoryVideos = videos.filter(video => video.category === category.replace(" ", ""))
        return (
          <section key={category} className="mb-6 max-w-4xl mx-auto px-4">
            <h3 className="text-2xl font-semibold mb-4 px-4">{category}</h3>
            <div className="flex overflow-x-scroll pb-4 hide-scrollbar">
              {isLoading ? (
                // Render Skeletons while loading
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="flex-none w-64 mr-4 bg-gray-800 rounded-lg overflow-hidden">
                    <Skeleton className="w-full h-36" />
                    <div className="p-4">
                      <Skeleton className="w-3/4 h-4 mb-2" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                  </div>
                ))
              ) : categoryVideos.length > 0 ? (
                // Render video cards if videos exist
                categoryVideos.map((video) => (
                  <div key={video.id} className="flex-none w-64 mr-4 bg-gray-800 rounded-lg overflow-hidden">
                    <div className="cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <Image
                        src={
                          video.image ||
                          (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be'))
                            ? `https://img.youtube.com/vi/${extractYouTubeID(video.videoUrl)}/0.jpg`
                            : "https://placehold.co/600x400"
                        }
                        alt={video.title}
                        width={640}
                        height={360}
                        className="w-full h-auto hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                      </div>
                      <div className="flex justify-between">
                        <Button variant="secondary" size="sm" onClick={() => handleEditClick(video)}>
                          <Edit className="mr-2" size={16} />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(video.id)}>
                          <Trash2 className="mr-2" size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Show message if no videos in category
                <p className="text-gray-400 py-4">Ainda não temos vídeos.</p>
              )}
            </div>
          </section>
        )
      })}
      <footer className="py-8 text-center text-gray-500">
        <p>&copy; 2025 MyHomeFlix. All rights reserved.</p>
      </footer>

      {/* Modals */}
      <VideoModal isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)} video={selectedVideo} />
      {selectedVideo && (
        <EditVideoModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          video={selectedVideo}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  )
}

