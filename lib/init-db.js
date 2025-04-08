const { MongoClient } = require("mongodb")
const { connectToDatabase } = require("./mongodb")

// Función para inicializar la base de datos
async function initializeDatabase() {
  try {
    console.log("Connecting to database...")
    const { db } = await connectToDatabase()

    console.log("Creating collections if they don't exist...")

    // Crear colecciones si no existen
    await db.createCollection("products")
    await db.createCollection("categories")
    await db.createCollection("users")
    await db.createCollection("orders")
    await db.createCollection("reviews")
    await db.createCollection("coupons")
    await db.createCollection("loyalty_programs")
    await db.createCollection("chat_sessions")
    await db.createCollection("chat_messages")
    await db.createCollection("email_subscribers")

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}

module.exports = { initializeDatabase }
