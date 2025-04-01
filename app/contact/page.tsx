import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-16">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Contacto</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Estamos aquí para ayudarte. Contáctanos para cualquier consulta o información.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info Section */}
        <section className="py-16">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="space-y-6 animate-slide-in-left">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Envíanos un mensaje</h2>
                  <p className="text-muted-foreground">Completa el formulario y te responderemos a la brevedad.</p>
                </div>

                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Nombre completo
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
                    <Input id="subject" placeholder="¿Sobre qué nos escribes?" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Mensaje
                    </label>
                    <Textarea id="message" placeholder="Escribe tu mensaje aquí..." rows={5} />
                  </div>

                  <Button type="submit" className="w-full sm:w-auto">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8 animate-slide-in-right">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Información de contacto</h2>
                  <p className="text-muted-foreground">
                    Puedes contactarnos por cualquiera de estos medios o visitar nuestra tienda física.
                  </p>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Dirección</h3>
                        <p className="text-muted-foreground mt-1">
                          Av. Libertador 1234
                          <br />
                          Buenos Aires, Argentina
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Teléfono</h3>
                        <p className="text-muted-foreground mt-1">
                          +54 11 1234-5678
                          <br />
                          +54 11 5678-1234
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground mt-1">
                          info@motorepuestos.com
                          <br />
                          ventas@motorepuestos.com
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Horario de atención</h3>
                        <p className="text-muted-foreground mt-1">
                          Lunes a Viernes: 9:00 - 18:00
                          <br />
                          Sábados: 9:00 - 13:00
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-8 pb-16">
          <div className="container">
            <div className="rounded-lg overflow-hidden h-[400px] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168878895474!2d-58.38414532346177!3d-34.60373445749446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4aa9f0a6da5edb%3A0x11bead4e234e558b!2sObelisco!5e0!3m2!1ses!2sar!4v1711842000000!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

