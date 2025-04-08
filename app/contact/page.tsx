import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import WhatsAppContactButton from "@/components/whatsapp-contact-button"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Contacto</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Estamos aquí para ayudarte con cualquier consulta sobre repuestos para tu motocicleta
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-4">Ponte en contacto</h2>
                  <p className="text-muted-foreground">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible. También puedes
                    contactarnos directamente a través de los siguientes medios.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Dirección</h3>
                      <p className="text-muted-foreground">Av. Corrientes 1234, CABA, Argentina</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Teléfono</h3>
                      <p className="text-muted-foreground">+54 11 1234-5678</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@motorepuestos.com</p>
                    </div>
                  </div>
                </div>

                <div className="relative h-[300px] rounded-lg overflow-hidden">
                  <Image src="/images/misc/contact-us.svg" alt="Mapa de ubicación" fill className="object-cover" />
                </div>
              </div>

              <div className="bg-card rounded-lg shadow-sm p-6 border">
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre
                      </label>
                      <Input id="name" placeholder="Tu nombre" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="tu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Asunto
                    </label>
                    <Input id="subject" placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <Textarea id="message" placeholder="Escribe tu mensaje aquí..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Enviar mensaje
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight">Preguntas frecuentes</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Respuestas a las preguntas más comunes sobre nuestros productos y servicios
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-2">¿Cuánto tarda el envío?</h3>
                <p className="text-muted-foreground">
                  Los envíos dentro de CABA se realizan en 24-48 horas. Para el resto del país, el tiempo estimado es de
                  3-5 días hábiles, dependiendo de la ubicación.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-2">¿Ofrecen garantía en los repuestos?</h3>
                <p className="text-muted-foreground">
                  Sí, todos nuestros productos cuentan con garantía de 6 meses por defectos de fabricación. Los
                  repuestos originales tienen la garantía oficial del fabricante.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-2">¿Cómo sé si el repuesto es compatible con mi moto?</h3>
                <p className="text-muted-foreground">
                  En cada producto encontrarás una lista de modelos compatibles. También puedes usar nuestro buscador
                  por modelo de moto o contactarnos directamente para asesoramiento.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm border">
                <h3 className="font-bold text-lg mb-2">¿Realizan envíos internacionales?</h3>
                <p className="text-muted-foreground">
                  Actualmente solo realizamos envíos dentro de Argentina. Estamos trabajando para expandir nuestros
                  servicios a países limítrofes en el futuro.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="mb-4">¿No encontraste respuesta a tu pregunta?</p>
              <Button variant="outline" asChild>
                <Link href="/faq">Ver todas las preguntas frecuentes</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
                  ¿Necesitas ayuda para encontrar un repuesto específico?
                </h2>
                <p className="text-primary-foreground/90">
                  Nuestro equipo de especialistas está listo para ayudarte a encontrar exactamente lo que necesitas para
                  tu motocicleta.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button variant="secondary" size="lg">
                    Contactar por WhatsApp
                  </Button>
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
      </main>
      <SiteFooter />
      <WhatsAppContactButton />
    </div>
  )
}
