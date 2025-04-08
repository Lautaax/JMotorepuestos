const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

// Directorios a eliminar
const dirsToRemove = [".next", ".next-temp", "node_modules/.cache"]

console.log("🧹 Limpiando caché de Next.js...")

// Eliminar directorios
dirsToRemove.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir)

  if (fs.existsSync(dirPath)) {
    console.log(`Eliminando ${dir}...`)
    try {
      fs.rmSync(dirPath, { recursive: true, force: true })
      console.log(`✅ ${dir} eliminado correctamente`)
    } catch (error) {
      console.error(`❌ Error al eliminar ${dir}:`, error)
    }
  } else {
    console.log(`ℹ️ ${dir} no existe, saltando...`)
  }
})

// Ejecutar next build para regenerar la caché
console.log("\n🔨 Reconstruyendo la aplicación...")
try {
  execSync("npm run build", { stdio: "inherit" })
  console.log("✅ Reconstrucción completada")
} catch (error) {
  console.error("❌ Error durante la reconstrucción:", error)
}

console.log('\n✨ Proceso completado. Reinicia el servidor de desarrollo con "npm run dev"')
