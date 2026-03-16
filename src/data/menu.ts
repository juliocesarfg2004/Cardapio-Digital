export const menu = [
  {
    id: "hamburgers",
    slug: "hamburgers",
    name: "Hambúrgueres",
    description: "Nossos hambúrgueres artesanais preparados na hora com ingredientes frescos.",
    order: 1,
    items: [
      {
        id: "x-burger",
        slug: "x-burger",
        name: "X-Burger",
        description: "Hambúrguer com carne bovina, queijo, alface, tomate e molho especial.",
        price: {
          value: 18.90,
          currency: "BRL"
        },
        image: {
          url: "/icone-hamburguer.jpg",
          alt: "Hambúrguer X-Burger artesanal"
        },
        available: true,
        popular: true,
        tags: ["burger", "classic"],
        createdAt: "2026-01-01"
      },
      {
        id: "x-bacon",
        slug: "x-bacon",
        name: "X-Bacon",
        description: "Hambúrguer com carne bovina, queijo e bacon crocante.",
        price: {
          value: 22.90,
          currency: "BRL"
        },
        image: {
          url: "/icone-hamburguer.jpg",
          alt: "Hambúrguer X-Bacon com bacon crocante"
        },
        available: true,
        popular: false,
        tags: ["burger", "bacon"],
        createdAt: "2026-01-01"
      }
    ]
  },
  {
    id: "pizzas",
    slug: "pizzas",
    name: "Pizzas",
    description: "Pizzas artesanais com massas frescas e ingredientes selecionados.",
    order: 2,
    items: [
      {
        id: "pizza-marguerita",
        slug: "pizza-marguerita",
        name: "Pizza Marguerita",
        description: "Molho de tomate, mussarela, tomate fresco e manjericão.",
        price: {
          value: 45.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-pizza.jpg",
          alt: "Pizza Marguerita"
        },
        available: true,
        popular: true,
        tags: ["pizza", "vegetarian"],
        createdAt: "2026-01-01"
      },
      {
        id: "pizza-portuguesa",
        slug: "pizza-portuguesa",
        name: "Pizza Portuguesa",
        description: "Molho de tomate, mussarela, presunto, ovo, cebola e azeitonas.",
        price: {
          value: 48.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-pizza.jpg",
          alt: "Pizza Portuguesa"
        },
        available: true,
        popular: true,
        tags: ["pizza"],
        createdAt: "2026-01-01"
      },
      {
        id: "pizza-calabresa",
        slug: "pizza-calabresa",
        name: "Pizza Calabresa",
        description: "Molho de tomate, mussarela, calabresa e cebola.",
        price: {
          value: 45.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-pizza.jpg",
          alt: "Pizza Calabresa"
        },
        available: true,
        popular: false,
        tags: ["pizza"],
        createdAt: "2026-01-01"
      }
    ]
  },
  {
    id: "esfihas",
    slug: "esfihas",
    name: "Esfihas",
    description: "Esfihas artesanais com massas crocantes e recheios variados.",
    order: 3,
    items: [
      {
        id: "esfiha-carne",
        slug: "esfiha-carne",
        name: "Esfiha de Carne",
        description: "Carne moída temperada com cebola, tomate e спеції.",
        price: {
          value: 5.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-esfiha.jpg",
          alt: "Esfiha de Carne"
        },
        available: true,
        popular: true,
        tags: ["esfiha", "meat"],
        createdAt: "2026-01-01"
      },
      {
        id: "esfiha-queijo",
        slug: "esfiha-queijo",
        name: "Esfiha de Queijo",
        description: "Queijo mussarela derretido.",
        price: {
          value: 4.50,
          currency: "BRL"
        },
        image: {
          url: "/icone-esfiha.jpg",
          alt: "Esfiha de Queijo"
        },
        available: true,
        popular: true,
        tags: ["esfiha", "cheese"],
        createdAt: "2026-01-01"
      },
      {
        id: "esfiha-frango",
        slug: "esfiha-frango",
        name: "Esfiha de Frango",
        description: "Frango desfiado temperado com Cream Cheese.",
        price: {
          value: 5.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-esfiha.jpg",
          alt: "Esfiha de Frango"
        },
        available: true,
        popular: false,
        tags: ["esfiha", "chicken"],
        createdAt: "2026-01-01"
      }
    ]
  },
  {
    id: "drinks",
    slug: "drinks",
    name: "Bebidas",
    description: "Bebidas geladas para completar seu pedido.",
    order: 4,
    items: [
      {
        id: "refrigerante-lata",
        slug: "refrigerante-lata",
        name: "Refrigerante Lata",
        description: "Refrigerante gelado 350ml.",
        price: {
          value: 6.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-hamburguer.jpg",
          alt: "Refrigerante lata 350ml"
        },
        available: true,
        popular: true,
        tags: ["drink"],
        createdAt: "2026-01-01"
      },
      {
        id: "refrigerante-600ml",
        slug: "refrigerante-600ml",
        name: "Refrigerante 600ml",
        description: "Refrigerante gelado 600ml.",
        price: {
          value: 8.00,
          currency: "BRL"
        },
        image: {
          url: "/icone-hamburguer.jpg",
          alt: "Refrigerante 600ml"
        },
        available: true,
        popular: false,
        tags: ["drink"],
        createdAt: "2026-01-01"
      }
    ]
  }
];