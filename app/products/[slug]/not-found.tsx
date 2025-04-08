import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
      <h1 className="text-4xl font-bold">Producto no encontrado</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Lo sentimos, el producto que estás buscando no existe o ha sido eliminado.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/products">Ver todos los productos</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
