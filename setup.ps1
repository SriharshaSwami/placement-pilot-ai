mkdir -Force docs
mkdir -Force .github\workflows
Move-Item *.md docs\
$clientDirs = @(
    "client\src\app", "client\src\assets", "client\src\components\common", "client\src\components\layout",
    "client\src\components\ui", "client\src\components\feedback", "client\src\features\auth",
    "client\src\features\dashboard", "client\src\features\resume", "client\src\features\jobs",
    "client\src\features\applications", "client\src\features\interview", "client\src\features\ai",
    "client\src\features\profile", "client\src\features\settings", "client\src\hooks",
    "client\src\services", "client\src\contexts", "client\src\lib", "client\src\utils",
    "client\src\constants", "client\src\types", "client\src\schemas", "client\src\styles",
    "client\src\routes", "client\public"
)
foreach ($dir in $clientDirs) { mkdir -Force $dir }

$serverDirs = @(
    "server\src\config", "server\src\routes", "server\src\controllers", "server\src\services",
    "server\src\repositories", "server\src\models", "server\src\middleware", "server\src\validators",
    "server\src\ai\prompts", "server\src\ai\adapters", "server\src\ai\parsers", "server\src\ai\validators",
    "server\src\ai\services", "server\src\ai\schemas", "server\src\integrations\cloudinary",
    "server\src\integrations\gemini", "server\src\integrations\oauth", "server\src\integrations\email",
    "server\src\utils", "server\src\constants", "server\src\errors", "server\src\logger",
    "server\src\database", "server\src\jobs", "server\src\types"
)
foreach ($dir in $serverDirs) { mkdir -Force $dir }

# Create placeholders
New-Item -ItemType File -Force client\src\main.jsx
New-Item -ItemType File -Force client\vite.config.js
New-Item -ItemType File -Force server\src\app.js
New-Item -ItemType File -Force server\src\server.js
New-Item -ItemType File -Force server\.env.example
New-Item -ItemType File -Force .gitignore
New-Item -ItemType File -Force LICENSE
