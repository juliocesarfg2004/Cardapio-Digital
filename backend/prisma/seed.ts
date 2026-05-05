import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@restaurante.com.br' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@restaurante.com.br',
      phone: '11999999999',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log(`✅ Admin created: ${admin.email}`)

  const categories = [
    {
      name: 'Hambúrgueres',
      slug: 'hamburgers',
      description: 'Nossos hambúrgueres artesanais preparados na hora com ingredientes frescos.',
      order: 1,
      items: [
        {
          name: 'X-Burger',
          slug: 'x-burger',
          description: 'Hambúrguer com carne bovina, queijo, alface, tomate e molho especial.',
          price: 18.90,
          image: '/icone-hamburguer.jpg',
        },
        {
          name: 'X-Bacon',
          slug: 'x-bacon',
          description: 'Hambúrguer com carne bovina, queijo e bacon crocante.',
          price: 22.90,
          image: '/icone-hamburguer.jpg',
        },
      ],
    },
    {
      name: 'Pizzas',
      slug: 'pizzas',
      description: 'Pizzas artesanais com massas frescas e ingredientes selecionados.',
      order: 2,
      items: [
        {
          name: 'Pizza Marguerita',
          slug: 'pizza-marguerita',
          description: 'Molho de tomate, mussarela, tomate fresco e manjericão.',
          price: 45.00,
          image: '/icone-pizza.jpg',
        },
        {
          name: 'Pizza Portuguesa',
          slug: 'pizza-portuguesa',
          description: 'Molho de tomate, mussarela, presunto, ovo, cebola e azeitonas.',
          price: 48.00,
          image: '/icone-pizza.jpg',
        },
        {
          name: 'Pizza Calabresa',
          slug: 'pizza-calabresa',
          description: 'Molho de tomate, mussarela, calabresa e cebola.',
          price: 45.00,
          image: '/icone-pizza.jpg',
        },
      ],
    },
    {
      name: 'Esfihas',
      slug: 'esfihas',
      description: 'Esfihas artesanais com massas crocantes e recheios variados.',
      order: 3,
      items: [
        {
          name: 'Esfiha de Carne',
          slug: 'esfiha-carne',
          description: 'Carne moída temperada com cebola, tomate e especiarias.',
          price: 5.00,
          image: '/icone-esfiha.jpg',
        },
        {
          name: 'Esfiha de Queijo',
          slug: 'esfiha-queijo',
          description: 'Queijo mussarela derretido.',
          price: 4.50,
          image: '/icone-esfiha.jpg',
        },
        {
          name: 'Esfiha de Frango',
          slug: 'esfiha-frango',
          description: 'Frango desfiado temperado com Cream Cheese.',
          price: 5.00,
          image: '/icone-esfiha.jpg',
        },
      ],
    },
    {
      name: 'Bebidas',
      slug: 'drinks',
      description: 'Bebidas geladas para completar seu pedido.',
      order: 4,
      items: [
        {
          name: 'Coca Cola Lata',
          slug: 'coca-lata',
          description: 'Coca Cola gelada 350ml.',
          price: 6.00,
          image: '/icone-coca.jpg',
        },
        {
          name: 'Coca Cola 1L',
          slug: 'coca-1l',
          description: 'Coca Cola gelada 1L.',
          price: 10.00,
          image: '/icone-coca.jpg',
        },
        {
          name: 'Guaraná Lata',
          slug: 'guarana-lata',
          description: 'Guaraná Antarctica gelado 350ml.',
          price: 5.50,
          image: '/icone-guarana.jpg',
        },
        {
          name: 'Guaraná 1L',
          slug: 'guarana-1l',
          description: 'Guaraná Antarctica gelado 1L.',
          price: 9.00,
          image: '/icone-guarana.jpg',
        },
      ],
    },
  ]

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        order: cat.order,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
      },
    })

    for (const item of cat.items) {
      await prisma.menuItem.upsert({
        where: { slug: item.slug },
        update: {
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          categoryId: category.id,
        },
        create: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          image: item.image,
          categoryId: category.id,
        },
      })
    }

    console.log(`✅ Category: ${cat.name} (${cat.items.length} items)`)
  }

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
