"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function WhatsAppContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const whatsappNumber = "+5491112345678" // Reemplaza con tu número de WhatsApp

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hola,%20estoy%20interesado%20en%20sus%20productos.%20Me%20gustaría%20recibir%20más%20información.`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Botón flotante para abrir el panel de WhatsApp */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-4 right-4 rounded-full shadow-lg z-50 flex items-center gap-2",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700",
        )}
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {/* Panel de WhatsApp */}
      <div
        className={cn(
          "fixed bottom-20 right-4 w-72 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-300 bg-background border border-border",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        )}
      >
        <div className="bg-green-600 text-white p-4">
          <h3 className="font-medium">Contáctanos por WhatsApp</h3>
          <p className="text-sm opacity-90">Respuesta rápida en horario comercial</p>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-sm">
            Envíanos un mensaje por WhatsApp para consultas sobre productos, disponibilidad o cualquier otra
            información.
          </p>
          <Button onClick={handleWhatsAppClick} className="w-full bg-green-600 hover:bg-green-700">
            <MessageCircle className="mr-2 h-4 w-4" />
            Iniciar conversación
          </Button>
        </div>
      </div>
    </>
  )
}

