#!/bin/bash

# Couleurs pour le terminal
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages de log
log() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
  log "Vérification des prérequis..."
  
  # Vérifier si Node.js est installé
  if ! command -v node &> /dev/null; then
    log_error "Node.js n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
  fi
  
  # Vérifier la version de Node.js (v14+ recommandé)
  NODE_VERSION=$(node -v | cut -d "v" -f 2)
  NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d "." -f 1)
  if [ $NODE_MAJOR_VERSION -lt 14 ]; then
    log_warning "Version de Node.js détectée: $NODE_VERSION. Version 14 ou supérieure recommandée."
  else
    log_success "Node.js v$NODE_VERSION détecté."
  fi
  
  # Vérifier si npm est installé
  if ! command -v npm &> /dev/null; then
    log_error "npm n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
  else
    log_success "npm détecté."
  fi
  
  # Vérifier si Docker est installé
  if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
  else
    log_success "Docker détecté."
  fi
  
  # Vérifier si Docker Compose est installé
  if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose n'est pas installé. Veuillez l'installer avant de continuer."
    exit 1
  else
    log_success "Docker Compose détecté."
  fi
  
  log_success "Tous les prérequis sont satisfaits!"
}

# Génération d'une clé JWT secrète sécurisée
generate_jwt_secret() {
  log "Génération d'une clé JWT secrète..."
  JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
  log_success "Clé JWT secrète générée avec succès."
}

# Configuration des fichiers d'environnement
setup_env_files() {
  log "Configuration des fichiers d'environnement..."
  
  # Création du fichier .env pour l'API
  if [ ! -f "./api/.env" ]; then
    log "Création du fichier .env pour l'API..."
    cat > ./api/.env << EOL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=association_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
EOL
    log_success "Fichier .env de l'API créé."
  else
    log_warning "Le fichier .env de l'API existe déjà. Pas de modification."
  fi
  
  # Création du fichier .env pour l'application
  if [ ! -f "./app/.env" ]; then
    log "Création du fichier .env pour l'application..."
    cat > ./app/.env << EOL
VITE_API_URL=http://localhost:5000
EOL
    log_success "Fichier .env de l'application créé."
  else
    log_warning "Le fichier .env de l'application existe déjà. Pas de modification."
  fi
}

# Installation des dépendances de l'API
install_api_deps() {
  log "Installation des dépendances de l'API..."
  cd api
  npm install
  if [ $? -eq 0 ]; then
    log_success "Dépendances de l'API installées avec succès."
  else
    log_error "Erreur lors de l'installation des dépendances de l'API."
    exit 1
  fi
  cd ..
}

# Installation des dépendances de l'application
install_app_deps() {
  log "Installation des dépendances de l'application..."
  cd app
  npm install
  if [ $? -eq 0 ]; then
    log_success "Dépendances de l'application installées avec succès."
  else
    log_error "Erreur lors de l'installation des dépendances de l'application."
    exit 1
  fi
  cd ..
}

# Démarrage des conteneurs Docker
start_docker_containers() {
  log "Démarrage des conteneurs Docker..."
  cd api
  docker-compose up -d
  if [ $? -eq 0 ]; then
    log_success "Conteneurs Docker démarrés avec succès."
  else
    log_error "Erreur lors du démarrage des conteneurs Docker."
    exit 1
  fi
  cd ..
}

# Démarrage de l'API
start_api() {
  log "Pour démarrer l'API, exécutez la commande suivante dans le répertoire api:"
  log "  ${YELLOW}cd api && npm run dev${NC}"
}

# Démarrage de l'application
start_app() {
  log "Pour démarrer l'application, exécutez la commande suivante dans le répertoire app:"
  log "  ${YELLOW}cd app && npm run dev${NC}"
}

# Information finale
show_info() {
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}  PGA déployé avec succès!  ${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "L'API est accessible à l'adresse: ${BLUE}http://localhost:5000${NC}"
  echo -e "L'application est accessible à l'adresse: ${BLUE}http://localhost:5173${NC}"
  echo -e "Base de données PostgreSQL: ${BLUE}localhost:5432${NC}"
  echo -e "Interface Adminer (gestion de la BDD): ${BLUE}http://localhost:8080${NC}"
  echo ""
  echo -e "Compte administrateur par défaut:"
  echo -e "  Email: ${YELLOW}admin@example.com${NC}"
  echo -e "  Mot de passe: ${YELLOW}admin123${NC}"
  echo -e "${RED}Important: Changez ce mot de passe immédiatement en production!${NC}"
  echo ""
  echo -e "Pour arrêter l'application, utilisez: ${YELLOW}kill $APP_PID $API_PID${NC}"
  echo -e "Pour arrêter la base de données: ${YELLOW}cd api && docker-compose down${NC}"
  echo ""
}

# Exécution principale
main() {
  echo -e "${GREEN}=== Installation de la Plateforme de Gestion Associative (PGA) ===${NC}"
  
  check_prerequisites
  generate_jwt_secret
  setup_env_files
  install_api_deps
  install_app_deps
  start_docker_containers
  start_api
  start_app
  show_info
}

# Lancement du script
main

