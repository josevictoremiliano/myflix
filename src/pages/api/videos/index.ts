import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Video } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const videos = await prisma.video.findMany()
    res.status(200).json(videos)
  } else if (req.method === 'POST') {
    const { title, category, image, videoUrl, description } = req.body
    const newVideo = await prisma.video.create({
      data: {
        title,
        category,
        image,
        videoUrl,
        description,
      },
    })
    res.status(201).json(newVideo)
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}