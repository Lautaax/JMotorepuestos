import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { EmailSubscriber, EmailCampaign } from "./types"

// Función para convertir _id de MongoDB a id string para suscriptores
function formatSubscriber(subscriber: any): EmailSubscriber {
  return {
    id: subscriber._id.toString(),
    email: subscriber.email,
    name: subscriber.name,
    isSubscribed: subscriber.isSubscribed,
    subscribedAt: subscriber.subscribedAt?.toISOString(),
    unsubscribedAt: subscriber.unsubscribedAt?.toISOString(),
    lastEmailSentAt: subscriber.lastEmailSentAt?.toISOString(),
  }
}

// Función para convertir _id de MongoDB a id string para campañas
function formatCampaign(campaign: any): EmailCampaign {
  return {
    id: campaign._id.toString(),
    name: campaign.name,
    subject: campaign.subject,
    content: campaign.content,
    sentTo: campaign.sentTo,
    opened: campaign.opened,
    clicked: campaign.clicked,
    status: campaign.status,
    scheduledFor: campaign.scheduledFor?.toISOString(),
    sentAt: campaign.sentAt?.toISOString(),
    createdAt: campaign.createdAt?.toISOString(),
    updatedAt: campaign.updatedAt?.toISOString(),
  }
}

// Obtener todos los suscriptores
export async function getSubscribers(onlyActive = false): Promise<EmailSubscriber[]> {
  const subscribersCollection = getCollection("email_subscribers")

  const filter = onlyActive ? { isSubscribed: true } : {}
  const subscribers = await subscribersCollection.find(filter).toArray()

  return subscribers.map(formatSubscriber)
}

// Obtener un suscriptor por ID
export async function getSubscriberById(id: string): Promise<EmailSubscriber | null> {
  try {
    const subscribersCollection = getCollection("email_subscribers")
    const subscriber = await subscribersCollection.findOne({ _id: new ObjectId(id) })

    if (!subscriber) return null

    return formatSubscriber(subscriber)
  } catch (error) {
    console.error("Error al obtener suscriptor por ID:", error)
    return null
  }
}

// Obtener un suscriptor por email
export async function getSubscriberByEmail(email: string): Promise<EmailSubscriber | null> {
  const subscribersCollection = getCollection("email_subscribers")
  const subscriber = await subscribersCollection.findOne({ email: email.toLowerCase() })

  if (!subscriber) return null

  return formatSubscriber(subscriber)
}

// Añadir un nuevo suscriptor
export async function addSubscriber(email: string, name?: string): Promise<EmailSubscriber> {
  const subscribersCollection = getCollection("email_subscribers")

  // Verificar si el email ya existe
  const existingSubscriber = await subscribersCollection.findOne({ email: email.toLowerCase() })

  if (existingSubscriber) {
    // Si existe pero está desuscrito, lo reactivamos
    if (!existingSubscriber.isSubscribed) {
      return await updateSubscriber(existingSubscriber._id.toString(), {
        isSubscribed: true,
        unsubscribedAt: undefined,
      })
    }

    // Si ya está suscrito, devolvemos el suscriptor existente
    return formatSubscriber(existingSubscriber)
  }

  // Crear nuevo suscriptor
  const newSubscriber = {
    email: email.toLowerCase(),
    name,
    isSubscribed: true,
    subscribedAt: new Date(),
  }

  const result = await subscribersCollection.insertOne(newSubscriber)

  return {
    id: result.insertedId.toString(),
    ...newSubscriber,
    subscribedAt: newSubscriber.subscribedAt.toISOString(),
  } as EmailSubscriber
}

// Actualizar un suscriptor
export async function updateSubscriber(id: string, updates: Partial<EmailSubscriber>): Promise<EmailSubscriber> {
  const subscribersCollection = getCollection("email_subscribers")

  // Si se está actualizando el email, asegurarse de que esté en minúsculas
  if (updates.email) {
    updates.email = updates.email.toLowerCase()
  }

  await subscribersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updates })

  const updatedSubscriber = await subscribersCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedSubscriber) {
    throw new Error("Suscriptor no encontrado después de la actualización")
  }

  return formatSubscriber(updatedSubscriber)
}

// Eliminar un suscriptor
export async function deleteSubscriber(id: string): Promise<void> {
  const subscribersCollection = getCollection("email_subscribers")
  await subscribersCollection.deleteOne({ _id: new ObjectId(id) })
}

// Desuscribir por email
export async function unsubscribe(email: string): Promise<void> {
  const subscribersCollection = getCollection("email_subscribers")

  await subscribersCollection.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        isSubscribed: false,
        unsubscribedAt: new Date(),
      },
    },
  )
}

// Obtener todas las campañas
export async function getCampaigns(): Promise<EmailCampaign[]> {
  const campaignsCollection = getCollection("email_campaigns")
  const campaigns = await campaignsCollection.find({}).sort({ createdAt: -1 }).toArray()

  return campaigns.map(formatCampaign)
}

// Obtener una campaña por ID
export async function getCampaignById(id: string): Promise<EmailCampaign | null> {
  try {
    const campaignsCollection = getCollection("email_campaigns")
    const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) })

    if (!campaign) return null

    return formatCampaign(campaign)
  } catch (error) {
    console.error("Error al obtener campaña por ID:", error)
    return null
  }
}

// Crear una nueva campaña
export async function createCampaign(
  campaign: Omit<EmailCampaign, "id" | "sentTo" | "opened" | "clicked" | "createdAt" | "updatedAt">,
): Promise<EmailCampaign> {
  const campaignsCollection = getCollection("email_campaigns")

  const campaignToInsert = {
    ...campaign,
    sentTo: 0,
    opened: 0,
    clicked: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await campaignsCollection.insertOne(campaignToInsert)

  return {
    id: result.insertedId.toString(),
    ...campaignToInsert,
    createdAt: campaignToInsert.createdAt.toISOString(),
    updatedAt: campaignToInsert.updatedAt.toISOString(),
  } as EmailCampaign
}

// Actualizar una campaña
export async function updateCampaign(id: string, updates: Partial<EmailCampaign>): Promise<EmailCampaign> {
  const campaignsCollection = getCollection("email_campaigns")

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await campaignsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedCampaign = await campaignsCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedCampaign) {
    throw new Error("Campaña no encontrada después de la actualización")
  }

  return formatCampaign(updatedCampaign)
}

// Eliminar una campaña
export async function deleteCampaign(id: string): Promise<void> {
  const campaignsCollection = getCollection("email_campaigns")
  await campaignsCollection.deleteOne({ _id: new ObjectId(id) })
}

