import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-primary">MotoRepuestos</h3>
          <p className="text-sm text-muted-foreground">
            Calidad y servicio para tu motocicleta desde 2005. Los mejores repuestos para todas las marcas.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Enlaces rápidos</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Categorías
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Categorías</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/categories/motor"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Motor
              </Link>
            </li>
            <li>
              <Link
                href="/categories/frenos"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Frenos
              </Link>
            </li>
            <li>
              <Link
                href="/categories/suspension"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Suspensión
              </Link>
            </li>
            <li>
              <Link
                href="/categories/electrico"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Eléctrico
              </Link>
            </li>
            <li>
              <Link
                href="/categories/accesorios"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Accesorios
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Contacto</h3>
          <address className="not-italic text-sm text-muted-foreground">
            <p>Av. Libertador 1234</p>
            <p>Buenos Aires, Argentina</p>
            <p className="mt-2">+54 11 1234-5678</p>
            <p>info@motorepuestos.com</p>
          </address>
        </div>
      </div>

      <div className="container mt-8 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MotoRepuestos. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Términos y Condiciones
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

