const fs = require('fs')
const path = require('path')

// Conversion factor
const conversionFactor = 80

// Function to replace rem with px
function replaceRemWithPx(content) {
  return content.replace(/(\d+(\.\d+)?)rem/g, (match, value) => {
    const pxValue = parseFloat(value) * conversionFactor
    return `${pxValue}px`
  })
}

// Function to process a file
function processFile(filePath) {
  // Read the file content
  const content = fs.readFileSync(filePath, 'utf8')

  // Replace rem with px
  const updatedContent = replaceRemWithPx(content)

  // Generate updated file path
  const dirName = path.dirname(filePath)
  const baseName = path.basename(filePath, path.extname(filePath))
  const extName = path.extname(filePath)
  const updatedFilePath = path.join(dirName, `${baseName}_updated${extName}`)

  // Write the updated content to the new file
  fs.writeFileSync(updatedFilePath, updatedContent, 'utf8')

  console.log(`Processed: ${filePath} -> ${updatedFilePath}`)
}

// Function to process all files and subdirectories in a directory
function processDirectory(directoryPath) {
  // Read all items in the directory
  const items = fs.readdirSync(directoryPath)

  items.forEach(item => {
    const itemPath = path.join(directoryPath, item)

    // Check if the item is a directory
    if (fs.statSync(itemPath).isDirectory()) {
      // Recursively process the subdirectory
      processDirectory(itemPath)
    } else if (fs.statSync(itemPath).isFile()) {
      // Process the file
      processFile(itemPath)
    }
  })
}

// Directory path to process
const directoryPath = path.resolve('./production') // Replace with your directory path

// Start processing
processDirectory(directoryPath)
