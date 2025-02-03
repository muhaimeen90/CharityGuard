import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'tes123t@example.com'
      }
    })

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('test12sds3', 10)
      const user = await prisma.user.create({
        data: {
          email: 'tes123t@example.com',
          password: hashedPassword,
          smartWalletAddress: '0x123tessdsdt456',
          role: 'DONOR',
        },
      })
      console.log('User created:', user)
    } else {
      console.log('User already exists, skipping creation')
    }
  } catch (error) {
    console.error('Error in seed:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })