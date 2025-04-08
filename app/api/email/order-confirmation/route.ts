import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { getProductById } from "@/lib/products-db"

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: process.env.EMAIL_SERVER_SECURE === "true",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { order, customer } = data

    if (!order || !customer || !customer.email) {
      return NextResponse.json({ error: "Datos de pedido inválidos" }, { status: 400 })
    }

    // Obtener información detallada de los productos
    const orderItems = []
    let total = 0

    for (const item of order.items) {
      const product = await getProductById(item.productId)

      if (product) {
        const subtotal = product.price * item.quantity
        total += subtotal

        orderItems.push({
          name: product.name,
          sku: product.sku || product.id,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        })
      }
    }

    // Construir el contenido del email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Confirmación de Pedido</h1>
        <p>Hola ${customer.name},</p>
        <p>¡Gracias por tu compra! Hemos recibido tu pedido correctamente.</p>
        
        <h2 style="color: #333; margin-top: 20px;">Detalles del Pedido</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Precio</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${orderItems
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">${item.name} (${item.sku})</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
                <td style="padding: 10px; text-align: center; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${item.subtotal.toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">Total:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">$${total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style="color: #333; margin-top: 20px;">Información de Envío</h2>
        <p><strong>Nombre:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Teléfono:</strong> ${customer.phone || "No proporcionado"}</p>
        <p><strong>Dirección:</strong> ${customer.address || "Retiro en tienda"}</p>
        
        <p style="margin-top: 20px;">Te contactaremos pronto para coordinar la entrega o retiro de tu pedido.</p>
        
        <p style="margin-top: 30px;">Saludos,<br>El equipo de MotoRepuestos</p>
      </div>
    `

    // Enviar el email
    await transporter.sendMail({
      from: `"MotoRepuestos" <${process.env.EMAIL_FROM}>`,
      to: customer.email,
      subject: "Confirmación de Pedido - MotoRepuestos",
      html: htmlContent,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al enviar email de confirmación:", error)
    return NextResponse.json({ error: "Error al enviar email de confirmación" }, { status: 500 })
  }
}
