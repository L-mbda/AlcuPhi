import { spawn } from 'child_process';
import { isBrowser, isBun, isDeno, isNode } from 'environment';
import { cp } from 'node:fs/promises';
import path from 'node:path';

console.clear();
console.log("alcuφ builder\nVer 0.0.1_INDEV\n\nGet ready for building! It's shooting at 1500 m/s. 🚀\n===============================\n");

let processCommand = '';
if (isBun) {
    processCommand = './scripts/bun.sh';
} else {
    processCommand = './scripts/node.sh';
}

// Copy "./questions" → "./next/server"
async function copyQuestionsDir() {
    const sourceDir = path.resolve('.', 'questions');
    const destDir   = path.resolve('var', 'tasks','questions');

    try {
        await cp(sourceDir, destDir, { recursive: true });
        console.log(`✅ Successfully copied ${sourceDir} → ${destDir}`);
    } catch (err) {
        // @ts-expect-error Expected
        console.error(`❌ Error while copying folder: ${err.message}`);
        process.exit(1);
    }
}

(async () => {
    // Spawn your build subprocess first
    const child = spawn('bash', [processCommand], {
        stdio: ['ignore', 'pipe', 'pipe'],
        cwd: process.cwd(),
        env: process.env
    });

    child.stdout.on('data', chunk => process.stdout.write(chunk));
    child.stderr.on('data', chunk => process.stderr.write(chunk));

    child.on('error', err => {
        console.error('Failed to start subprocess:', err);
        process.exit(1);
    });

    child.on('close', async code => {
        console.log(`\nNext build exited with code ${code}`);
        if (code !== 0) {
            process.exit(code);
        }
        // **After** successful build, copy questions folder
        await copyQuestionsDir();
    });
})();
