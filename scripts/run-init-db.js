// Este script ejecuta la inicialización de la base de datos
const { initDb } = require("./init-db")

initDb()
  .then(() => {
    console.log("Inicialización de la base de datos completada con éxito")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error al inicializar la base de datos:", error)
    process.exit(1)
  })
