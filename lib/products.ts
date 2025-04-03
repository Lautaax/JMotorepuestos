import type { Product } from "@/lib/types"

// Mock data for products with compatibility information
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Kit de Pistones Premium",
    description:
      "Kit completo de pistones de alta resistencia para motores de 150cc a 250cc. Incluye anillos y pasadores.",
    price: 89.99,
    stock: 15,
    category: "motor",
    brand: "MotorTech",
    sku: "PT-150-250",
    image: "/images/products/kit-pistones.svg",
    compatibleModels: [
      { brand: "Honda", model: "CG 150", year: "2015-2022" },
      { brand: "Honda", model: "Titan", year: "2015-2022" },
      { brand: "Yamaha", model: "YBR 125", year: "2014-2021" },
      { brand: "Suzuki", model: "Gixxer", year: "2016-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "ZR 150", year: "2015-2022" },
      { brand: "Motomel", model: "CG 150", year: "2015-2022" },
      { brand: "Corven", model: "Energy 110", year: "2016-2022" },
      { brand: "Gilera", model: "Smash 110", year: "2015-2022" },
    ],
  },
  {
    id: "2",
    name: "Pastillas de Freno Cerámicas",
    description:
      "Pastillas de freno cerámicas de alto rendimiento con baja generación de polvo y excelente capacidad de frenado.",
    price: 34.5,
    stock: 28,
    category: "frenos",
    brand: "BrakeMaster",
    sku: "BM-PF-C200",
    image: "/images/products/pastillas-freno.svg",
    compatibleModels: [
      { brand: "Honda", model: "CBR 600RR", year: "2013-2022" },
      { brand: "Yamaha", model: "YZF-R6", year: "2012-2022" },
      { brand: "Kawasaki", model: "Ninja 650", year: "2014-2022" },
      { brand: "Suzuki", model: "GSX-R750", year: "2011-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "RZ3", year: "2017-2022" },
      { brand: "Motomel", model: "Sirius 250", year: "2016-2022" },
      { brand: "Corven", model: "TXR 250", year: "2015-2022" },
      { brand: "Gilera", model: "SMX 400", year: "2018-2022" },
    ],
  },
  {
    id: "3",
    name: "Amortiguadores Ajustables",
    description: "Par de amortiguadores traseros ajustables en precarga y rebote para una conducción personalizada.",
    price: 129.99,
    stock: 8,
    category: "suspension",
    brand: "RideSoft",
    sku: "RS-AM-ADJ",
    image: "/images/products/amortiguadores.svg",
    compatibleModels: [
      { brand: "Honda", model: "CBR 1000RR", year: "2015-2022" },
      { brand: "Yamaha", model: "MT-09", year: "2014-2022" },
      { brand: "Kawasaki", model: "Z900", year: "2017-2022" },
      { brand: "Suzuki", model: "GSX-R1000", year: "2015-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "Patagonian Eagle", year: "2016-2022" },
      { brand: "Motomel", model: "Dakar 250", year: "2017-2022" },
      { brand: "Guerrero", model: "GRF 250", year: "2016-2022" },
      { brand: "Beta Argentina", model: "RR 300", year: "2018-2022" },
    ],
  },
  {
    id: "4",
    name: "Batería de Gel 12V",
    description: "Batería de gel de 12V con alta capacidad de arranque y larga vida útil. Libre de mantenimiento.",
    price: 75.0,
    stock: 12,
    category: "electrico",
    brand: "PowerCell",
    sku: "PC-BAT-12G",
    image: "/images/products/bateria-gel.svg",
    compatibleModels: [
      { brand: "Honda", model: "XR 250", year: "2010-2022" },
      { brand: "Yamaha", model: "FZ 25", year: "2017-2022" },
      { brand: "Bajaj", model: "Rouser 200NS", year: "2015-2022" },
      { brand: "KTM", model: "Duke 200", year: "2016-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "ZR 250", year: "2015-2022" },
      { brand: "Motomel", model: "Skua 250", year: "2016-2022" },
      { brand: "Corven", model: "Triax 250", year: "2015-2022" },
      { brand: "Gilera", model: "SMX 400", year: "2017-2022" },
    ],
  },
  {
    id: "5",
    name: "Kit de Carburación",
    description: "Kit completo para reconstrucción de carburador, incluye jets, agujas, flotadores y juntas.",
    price: 45.99,
    stock: 20,
    category: "motor",
    brand: "FuelPro",
    sku: "FP-CARB-KIT",
    image: "/placeholder.svg?height=300&width=300&text=Kit+Carburación",
    compatibleModels: [
      { brand: "Honda", model: "XR 250", year: "2005-2015" },
      { brand: "Honda", model: "Tornado", year: "2005-2015" },
      { brand: "Yamaha", model: "YBR 125", year: "2005-2015" },
      { brand: "Suzuki", model: "DR 650", year: "2005-2015" },
      // Marcas nacionales
      { brand: "Zanella", model: "RX 150", year: "2005-2015" },
      { brand: "Motomel", model: "Skua 150", year: "2005-2015" },
      { brand: "Corven", model: "Hunter 150", year: "2005-2015" },
      { brand: "Guerrero", model: "Trip 110", year: "2005-2015" },
    ],
  },
  {
    id: "6",
    name: "Disco de Freno Flotante",
    description: "Disco de freno flotante de acero inoxidable con diseño ventilado para mejor disipación de calor.",
    price: 89.5,
    stock: 10,
    category: "frenos",
    brand: "BrakeMaster",
    sku: "BM-DF-F300",
    image: "/placeholder.svg?height=300&width=300&text=Disco+Freno",
    compatibleModels: [
      { brand: "Kawasaki", model: "Ninja ZX-10R", year: "2016-2022" },
      { brand: "Ducati", model: "Panigale V4", year: "2018-2022" },
      { brand: "BMW", model: "S 1000 RR", year: "2015-2022" },
      { brand: "Yamaha", model: "YZF-R1", year: "2015-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "RZ3", year: "2016-2022" },
      { brand: "Beta Argentina", model: "RR 200", year: "2017-2022" },
      { brand: "Jawa Argentina", model: "Rvm 250", year: "2016-2022" },
      { brand: "Keller", model: "K65 Enduro", year: "2018-2022" },
    ],
  },
  {
    id: "7",
    name: "Horquillas Delanteras",
    description: "Par de horquillas delanteras reforzadas con tratamiento anticorrosión y sellos de alta calidad.",
    price: 199.99,
    stock: 5,
    category: "suspension",
    brand: "RideSoft",
    sku: "RS-HD-PRO",
    image: "/placeholder.svg?height=300&width=300&text=Horquillas",
    compatibleModels: [
      { brand: "KTM", model: "Duke 390", year: "2017-2022" },
      { brand: "KTM", model: "RC 390", year: "2017-2022" },
      { brand: "Bajaj", model: "Dominar 400", year: "2017-2022" },
      { brand: "BMW", model: "G 310 R", year: "2017-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "ZT 200", year: "2017-2022" },
      { brand: "Motomel", model: "X3M 125", year: "2018-2022" },
      { brand: "Corven", model: "Triax 250", year: "2017-2022" },
      { brand: "Beta Argentina", model: "Zontes 310", year: "2019-2022" },
    ],
  },
  {
    id: "8",
    name: "Regulador de Voltaje",
    description: "Regulador rectificador de voltaje con protección contra sobrecarga y cortocircuito.",
    price: 29.99,
    stock: 18,
    category: "electrico",
    brand: "PowerCell",
    sku: "PC-REG-12V",
    image: "/placeholder.svg?height=300&width=300&text=Regulador",
    compatibleModels: [
      { brand: "Honda", model: "CG 150", year: "2010-2022" },
      { brand: "Honda", model: "Titan", year: "2010-2022" },
      { brand: "Yamaha", model: "FZ 16", year: "2010-2022" },
      { brand: "Bajaj", model: "Boxer", year: "2010-2022" },
      // Marcas nacionales
      { brand: "Zanella", model: "ZR 150", year: "2010-2022" },
      { brand: "Motomel", model: "CG 150", year: "2010-2022" },
      { brand: "Gilera", model: "Smash 110", year: "2010-2022" },
      { brand: "Guerrero", model: "G90", year: "2010-2022" },
    ],
  },
]

interface GetProductsOptions {
  category?: string
  sort?: string
  query?: string
  motoBrand?: string
  motoModel?: string
  motoYear?: string
}

// Helper function to check if a product is compatible with the specified moto filters
function isCompatibleWithMoto(product: Product, motoBrand?: string, motoModel?: string, motoYear?: string): boolean {
  // If no moto filters are specified, the product is compatible
  if (!motoBrand && !motoModel && !motoYear) {
    return true
  }

  // If the product has no compatibility information, it's not compatible
  if (!product.compatibleModels || product.compatibleModels.length === 0) {
    return false
  }

  // Check if any of the compatible models match the filters
  return product.compatibleModels.some((model) => {
    // Check brand match if specified
    if (motoBrand && motoBrand !== "all" && model.brand !== motoBrand) {
      return false
    }

    // Check model match if specified
    if (motoModel && motoModel !== "all" && model.model !== motoModel) {
      return false
    }

    // Check year match if specified
    if (motoYear && motoYear !== "all") {
      // Handle year ranges (e.g., "2015-2022")
      if (model.year.includes("-")) {
        const [startYear, endYear] = model.year.split("-").map(Number)
        const year = Number(motoYear)
        return year >= startYear && year <= endYear
      }
      // Handle single years
      return model.year === motoYear
    }

    // If all specified filters match, the product is compatible
    return true
  })
}

// Function to get products with filtering and sorting
export async function getProducts(options: GetProductsOptions): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredProducts = [...mockProducts]

  // Apply category filter
  if (options.category) {
    filteredProducts = filteredProducts.filter((product) => product.category === options.category)
  }

  // Apply moto compatibility filters
  if (options.motoBrand || options.motoModel || options.motoYear) {
    filteredProducts = filteredProducts.filter((product) =>
      isCompatibleWithMoto(product, options.motoBrand, options.motoModel, options.motoYear),
    )
  }

  // Apply search query
  if (options.query) {
    const query = options.query.toLowerCase()
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query),
    )
  }

  // Apply sorting
  if (options.sort) {
    switch (options.sort) {
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // In a real app, you would sort by createdAt date
        filteredProducts.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
        break
      default:
        // 'featured' or any other value - no specific sorting
        break
    }
  }

  return filteredProducts
}

// Function to get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, you might have a 'featured' flag on products
  // Here we'll just return the first 4 products
  return mockProducts.slice(0, 4)
}

// Function to get a product by ID
export async function getProductById(id: string): Promise<Product | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const product = mockProducts.find((p) => p.id === id)
  return product || null
}

// Function to get related products
export async function getRelatedProducts(category?: string, excludeId?: string): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  let relatedProducts = category ? mockProducts.filter((p) => p.category === category) : [...mockProducts]

  // Exclude the current product
  if (excludeId) {
    relatedProducts = relatedProducts.filter((p) => p.id !== excludeId)
  }

  // Return up to 4 related products
  return relatedProducts.slice(0, 4)
}

// Function to add a new product
export async function addProduct(product: Product): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Generate a new ID
  const newId = (Math.max(...mockProducts.map((p) => Number.parseInt(p.id))) + 1).toString()

  const newProduct = {
    ...product,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would add to database
  mockProducts.push(newProduct)

  return newProduct
}

// Function to update a product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = mockProducts.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error("Producto no encontrado")
  }

  const updatedProduct = {
    ...mockProducts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would update in database
  mockProducts[index] = updatedProduct

  return updatedProduct
}

// Function to delete a product
export async function deleteProduct(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = mockProducts.findIndex((p) => p.id === id)
  if (index === -1) {
    throw new Error("Producto no encontrado")
  }

  // In a real app, you would delete from database
  mockProducts.splice(index, 1)
}

