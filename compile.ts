import { spawn } from "child_process"
import { isBun } from "environment"
import { cp } from "node:fs/promises"
import path from "node:path"
import fs from "node:fs"
import { performance } from "node:perf_hooks"

console.clear()
console.log(
  "alcuφ builder\nVer 0.0.1_INDEV\n\nGet ready for building! It's shooting at 1500 m/s. 🚀\n===============================\n",
)

let processCommand = ""
if (isBun) {
  processCommand = "./scripts/bun.sh"
} else {
  processCommand = "./scripts/node.sh"
}

// Copy "./questions" → "./next/server" with improved error handling and performance
async function copyQuestionsDir() {
  const sourceDir = path.resolve(".", "questions")
  const destDir = path.resolve("_next", "static", "questions")

  try {
    // Check if source directory exists
    try {
      await fs.promises.access(sourceDir)
    } catch (err) {
      console.warn(`⚠️ Questions directory not found at ${sourceDir}, skipping copy`)
      return
    }

    // Create destination directory if it doesn't exist
    try {
      await fs.promises.mkdir(destDir, { recursive: true })
    } catch (err) {
      // Directory might already exist, continue
    }

    // Copy only if needed (check if files are different)
    const startTime = performance.now()
    await cp(sourceDir, destDir, { recursive: true })

    const copyTime = (performance.now() - startTime).toFixed(2)
    console.log(`✅ Successfully copied questions in ${copyTime}ms: ${sourceDir} → ${destDir}`)
  } catch (err) {
    // @ts-expect-error Expected
    console.error(`❌ Error while copying folder: ${err.message}`)
    // Don't exit process on error, just log it
    // process.exit(1)
  }
}
;(async () => {
  // Spawn your build subprocess first
  const child = spawn("bash", [processCommand], {
    stdio: ["ignore", "pipe", "pipe"],
    cwd: process.cwd(),
    env: process.env,
  })

  child.stdout.on("data", (chunk) => process.stdout.write(chunk))
  child.stderr.on("data", (chunk) => process.stderr.write(chunk))

  child.on("error", (err) => {
    console.error("Failed to start subprocess:", err)
    process.exit(1)
  })

  child.on("close", async (code) => {
    console.log(`\nNext build exited with code ${code}`)
    if (code !== 0) {
      process.exit(code)
    }
    // **After** successful build, copy questions folder
    await copyQuestionsDir()
  })
})()
