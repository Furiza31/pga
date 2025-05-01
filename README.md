# PGA - Conception et Développement d'une Plateforme de Gestion Associative avec Base de Données Relationnelle

# Setup du projet

## Script de lancement

Si vous souhaitez lancer le projet sans problèmes, vous pouvez utiliser le script `install.sh` (pour linux) ou `install.ps1` (pour Windows) qui va tout faire pour vous.

PS: Ce script a été généré par ChatGPT, nous l'avons testé et il fonctionne parfaitement.

## Prérequis

- Node.js
- npm
- Docker
- Docker Compose

## Installation

1. Clonez le dépôt :

```bash
git clone
cd pga
```

2. Installez les dépendances :

```bash
cd api
npm install
cd app
npm install
```

3. Configurez les variables d'environnement :

   - Copiez le fichier `.env.example` en `.env` dans le répertoire `api` et remplissez les valeurs nécessaires.
   - Copiez le fichier `.env.example` en `.env` dans le répertoire `app` et remplissez les valeurs nécessaires.

4. Démarrez les conteneurs Docker :

```bash
cd api
docker-compose up -d
```

5. Démarrez l'application :

```bash
cd api
npm dev
cd app
npm start
```

6. Accédez à l'application :

   - Frontend : [http://localhost:3000](http://localhost:3000)
   - Backend : [http://localhost:5000](http://localhost:5173/)

# Plus d'informations

## API

Aller dans le dossier `api` et regarder le fichier `README.md` pour plus d'informations sur l'API.

## Frontend

Aller dans le dossier `app` et regarder le fichier `README.md` pour plus d'informations sur le frontend.
