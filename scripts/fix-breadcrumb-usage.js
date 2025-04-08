const fs = require("fs")
const path = require("path")

// Directory to search for files
const directoryPath = path.join(__dirname, "..")

// Function to recursively find all .tsx files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      fileList = findTsxFiles(filePath, fileList)
    } else if (file.endsWith(".tsx")) {
      fileList.push(filePath)
    }
  })

  return fileList
}

// Function to fix isCurrentPage in files
function fixIsCurrentPage(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8")

    // Check if the file contains isCurrentPage
    if (content.includes("isCurrentPage")) {
      console.log(`Fixing file: ${filePath}`)

      // Replace isCurrentPage with aria-current="page"
      const updatedContent = content.replace(/isCurrentPage/g, 'aria-current="page"')

      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, "utf8")
      console.log(`✅ Fixed: ${filePath}`)
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error)
  }
}

// Find all .tsx files and fix them
const tsxFiles = findTsxFiles(directoryPath)
console.log(`Found ${tsxFiles.length} .tsx files to check`)

tsxFiles.forEach((filePath) => {
  fixIsCurrentPage(filePath)
})

console.log("Breadcrumb fix completed!")
