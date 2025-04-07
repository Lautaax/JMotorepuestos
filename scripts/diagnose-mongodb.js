const { MongoClient } = require("mongodb")
require("dotenv").config()

async function diagnoseMongoDBConnection() {
  console.log("=== DIAGNÓSTICO DE CONEXIÓN MONGODB ===\n")

  // Mostrar información de entorno
  console.log("Variables de entorno:")
  console.log(`MONGODB_URI: ${process.env.MONGODB_URI || "No definido"}`)
  console.log(`MONGODB_DB_NAME: ${process.env.MONGODB_DB_NAME || "No definido"}`)

  // Intentar diferentes URIs
  const urisToTry = [
    process.env.MONGODB_URI || "mongodb://localhost:27017",
    "mongodb://localhost:27017",
    "mongodb://127.0.0.1:27017",
  ]

  for (const uri of urisToTry) {
    console.log(`\nIntentando conectar a: ${uri}`)

    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
        connectTimeoutMS: 5000,
      })

      await client.connect()
      console.log("✅ Conexión exitosa")

      // Listar todas las bases de datos
      console.log("\nBases de datos disponibles:")
      const databasesList = await client.db().admin().listDatabases()

      if (databasesList.databases.length === 0) {
        console.log("No se encontraron bases de datos.")
      } else {
        for (const db of databasesList.databases) {
          console.log(`- ${db.name} (${db.sizeOnDisk} bytes)`)

          // Listar colecciones en cada base de datos
          try {
            const collections = await client.db(db.name).listCollections().toArray()
            if (collections.length > 0) {
              console.log(`  Colecciones en ${db.name}:`)
              for (const collection of collections) {
                console.log(`  - ${collection.name}`)

                // Contar documentos en cada colección
                try {
                  const count = await client.db(db.name).collection(collection.name).countDocuments()
                  console.log(`    Documentos: ${count}`)

                  // Si hay documentos, mostrar un ejemplo
                  if (count > 0) {
                    const sample = await client.db(db.name).collection(collection.name).findOne({})
                    console.log(`    Ejemplo de documento:`)
                    console.log(`    ${JSON.stringify(sample, null, 2).substring(0, 200)}...`)
                  }
                } catch (e) {
                  console.log(`    Error al contar documentos: ${e.message}`)
                }
              }
            } else {
              console.log(`  No hay colecciones en ${db.name}`)
            }
          } catch (e) {
            console.log(`  Error al listar colecciones: ${e.message}`)
          }
        }
      }

      await client.close()
      console.log("\nConexión cerrada correctamente.")
      return // Salir después de una conexión exitosa
    } catch (error) {
      console.log(`❌ Error de conexión: ${error.message}`)
      console.log("Intentando con la siguiente URI...")
    }
  }

  console.log("\n⚠️ No se pudo conectar a MongoDB con ninguna de las URIs probadas.")
  console.log("\nPosibles soluciones:")
  console.log("1. Verifica que el servidor MongoDB esté en ejecución")
  console.log("2. Comprueba que la URI de conexión sea correcta")
  console.log("3. Asegúrate de que no haya un firewall bloqueando la conexión")
  console.log("4. Verifica las credenciales si estás usando autenticación")
  console.log("5. Comprueba que el usuario tenga permisos para acceder a la base de datos")
}

// Ejecutar la función de diagnóstico
diagnoseMongoDBConnection().catch(console.error)

