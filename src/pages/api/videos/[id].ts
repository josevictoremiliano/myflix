import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Video } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const videoId = parseInt(id as string)

  if (isNaN(videoId)) {
    res.status(400).json({ error: 'Invalid video ID' })
    return
  }

  if (req.method === 'GET') {
    const video = await prisma.video.findUnique({
      where: { id: videoId },
    })
    if (video) {
      res.status(200).json(video)
    } else {
      res.status(404).json({ error: 'Video not found' })
    }
  } else if (req.method === 'PUT') {
    const { title, category, image, videoUrl, description } = req.body
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        title,
        category,
        image,
        videoUrl,
        description,
      },
    })
    res.status(200).json(updatedVideo)
  } else if (req.method === 'DELETE') {
    await prisma.video.delete({
      where: { id: videoId },
    })
    res.status(204).end()
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}