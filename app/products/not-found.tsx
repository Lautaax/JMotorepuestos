import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-4xl font-bold">Producto no encontrado</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        Lo sentimos, el producto que estás buscando no existe o ha sido eliminado.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/products">Ver todos los productos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold">¿No encuentras lo que buscas?</h2>
        <p className="mt-2 text-muted-foreground">
          Prueba a buscar con otras palabras o navega por nuestras categorías.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link
            href="/categories/motor"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Motor
          </Link>
          <Link
            href="/categories/frenos"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Frenos
          </Link>
          <Link
            href="/categories/suspension"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Suspensión
          </Link>
          <Link
            href="/categories/electrico"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Eléctrico
          </Link>
          <Link
            href="/categories/accesorios"
            className="rounded-full bg-muted px-4 py-2 text-sm font-medium hover:bg-muted/80"
          >
            Accesorios
          </Link>
        </div>
      </div>
    </div>
  )
}
