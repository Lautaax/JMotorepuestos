import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/images/logo/logo-white.svg" alt="MotoRepuesto" width={40} height={40} />
              <span className="text-xl font-bold">MotoRepuesto</span>
            </Link>
            <p className="text-gray-400 mb-4">Tu tienda especializada en repuestos y accesorios para motocicletas.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/motor" className="text-gray-400 hover:text-white transition-colors">
                  Motor
                </Link>
              </li>
              <li>
                <Link href="/categories/frenos" className="text-gray-400 hover:text-white transition-colors">
                  Frenos
                </Link>
              </li>
              <li>
                <Link href="/categories/suspension" className="text-gray-400 hover:text-white transition-colors">
                  Suspensión
                </Link>
              </li>
              <li>
                <Link href="/categories/electrico" className="text-gray-400 hover:text-white transition-colors">
                  Sistema Eléctrico
                </Link>
              </li>
              <li>
                <Link href="/categories/accesorios" className="text-gray-400 hover:text-white transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href={"/about" as any} className="text-gray-400 hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href={"/shipping" as any} className="text-gray-400 hover:text-white transition-colors">
                  Envíos
                </Link>
              </li>
              <li>
                <Link href={"/returns" as any} className="text-gray-400 hover:text-white transition-colors">
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link href={"/terms" as any} className="text-gray-400 hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href={"/privacy" as any} className="text-gray-400 hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>Av. Rivadavia 1234</p>
              <p>Buenos Aires, Argentina</p>
              <p>CP 1406</p>
              <p className="mt-4">
                <a href="tel:+541123456789" className="hover:text-white transition-colors">
                  +54 11 2345-6789
                </a>
              </p>
              <p>
                <a href="mailto:info@motorepuesto.com" className="hover:text-white transition-colors">
                  info@motorepuesto.com
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MotoRepuesto. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
