const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up n8n workflows for Uvuvi Tek...');

// Ensure directories exist
const n8nDir = path.join(__dirname, '.n8n');
const workflowsDir = path.join(n8nDir, 'workflows');

[n8nDir, workflowsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Copy workflow files
const sourceWorkflowsDir = path.join(__dirname, 'workflows');

if (fs.existsSync(sourceWorkflowsDir)) {
    const workflowFiles = fs.readdirSync(sourceWorkflowsDir).filter(file => file.endsWith('.json'));
    
    console.log(`📋 Found ${workflowFiles.length} workflow files:`);
    
    workflowFiles.forEach(file => {
        const sourcePath = path.join(sourceWorkflowsDir, file);
        const destPath = path.join(workflowsDir, file);
        
        try {
            const workflowContent = fs.readFileSync(sourcePath, 'utf8');
            const workflow = JSON.parse(workflowContent);
            
            // Ensure workflow has required properties
            if (!workflow.id) {
                workflow.id = Math.random().toString(36).substr(2, 9);
            }
            
            if (!workflow.name) {
                workflow.name = file.replace('.json', '');
            }
            
            fs.writeFileSync(destPath, JSON.stringify(workflow, null, 2));
            console.log(`✅ Processed workflow: ${file}`);
            
        } catch (error) {
            console.error(`❌ Failed to process ${file}:`, error.message);
        }
    });
} else {
    console.log('⚠️  No workflows directory found');
}

console.log('✨ Workflow setup complete!');