import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Award, Truck, ShieldCheck, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"
import NewsletterSignup from "@/components/marketing/newsletter-signup"
import WhatsAppContactButton from "@/components/whatsapp-contact-button"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/hero-background.svg"
              alt="Motorcycle Background"
              fill
              className="object-cover opacity-60"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-background/40" />
          </div>

          <div className="container relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-slide-in-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-shadow">
                Las mejores marcas del mercado
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                Seguridad y confiabilidad en las calles. Conoce todos nuestros productos.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="animate-pulse-slow">
                    IR A LA TIENDA
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contactar
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block relative h-[400px] animate-slide-in-right">
              <Image src="/images/hero/motorcycle.svg" alt="Motorcycle" fill className="object-contain" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 stagger-animation">
              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Calidad Garantizada</h3>
                <p className="text-sm text-muted-foreground">Repuestos originales y alternativos de primera calidad</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Envío Rápido</h3>
                <p className="text-sm text-muted-foreground">Entrega en todo el país en 24-72 horas</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in">
                <div className="bg-primary/10 p-3 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Compra Segura</h3>
                <p className="text-sm text-muted-foreground">Pago seguro y garantía de devolución</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 animate-fade-in">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium">Soporte 24/7</h3>
                <p className="text-sm text-muted-foreground">Atención al cliente disponible todos los días</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Categorías Populares</h2>
                <p className="text-muted-foreground mt-2">Explora nuestra amplia selección de repuestos</p>
              </div>
              <Link href="/categories">
                <Button variant="link" className="text-primary">
                  Ver todas las categorías
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 stagger-animation">
              <Link
                href="/categories/motor"
                className="group relative overflow-hidden rounded-lg aspect-square hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/motor.svg"
                  alt="Motor"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-lg">Motor</h3>
                </div>
              </Link>

              <Link
                href="/categories/frenos"
                className="group relative overflow-hidden rounded-lg aspect-square hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/frenos.svg"
                  alt="Frenos"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-lg">Frenos</h3>
                </div>
              </Link>

              <Link
                href="/categories/suspension"
                className="group relative overflow-hidden rounded-lg aspect-square hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/suspension.svg"
                  alt="Suspensión"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-lg">Suspensión</h3>
                </div>
              </Link>

              <Link
                href="/categories/electrico"
                className="group relative overflow-hidden rounded-lg aspect-square hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/electrico.svg"
                  alt="Eléctrico"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-lg">Eléctrico</h3>
                </div>
              </Link>

              <Link
                href="/categories/accesorios"
                className="group relative overflow-hidden rounded-lg aspect-square hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/accesorios.svg"
                  alt="Accesorios"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                  <h3 className="font-bold text-lg">Accesorios</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Productos Destacados</h2>
                <p className="text-muted-foreground mt-2">Los repuestos más populares de nuestra tienda</p>
              </div>
              <Link href="/products">
                <Button variant="link" className="text-primary">
                  Ver todos los productos
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger-animation">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Marcas con las que trabajamos</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Colaboramos con las mejores marcas del mercado para ofrecerte repuestos de la más alta calidad
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center stagger-animation">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex justify-center animate-fade-in">
                  <div className="bg-secondary p-6 rounded-lg w-full h-24 flex items-center justify-center">
                    <Image
                      src={`/images/brands/brand${i}.svg`}
                      alt={`Brand ${i}`}
                      width={120}
                      height={80}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
                  ¿No encuentras lo que buscas?
                </h2>
                <p className="text-primary-foreground/90">
                  Contáctanos y te ayudaremos a encontrar el repuesto exacto que necesitas para tu motocicleta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/contact">
                    <Button variant="secondary" size="lg">
                      Contactar ahora
                    </Button>
                  </Link>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                    >
                      Ver catálogo completo
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-[300px] hidden md:block">
                <Image src="/images/misc/contact-us.svg" alt="Contact Us" fill className="object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">Mantente Informado</h2>
                <p className="text-muted-foreground">
                  Suscríbete a nuestro boletín para recibir las últimas novedades, ofertas exclusivas y consejos para el
                  mantenimiento de tu moto.
                </p>
                <NewsletterSignup />
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/images/misc/newsletter.svg"
                  alt="Newsletter"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppContactButton />
    </div>
  )
}

