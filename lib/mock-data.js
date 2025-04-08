// Datos de ejemplo para usar en la aplicación
export const mockOrders = [
  {
    _id: "order1",
    userId: "user1",
    status: "delivered",
    totalAmount: 150.99,
    items: [
      { name: "Filtro de aceite premium", price: 25.99, quantity: 2 },
      { name: "Pastillas de freno", price: 99.01, quantity: 1 },
    ],
    createdAt: new Date("2023-05-15"),
    shippingAddress: {
      fullName: "Usuario Demo",
      address: "Calle Principal 123",
      city: "Ciudad Demo",
      state: "Estado Demo",
      postalCode: "12345",
      country: "País Demo",
    },
    paymentInfo: {
      method: "mercadopago",
      status: "approved",
    },
  },
  {
    _id: "order2",
    userId: "user1",
    status: "processing",
    totalAmount: 89.5,
    items: [{ name: "Bujías de alto rendimiento", price: 29.5, quantity: 3 }],
    createdAt: new Date("2023-06-20"),
    shippingAddress: {
      fullName: "Usuario Demo",
      address: "Calle Principal 123",
      city: "Ciudad Demo",
      state: "Estado Demo",
      postalCode: "12345",
      country: "País Demo",
    },
    paymentInfo: {
      method: "transfer",
      status: "pending",
    },
  },
]

// Función para obtener órdenes de un usuario
export function getUserOrdersMock(userId) {
  return mockOrders.filter((order) => order.userId === userId)
}

// Datos de ejemplo para productos
export const mockProducts = [
  {
    _id: "product1",
    name: "Filtro de aceite premium",
    description: "Filtro de aceite de alta calidad para motocicletas de alto rendimiento",
    price: 25.99,
    stock: 50,
    sku: "FIL-001",
    categoryId: "cat1",
    imageUrl: "/placeholder.svg?height=200&width=200",
    featured: true,
    compatibleModels: ["Honda CBR 600", "Yamaha R6", "Kawasaki Ninja 650"],
  },
  {
    _id: "product2",
    name: "Pastillas de freno",
    description: "Pastillas de freno de alto rendimiento para mayor seguridad",
    price: 99.01,
    stock: 30,
    sku: "FRE-002",
    categoryId: "cat2",
    imageUrl: "/placeholder.svg?height=200&width=200",
    featured: true,
    compatibleModels: ["Honda CBR 1000", "Yamaha R1", "Suzuki GSXR 750"],
  },
]

// Datos de ejemplo para categorías
export const mockCategories = [
  {
    _id: "cat1",
    name: "Filtros",
    description: "Filtros de aceite, aire y combustible para tu motocicleta",
  },
  {
    _id: "cat2",
    name: "Frenos",
    description: "Sistemas de frenos y componentes relacionados",
  },
]

// Datos de ejemplo para reseñas
export const mockReviews = [
  {
    _id: "review1",
    productId: "product1",
    userId: "user1",
    userName: "Usuario Demo",
    rating: 5,
    comment: "Excelente producto, muy recomendable",
    createdAt: new Date("2023-04-10"),
  },
  {
    _id: "review2",
    productId: "product1",
    userId: "user2",
    userName: "Otro Usuario",
    rating: 4,
    comment: "Buen producto, pero un poco caro",
    createdAt: new Date("2023-05-15"),
  },
]
