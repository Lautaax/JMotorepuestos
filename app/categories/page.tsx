import Link from "next/link"
import Image from "next/image"

import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import WhatsAppContactButton from "@/components/whatsapp-contact-button"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Categorías de Productos</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Explora nuestra amplia selección de repuestos organizados por categorías
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              <Link
                href="/categories/motor"
                as="/categories/motor"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/motor.svg"
                  alt="Motor"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Motor</h3>
                  <p className="text-muted-foreground">
                    Pistones, juntas, válvulas y todo lo necesario para el corazón de tu moto.
                  </p>
                </div>
              </Link>

              <Link
                href="/categories/frenos"
                as="/categories/frenos"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/frenos.svg"
                  alt="Frenos"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Frenos</h3>
                  <p className="text-muted-foreground">
                    Pastillas, discos, bombas y líquidos para un frenado seguro y eficiente.
                  </p>
                </div>
              </Link>

              <Link
                href="/categories/suspension"
                as="/categories/suspension"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/suspension.svg"
                  alt="Suspensión"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Suspensión</h3>
                  <p className="text-muted-foreground">
                    Amortiguadores, horquillas y componentes para una conducción suave y controlada.
                  </p>
                </div>
              </Link>

              <Link
                href="/categories/electrico"
                as="/categories/electrico"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/electrico.svg"
                  alt="Eléctrico"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Eléctrico</h3>
                  <p className="text-muted-foreground">
                    Baterías, reguladores, CDI, bobinas y todo el sistema eléctrico para tu moto.
                  </p>
                </div>
              </Link>

              <Link
                href="/categories/transmision"
                as="/categories/transmision"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/placeholder.svg?height=400&width=600&text=Transmisión"
                  alt="Transmisión"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Transmisión</h3>
                  <p className="text-muted-foreground">
                    Cadenas, piñones, coronas, embragues y componentes de transmisión.
                  </p>
                </div>
              </Link>

              <Link
                href="/categories/accesorios"
                as="/categories/accesorios"
                className="group relative overflow-hidden rounded-lg aspect-video hover-scale animate-fade-in"
              >
                <Image
                  src="/images/categories/accesorios.svg"
                  alt="Accesorios"
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                  <h3 className="font-bold text-2xl mb-2">Accesorios</h3>
                  <p className="text-muted-foreground">
                    Espejos, manubrios, puños, protectores y accesorios para personalizar tu moto.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Popular Subcategories */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight mb-8">Subcategorías populares</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-4">Motor</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/categories/motor/pistones"
                      as="/categories/motor/pistones"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Pistones y anillos
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/motor/juntas"
                      as="/categories/motor/juntas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Juntas y sellos
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/motor/valvulas"
                      as="/categories/motor/valvulas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Válvulas
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/motor/carburacion"
                      as="/categories/motor/carburacion"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Carburación
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/motor/inyeccion"
                      as="/categories/motor/inyeccion"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Inyección electrónica
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-4">Frenos</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      ref="/categories/frenos/pastillas"
                      as="/categories/frenos/pastillas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Pastillas de freno
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/frenos/discos"
                      as="/categories/frenos/discos"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Discos de freno
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/frenos/bombas"
                      as="/categories/frenos/bombas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Bombas de freno
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/frenos/liquidos"
                      as="/categories/frenos/liquidos"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Líquidos de freno
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/frenos/cables"
                      as="/categories/frenos/cables"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Cables de freno
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-4">Suspensión</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      ref="/categories/suspension/amortiguadores"
                      as="/categories/suspension/amortiguadores"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Amortiguadores
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/suspension/horquillas"
                      as="/categories/suspension/horquillas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Horquillas
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/suspension/resortes"
                      as="/categories/suspension/resortes"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Resortes
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/suspension/aceites"
                      as="/categories/suspension/aceites"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Aceites de suspensión
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/suspension/sellos"
                      as="/categories/suspension/sellos"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Sellos y retenes
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-4">Eléctrico</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      ref="/categories/electrico/baterias"
                      as="/categories/electrico/baterias"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Baterías
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/electrico/cdi"
                      as="/categories/electrico/cdi"
                      className="text-muted-foreground hover:text-primary"
                    >
                      CDI y ECU
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/electrico/bobinas"
                      as="/categories/electrico/bobinas"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Bobinas
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/electrico/reguladores"
                      as="/categories/electrico/reguladores"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Reguladores
                    </Link>
                  </li>
                  <li>
                    <Link
                      ref="/categories/electrico/bujias"
                      as="/categories/electrico/bujias"
                      className="text-muted-foreground hover:text-primary"
                    >
                      Bujías
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
                  ¿No encuentras la categoría que buscas?
                </h2>
                <p className="text-primary-foreground/90">
                  Contáctanos y te ayudaremos a encontrar el repuesto exacto que necesitas para tu motocicleta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/contact">
                    <button className="bg-white text-primary px-6 py-3 rounded-md font-medium hover:bg-white/90 transition-colors">
                      Contactar ahora
                    </button>
                  </Link>
                  <Link href="/products">
                    <button className="bg-transparent text-white px-6 py-3 rounded-md font-medium border border-white hover:bg-white/10 transition-colors">
                      Ver catálogo completo
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative h-[300px] hidden md:block">
                <Image src="/images/misc/contact-us.svg" alt="Contact Us" fill className="object-contain" />
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
