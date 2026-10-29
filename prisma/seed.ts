import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const categories = [
  { name: "Development", description: "development" },
  { name: "Design", description: "design" },
  { name: "Business", description: "business" },
  { name: "Marketing", description: "marketing" },
  { name: "Photography", description: "photography" },
]

async function main() {
  console.log("Seeding categories...")

  for (const cat of categories) {
    const existing = await prisma.category.findUnique({
      where: { name: cat.name },
    })

    if (!existing) {
      await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
        },
      })
      console.log(`Created category: ${cat.name}`)
    } else {
      console.log(`Skipped existing category: ${cat.name}`)
    }
  }

  console.log("Seeding finished successfully.")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

