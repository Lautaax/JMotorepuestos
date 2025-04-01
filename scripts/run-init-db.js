// Este script carga las variables de entorno y ejecuta la inicialización de la base de datos
require("dotenv").config({ path: ".env.local" })
const { initDb } = require("./init-db")

// Ejecutar la inicialización
initDb()
  .then(() => {
    console.log("Script de inicialización completado")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error en el script de inicialización:", error)
    process.exit(1)
  })

