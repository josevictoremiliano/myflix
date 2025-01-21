import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Video {
  id: number
  title: string
  category: string
  image: string
  videoUrl: string
  description: string
}

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: Video | null
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  if (!video) return null

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

  const videoId = extractYouTubeID(video.videoUrl)
  const isYouTube = videoId !== null
  const embedUrl = isYouTube ? `https://www.youtube.com/embed/${videoId}` : ''

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        <div className="aspect-video">
          {isYouTube ? (
            <iframe
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="w-full h-full rounded-lg"
              allowFullScreen
            />
          ) : (
            <video src={video.videoUrl} controls className="w-full h-full">
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <p>{video.description}</p>
        <p className="mt-2"><strong>Categoria:</strong> {video.category}</p>
      </DialogContent>
    </Dialog>
  )
}

