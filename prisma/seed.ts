import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Removido: loop para upsert de tags
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })