const { MongoClient } = require("mongodb")
require("dotenv").config()

async function checkConnection() {
  console.log("=== VERIFICACIÓN BÁSICA DE MONGODB ===\n")

  // Usar la URI de las variables de entorno o la predeterminada
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  console.log(`Intentando conectar a: ${uri}`)

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  })

  try {
    await client.connect()
    console.log("✅ Conexión exitosa a MongoDB")

    // Obtener información del servidor
    const adminDb = client.db("admin")
    const serverInfo = await adminDb.command({ serverStatus: 1 })

    console.log("\nInformación del servidor MongoDB:")
    console.log(`Versión: ${serverInfo.version}`)
    console.log(
      `Uptime: ${Math.floor(serverInfo.uptime / 86400)} días, ${Math.floor((serverInfo.uptime % 86400) / 3600)} horas`,
    )

    // Listar bases de datos
    const dbs = await client.db().admin().listDatabases()
    console.log("\nBases de datos disponibles:")
    dbs.databases.forEach((db) => {
      console.log(`- ${db.name}`)
    })

    // Verificar la base de datos específica
    const dbName = process.env.MONGODB_DB_NAME || "delsur"
    console.log(`\nVerificando base de datos: ${dbName}`)

    const database = client.db(dbName)
    const collections = await database.listCollections().toArray()

    if (collections.length > 0) {
      console.log(`Colecciones en ${dbName}:`)
      for (const collection of collections) {
        console.log(`- ${collection.name}`)
        const count = await database.collection(collection.name).countDocuments()
        console.log(`  Documentos: ${count}`)
      }
    } else {
      console.log(`No se encontraron colecciones en la base de datos ${dbName}`)
    }
  } catch (error) {
    console.error("❌ Error de conexión:", error.message)
    console.log("\nDetalles adicionales del error:")
    console.error(error)
  } finally {
    await client.close()
    console.log("\nConexión cerrada.")
  }
}

checkConnection().catch(console.error)
