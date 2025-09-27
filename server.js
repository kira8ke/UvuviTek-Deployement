const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🐟 Starting Uvuvi Tek n8n Backend...');

// Set n8n environment variables
process.env.N8N_USER_FOLDER = path.join(__dirname, '.n8n');
process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
process.env.N8N_PORT = process.env.PORT || process.env.N8N_PORT || '5678';
process.env.N8N_PROTOCOL = 'https';
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Ensure .n8n directory exists
const n8nDir = path.join(__dirname, '.n8n');
const workflowsDir = path.join(n8nDir, 'workflows');

if (!fs.existsSync(n8nDir)) {
    fs.mkdirSync(n8nDir, { recursive: true });
}

if (!fs.existsSync(workflowsDir)) {
    fs.mkdirSync(workflowsDir, { recursive: true });
}

// Copy workflows from source to n8n directory
const sourceWorkflowsDir = path.join(__dirname, 'workflows');
if (fs.existsSync(sourceWorkflowsDir)) {
    const workflowFiles = fs.readdirSync(sourceWorkflowsDir).filter(file => file.endsWith('.json'));
    
    workflowFiles.forEach(file => {
        const sourcePath = path.join(sourceWorkflowsDir, file);
        const destPath = path.join(workflowsDir, file);
        
        try {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`✅ Copied workflow: ${file}`);
        } catch (error) {
            console.error(`❌ Failed to copy ${file}:`, error.message);
        }
    });
}

console.log('🚀 Starting n8n server...');
console.log(`📡 Server will be available on port ${process.env.N8N_PORT}`);

// Start n8n
const n8nProcess = spawn('npx', ['n8n', 'start'], {
    stdio: 'inherit',
    env: process.env
});

n8nProcess.on('error', (error) => {
    console.error('❌ Failed to start n8n:', error);
    process.exit(1);
});

n8nProcess.on('close', (code) => {
    console.log(`n8n process exited with code ${code}`);
    process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    n8nProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    n8nProcess.kill('SIGINT');
});