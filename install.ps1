# Script d'installation pour Windows (PowerShell)
# Plateforme de Gestion Associative (PGA)

# Couleurs pour le terminal
$Green = "$([char]0x1b)[0;32m"
$Yellow = "$([char]0x1b)[1;33m"
$Blue = "$([char]0x1b)[0;34m"
$Red = "$([char]0x1b)[0;31m"
$NC = "$([char]0x1b)[0m" # No Color

# Fonction pour afficher les messages de log
function Log {
    param([string]$message)
    Write-Host "${Blue}[INFO]${NC} $message"
}

function LogSuccess {
    param([string]$message)
    Write-Host "${Green}[SUCCESS]${NC} $message"
}

function LogWarning {
    param([string]$message)
    Write-Host "${Yellow}[WARNING]${NC} $message"
}

function LogError {
    param([string]$message)
    Write-Host "${Red}[ERROR]${NC} $message"
}

# Vérification des prérequis
function CheckPrerequisites {
    Log "Vérification des prérequis..."
    
    # Vérifier si Node.js est installé
    try {
        $nodeVersion = node -v
        $nodeMajorVersion = [int]($nodeVersion -replace 'v', '').Split('.')[0]
        
        if ($nodeMajorVersion -lt 14) {
            LogWarning "Version de Node.js détectée: $nodeVersion. Version 14 ou supérieure recommandée."
        } else {
            LogSuccess "Node.js $nodeVersion détecté."
        }
    } catch {
        LogError "Node.js n'est pas installé ou n'est pas accessible dans le PATH. Veuillez l'installer avant de continuer."
        exit 1
    }
    
    # Vérifier si npm est installé
    try {
        $npmVersion = npm -v
        LogSuccess "npm $npmVersion détecté."
    } catch {
        LogError "npm n'est pas installé ou n'est pas accessible dans le PATH. Veuillez l'installer avant de continuer."
        exit 1
    }
    
    # Vérifier si Docker est installé
    try {
        $dockerVersion = docker --version
        LogSuccess "Docker détecté: $dockerVersion"
    } catch {
        LogError "Docker n'est pas installé ou n'est pas accessible dans le PATH. Veuillez l'installer avant de continuer."
        exit 1
    }
    
    # Vérifier si Docker Compose est installé
    try {
        $dockerComposeVersion = docker-compose --version
        LogSuccess "Docker Compose détecté: $dockerComposeVersion"
    } catch {
        LogError "Docker Compose n'est pas installé ou n'est pas accessible dans le PATH. Veuillez l'installer avant de continuer."
        exit 1
    }
    
    LogSuccess "Tous les prérequis sont satisfaits!"
}

# Génération d'une clé JWT secrète sécurisée
function GenerateJwtSecret {
    Log "Génération d'une clé JWT secrète..."
    $jwtSecret = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    LogSuccess "Clé JWT secrète générée avec succès."
    return $jwtSecret
}

# Configuration des fichiers d'environnement
function SetupEnvFiles {
    param([string]$jwtSecret)
    
    Log "Configuration des fichiers d'environnement..."
    
    # Création du fichier .env pour l'API
    if (-not (Test-Path "./api/.env")) {
        Log "Création du fichier .env pour l'API..."
        $apiEnvContent = @"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=association_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
"@
        Set-Content -Path "./api/.env" -Value $apiEnvContent -Encoding UTF8
        LogSuccess "Fichier .env de l'API créé."
    } else {
        LogWarning "Le fichier .env de l'API existe déjà. Pas de modification."
    }
    
    # Création du fichier .env pour l'application
    if (-not (Test-Path "./app/.env")) {
        Log "Création du fichier .env pour l'application..."
        $appEnvContent = @"
VITE_API_URL=http://localhost:5000
"@
        Set-Content -Path "./app/.env" -Value $appEnvContent -Encoding UTF8
        LogSuccess "Fichier .env de l'application créé."
    } else {
        LogWarning "Le fichier .env de l'application existe déjà. Pas de modification."
    }
}

# Installation des dépendances de l'API
function InstallApiDeps {
    Log "Installation des dépendances de l'API..."
    Push-Location -Path "api"
    npm install
    if ($LASTEXITCODE -eq 0) {
        LogSuccess "Dépendances de l'API installées avec succès."
    } else {
        LogError "Erreur lors de l'installation des dépendances de l'API."
        exit 1
    }
    Pop-Location
}

# Installation des dépendances de l'application
function InstallAppDeps {
    Log "Installation des dépendances de l'application..."
    Push-Location -Path "app"
    npm install
    if ($LASTEXITCODE -eq 0) {
        LogSuccess "Dépendances de l'application installées avec succès."
    } else {
        LogError "Erreur lors de l'installation des dépendances de l'application."
        exit 1
    }
    Pop-Location
}

# Démarrage des conteneurs Docker
function StartDockerContainers {
    Log "Démarrage des conteneurs Docker..."
    Push-Location -Path "api"
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        LogSuccess "Conteneurs Docker démarrés avec succès."
    } else {
        LogError "Erreur lors du démarrage des conteneurs Docker."
        exit 1
    }
    Pop-Location
}

# Démarrage de l'API
function StartApi {
    Log "Pour démarrer l'API, exécutez la commande suivante dans le répertoire api:"
    Log "  ${Yellow}cd api; npm run dev${NC}"
}

# Démarrage de l'application
function StartApp {
    Log "Pour démarrer l'application, exécutez la commande suivante dans le répertoire app:"
    Log "  ${Yellow}cd app; npm run dev${NC}"
}

# Information finale
function ShowInfo {
    Write-Host ""
    Write-Host "${Green}========================================${NC}"
    Write-Host "${Green}  PGA déployé avec succès!  ${NC}"
    Write-Host "${Green}========================================${NC}"
    Write-Host ""
    Write-Host "L'API est accessible à l'adresse: ${Blue}http://localhost:5000${NC}"
    Write-Host "L'application est accessible à l'adresse: ${Blue}http://localhost:5173${NC}"
    Write-Host "Base de données PostgreSQL: ${Blue}localhost:5432${NC}"
    Write-Host "Interface Adminer (gestion de la BDD): ${Blue}http://localhost:8080${NC}"
    Write-Host ""
    Write-Host "Compte administrateur par défaut:"
    Write-Host "  Email: ${Yellow}admin@example.com${NC}"
    Write-Host "  Mot de passe: ${Yellow}admin123${NC}"
    Write-Host "${Red}Important: Changez ce mot de passe immédiatement en production!${NC}"
    Write-Host ""
    Write-Host "Pour arrêter l'API et l'application, utilisez Ctrl+C dans leurs consoles respectives"
    Write-Host "Pour arrêter la base de données: ${Yellow}cd api; docker-compose down${NC}"
    Write-Host ""
}

# Exécution principale
function Main {
    Write-Host "${Green}=== Installation de la Plateforme de Gestion Associative (PGA) ===${NC}"
    
    CheckPrerequisites
    $jwtSecret = GenerateJwtSecret
    SetupEnvFiles -jwtSecret $jwtSecret
    InstallApiDeps
    InstallAppDeps
    StartDockerContainers
    StartApi
    StartApp
    ShowInfo
}

# Lancement du script
Main