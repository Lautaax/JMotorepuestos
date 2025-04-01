import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import { getFeaturedProducts } from "@/lib/products"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import NewsletterSignup from "@/components/marketing/newsletter-signup"
import MotoRecommendationsBanner from "@/components/moto-selector/moto-recommendations-banner"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Banner de recomendaciones */}
        <div className="container mt-6">
          <MotoRecommendationsBanner />
        </div>

        {/* Hero Section */}
        <section className="relative bg-secondary overflow-hidden">
          <div className="container py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
                  Repuestos de calidad para tu motocicleta
                </h1>
                <p className="text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.1s" }}>
                  Encuentra todo lo que necesitas para mantener tu moto en perfectas condiciones
                </p>
                <div
                  className="flex flex-wrap gap-4 justify-center md:justify-start animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <Button asChild size="lg">
                    <Link href="/products">Ver catálogo</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/contact">Contactar</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-64 md:h-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <Image
                  src="/images/hero/motorcycle.svg"
                  alt="Motorcycle"
                  width={600}
                  height={400}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 z-0 opacity-10">
            <Image src="/images/hero/hero-background.svg" alt="" fill className="object-cover" aria-hidden="true" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Categorías populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Link
                href="/categories/motor"
                className="flex flex-col items-center p-6 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
              >
                <div className="h-16 w-16 mb-4">
                  <Image src="/images/categories/motor.svg" alt="Motor" width={64} height={64} />
                </div>
                <span className="font-medium text-center">Motor</span>
              </Link>
              <Link
                href="/categories/frenos"
                className="flex flex-col items-center p-6 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
              >
                <div className="h-16 w-16 mb-4">
                  <Image src="/images/categories/frenos.svg" alt="Frenos" width={64} height={64} />
                </div>
                <span className="font-medium text-center">Frenos</span>
              </Link>
              <Link
                href="/categories/suspension"
                className="flex flex-col items-center p-6 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
              >
                <div className="h-16 w-16 mb-4">
                  <Image src="/images/categories/suspension.svg" alt="Suspensión" width={64} height={64} />
                </div>
                <span className="font-medium text-center">Suspensión</span>
              </Link>
              <Link
                href="/categories/electrico"
                className="flex flex-col items-center p-6 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
              >
                <div className="h-16 w-16 mb-4">
                  <Image src="/images/categories/electrico.svg" alt="Eléctrico" width={64} height={64} />
                </div>
                <span className="font-medium text-center">Eléctrico</span>
              </Link>
              <Link
                href="/categories/accesorios"
                className="flex flex-col items-center p-6 rounded-lg bg-secondary hover:bg-primary/10 transition-colors"
              >
                <div className="h-16 w-16 mb-4">
                  <Image src="/images/categories/accesorios.svg" alt="Accesorios" width={64} height={64} />
                </div>
                <span className="font-medium text-center">Accesorios</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Productos destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Suspense fallback={<FeaturedProductsSkeleton />}>
                <FeaturedProducts />
              </Suspense>
            </div>
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/products">Ver todos los productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16">
          <div className="container">
            <NewsletterSignup />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  return products.map((product, index) => (
    <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
      <ProductCard product={product} />
    </div>
  ))
}

function FeaturedProductsSkeleton() {
  return Array.from({ length: 4 }).map((_, i) => (
    <div key={i} className="rounded-lg border bg-background shadow-sm">
      <Skeleton className="aspect-square w-full rounded-t-lg" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  ))
}

