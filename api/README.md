# Conception et Développement d'une Plateforme de Gestion Associative avec Base de Données Relationnelle

## 📖 Documentation de l'API

### 🔐 Authentification & Rôles

| Méthode | Endpoint              | Description                                 |
| ------- | --------------------- | ------------------------------------------- |
| POST    | `/api/register`       | Créer un compte utilisateur                 |
| POST    | `/api/login`          | Connexion de l'utilisateur                  |
| POST    | `/api/logout`         | Déconnexion                                 |
| GET     | `/api/user`           | Obtenir les infos de l’utilisateur connecté |
| GET     | `/api/users/roles`    | Lister les rôles (admin, membre)            |
| PUT     | `/api/users/:id/role` | Modifier le rôle d’un utilisateur           |

---

### 👥 Gestion des Membres

| Méthode | Endpoint           | Description             |
| ------- | ------------------ | ----------------------- |
| GET     | `/api/members`     | Lister tous les membres |
| GET     | `/api/members/:id` | Détails d’un membre     |
| POST    | `/api/members`     | Ajouter un membre       |
| PUT     | `/api/members/:id` | Modifier un membre      |
| DELETE  | `/api/members/:id` | Supprimer un membre     |

---

### 📅 Gestion des Événements

| Méthode | Endpoint          | Description                |
| ------- | ----------------- | -------------------------- |
| GET     | `/api/events`     | Lister tous les événements |
| GET     | `/api/events/:id` | Détails d’un événement     |
| POST    | `/api/events`     | Créer un événement         |
| PUT     | `/api/events/:id` | Modifier un événement      |
| DELETE  | `/api/events/:id` | Supprimer un événement     |

---

### 📁 Gestion des Projets Collaboratifs

| Méthode | Endpoint                              | Description                     |
| ------- | ------------------------------------- | ------------------------------- |
| GET     | `/api/projects`                       | Lister tous les projets         |
| GET     | `/api/projects/:id`                   | Détails d’un projet             |
| POST    | `/api/projects`                       | Créer un projet                 |
| PUT     | `/api/projects/:id`                   | Modifier un projet              |
| DELETE  | `/api/projects/:id`                   | Supprimer un projet             |
| POST    | `/api/projects/:id/members`           | Attribuer un membre à un projet |
| DELETE  | `/api/projects/:id/members/:memberId` | Retirer un membre d’un projet   |

---

### 💬 Forum Interne

| Méthode | Endpoint                      | Description                    |
| ------- | ----------------------------- | ------------------------------ |
| GET     | `/api/forum/topics`           | Lister les sujets du forum     |
| GET     | `/api/forum/topics/:id`       | Détails d’un sujet             |
| POST    | `/api/forum/topics`           | Créer un nouveau sujet         |
| PUT     | `/api/forum/topics/:id`       | Modifier un sujet              |
| DELETE  | `/api/forum/topics/:id`       | Supprimer un sujet             |
| GET     | `/api/forum/topics/:id/posts` | Lister les messages d’un sujet |
| POST    | `/api/forum/topics/:id/posts` | Ajouter un message à un sujet  |
| DELETE  | `/api/forum/posts/:id`        | Supprimer un message           |

---

### 🔔 Bonus

#### 🔄 Renouvellement d'adhésion

| Méthode | Endpoint                    | Description                                   |
| ------- | --------------------------- | --------------------------------------------- |
| POST    | `/api/members/:id/reminder` | Envoyer un rappel de renouvellement           |
| POST    | `/api/members/:id/renew`    | Renouveler l’adhésion (peut inclure paiement) |

#### 📣 Réseaux sociaux

| Méthode | Endpoint                | Description                           |
| ------- | ----------------------- | ------------------------------------- |
| POST    | `/api/events/:id/share` | Partager un événement sur les réseaux |

#### ⭐ Évaluation post-événement

| Méthode | Endpoint                    | Description            |
| ------- | --------------------------- | ---------------------- |
| POST    | `/api/events/:id/feedback`  | Envoyer un retour/avis |
| GET     | `/api/events/:id/feedbacks` | Lister les retours     |
