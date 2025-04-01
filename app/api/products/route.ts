import { type NextRequest, NextResponse } from "next/server"
import { getProducts, addProduct, getProductsCount } from "@/lib/products-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get("category") || undefined
    const sort = searchParams.get("sort") || undefined
    const query = searchParams.get("query") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const skip = (page - 1) * limit

    const products = await getProducts({
      category,
      sort,
      query,
      limit,
      skip,
    })

    const total = await getProductsCount({
      ...(category ? { category } : {}),
      ...(query
        ? {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { brand: { $regex: query, $options: "i" } },
              { sku: { $regex: query, $options: "i" } },
            ],
          }
        : {}),
    })

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const productData = await request.json()

    // Validar datos del producto
    if (!productData.name || !productData.price || productData.price <= 0) {
      return NextResponse.json({ error: "Datos de producto inválidos" }, { status: 400 })
    }

    const newProduct = await addProduct(productData)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}

