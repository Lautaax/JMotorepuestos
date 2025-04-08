import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { ChatMessage, ChatSession } from "./types"

// Función para convertir _id de MongoDB a id string para mensajes
function formatMessage(message: any): ChatMessage {
  return {
    id: message._id.toString(),
    sessionId: message.sessionId,
    userId: message.userId,
    userName: message.userName,
    isAdmin: message.isAdmin,
    message: message.message,
    read: message.read,
    createdAt: message.createdAt?.toISOString(),
  }
}

// Función para convertir _id de MongoDB a id string para sesiones
function formatSession(session: any): ChatSession {
  return {
    id: session._id.toString(),
    userId: session.userId,
    userName: session.userName,
    email: session.email,
    status: session.status,
    lastMessageAt: session.lastMessageAt?.toISOString(),
    createdAt: session.createdAt?.toISOString(),
    closedAt: session.closedAt?.toISOString(),
  }
}

// Crear una nueva sesión de chat
export async function createChatSession(userName: string, email?: string, userId?: string): Promise<ChatSession> {
  const sessionsCollection = getCollection("chat_sessions")

  // Verificar si ya existe una sesión activa para este usuario
  if (userId) {
    const existingSession = await sessionsCollection.findOne({
      userId,
      status: "active",
    })

    if (existingSession) {
      return formatSession(existingSession)
    }
  }

  const now = new Date()

  const newSession = {
    userId,
    userName,
    email,
    status: "active" as const,
    lastMessageAt: now,
    createdAt: now,
  }

  const result = await sessionsCollection.insertOne(newSession)

  return {
    id: result.insertedId.toString(),
    ...newSession,
    lastMessageAt: now.toISOString(),
    createdAt: now.toISOString(),
  }
}

// Obtener una sesión de chat por ID
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
  try {
    const sessionsCollection = getCollection("chat_sessions")

    const session = await sessionsCollection.findOne({ _id: new ObjectId(sessionId) })

    if (!session) return null

    return formatSession(session)
  } catch (error) {
    console.error("Error al obtener sesión de chat:", error)
    return null
  }
}

// Obtener sesiones de chat activas
export async function getActiveChatSessions(): Promise<ChatSession[]> {
  const sessionsCollection = getCollection("chat_sessions")

  const sessions = await sessionsCollection.find({ status: "active" }).sort({ lastMessageAt: -1 }).toArray()

  return sessions.map(formatSession)
}

// Cerrar una sesión de chat
export async function closeChatSession(sessionId: string): Promise<void> {
  const sessionsCollection = getCollection("chat_sessions")

  await sessionsCollection.updateOne(
    { _id: new ObjectId(sessionId) },
    {
      $set: {
        status: "closed",
        closedAt: new Date(),
      },
    },
  )
}

// Añadir un mensaje a una sesión de chat
export async function addChatMessage(
  sessionId: string,
  message: string,
  isAdmin: boolean,
  userName: string,
  userId?: string,
): Promise<ChatMessage> {
  const messagesCollection = getCollection("chat_messages")
  const sessionsCollection = getCollection("chat_sessions")

  // Verificar si la sesión existe
  const session = await getChatSession(sessionId)

  if (!session) {
    throw new Error("Sesión de chat no encontrada")
  }

  if (session.status !== "active") {
    throw new Error("No se pueden añadir mensajes a una sesión cerrada")
  }

  const now = new Date()

  const newMessage = {
    sessionId,
    userId,
    userName,
    isAdmin,
    message,
    read: false,
    createdAt: now,
  }

  const result = await messagesCollection.insertOne(newMessage)

  // Actualizar la fecha del último mensaje en la sesión
  await sessionsCollection.updateOne({ _id: new ObjectId(sessionId) }, { $set: { lastMessageAt: now } })

  return {
    id: result.insertedId.toString(),
    ...newMessage,
    createdAt: now.toISOString(),
  }
}

// Obtener mensajes de una sesión de chat
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const messagesCollection = getCollection("chat_messages")

  const messages = await messagesCollection.find({ sessionId }).sort({ createdAt: 1 }).toArray()

  return messages.map(formatMessage)
}

// Marcar mensajes como leídos
export async function markMessagesAsRead(sessionId: string, isAdmin: boolean): Promise<void> {
  const messagesCollection = getCollection("chat_messages")

  await messagesCollection.updateMany(
    {
      sessionId,
      isAdmin: !isAdmin, // Marcar como leídos los mensajes del otro lado
      read: false,
    },
    { $set: { read: true } },
  )
}

// Obtener conteo de mensajes no leídos para administradores
export async function getUnreadAdminMessageCount(): Promise<number> {
  const messagesCollection = getCollection("chat_messages")

  return await messagesCollection.countDocuments({
    isAdmin: false,
    read: false,
  })
}

// Obtener conteo de mensajes no leídos para un usuario
export async function getUnreadUserMessageCount(sessionId: string): Promise<number> {
  const messagesCollection = getCollection("chat_messages")

  return await messagesCollection.countDocuments({
    sessionId,
    isAdmin: true,
    read: false,
  })
}
