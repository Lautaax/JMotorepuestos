"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import type { ChatMessage, ChatSession } from "@/lib/types"

export default function LiveChat() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatSession, setChatSession] = useState<ChatSession | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [showForm, setShowForm] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  // Scroll al final de los mensajes cuando se añaden nuevos
  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  // Inicializar datos del usuario si está autenticado
  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || "")
      setEmail(session.user.email || "")
    }
  }, [session])

  // Iniciar polling para nuevos mensajes cuando hay una sesión activa
  useEffect(() => {
    if (chatSession && isOpen) {
      // Marcar mensajes como leídos al abrir el chat
      markMessagesAsRead()

      // Iniciar polling
      const interval = setInterval(fetchMessages, 5000)
      setPollingInterval(interval)

      return () => {
        clearInterval(interval)
        setPollingInterval(null)
      }
    }
  }, [chatSession, isOpen])

  // Detener polling al minimizar o cerrar
  useEffect(() => {
    if (!isOpen || isMinimized) {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }, [isOpen, isMinimized, pollingInterval])

  // Función para obtener mensajes
  const fetchMessages = async () => {
    if (!chatSession) return

    try {
      const response = await fetch(`/api/chat/messages/${chatSession.id}`)

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)

        // Verificar si hay mensajes no leídos
        const unread = data.messages.filter((msg: ChatMessage) => msg.isAdmin && !msg.read).length

        setUnreadCount(unread)

        // Si hay mensajes no leídos y el chat está abierto, marcarlos como leídos
        if (unread > 0 && isOpen && !isMinimized) {
          markMessagesAsRead()
        }
      }
    } catch (error) {
      console.error("Error al obtener mensajes:", error)
    }
  }

  // Función para marcar mensajes como leídos
  const markMessagesAsRead = async () => {
    if (!chatSession) return

    try {
      await fetch(`/api/chat/messages/${chatSession.id}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin: false }),
      })

      setUnreadCount(0)
    } catch (error) {
      console.error("Error al marcar mensajes como leídos:", error)
    }
  }

  // Función para iniciar una sesión de chat
  const startChatSession = async () => {
    if (!userName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre para iniciar el chat",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          userId: session?.user?.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al iniciar sesión de chat")
      }

      const data = await response.json()
      setChatSession(data.session)
      setShowForm(false)

      // Añadir mensaje de bienvenida
      setMessages([
        {
          id: "welcome",
          sessionId: data.session.id,
          userName: "Soporte",
          isAdmin: true,
          message: "¡Hola! ¿En qué podemos ayudarte hoy?",
          read: true,
          createdAt: new Date().toISOString(),
        },
      ])
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al iniciar el chat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Función para enviar un mensaje
  const sendMessage = async () => {
    if (!chatSession || !message.trim()) return

    const tempId = Date.now().toString()
    const tempMessage = {
      id: tempId,
      sessionId: chatSession.id,
      userName,
      userId: session?.user?.id,
      isAdmin: false,
      message: message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }

    // Añadir mensaje temporal
    setMessages((prev) => [...prev, tempMessage])
    setMessage("")

    try {
      const response = await fetch(`/api/chat/messages/${chatSession.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: tempMessage.message,
          isAdmin: false,
          userName,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al enviar mensaje")
      }

      const data = await response.json()

      // Reemplazar mensaje temporal con el real
      setMessages((prev) => prev.map((msg) => (msg.id === tempId ? data.message : msg)))
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al enviar el mensaje",
        variant: "destructive",
      })

      // Eliminar mensaje temporal en caso de error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId))
    }
  }

  // Función para cerrar la sesión de chat
  const closeChatSession = async () => {
    if (!chatSession) return

    try {
      await fetch(`/api/chat/sessions/${chatSession.id}/close`, {
        method: "POST",
      })

      setChatSession(null)
      setMessages([])
      setShowForm(true)
      setIsOpen(false)
    } catch (error) {
      console.error("Error al cerrar sesión de chat:", error)
    }
  }

  return (
    <>
      {/* Botón flotante para abrir el chat */}
      <Button
        onClick={() => {
          setIsOpen(true)
          setIsMinimized(false)
        }}
        className={`fixed bottom-4 right-4 rounded-full shadow-lg z-50 ${isOpen ? "hidden" : "flex"}`}
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {/* Ventana de chat */}
      <div
        className={`fixed bottom-4 right-4 w-80 rounded-lg shadow-lg overflow-hidden z-50 transition-all duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } ${isMinimized ? "h-14" : "h-96"}`}
      >
        {/* Encabezado */}
        <div className="bg-primary text-primary-foreground p-3 flex justify-between items-center">
          <h3 className="font-medium">Chat en vivo</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary/80"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Contenido del chat */}
            <div className="bg-background flex-1 overflow-y-auto p-3 h-[calc(100%-110px)]">
              {showForm ? (
                <div className="space-y-3">
                  <p className="text-sm">Por favor, completa tus datos para iniciar el chat:</p>
                  <div className="space-y-2">
                    <Input placeholder="Nombre *" value={userName} onChange={(e) => setUserName(e.target.value)} />
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button onClick={startChatSession} className="w-full" disabled={loading}>
                      {loading ? "Iniciando..." : "Iniciar chat"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          msg.isAdmin ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <p className="text-xs font-medium">{msg.userName}</p>
                        <p className="text-sm break-words">{msg.message}</p>
                        <p className="text-xs opacity-70 text-right">
                          {new Date(msg.createdAt || new Date()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Formulario de envío de mensajes */}
            {!showForm && (
              <div className="bg-muted p-3 flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <Button size="icon" onClick={sendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

