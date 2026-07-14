# Guide Technique - Booksnap

> Documentation technique complète : démarrage, développement local et architecture Docker.

---

## Table des Matières

1. [Démarrage Rapide](#1-démarrage-rapide)
   - [Prérequis](#prérequis)
   - [Lancer l'application (Production)](#lancer-lapplication-production)
   - [URLs des services](#urls-des-services)

2. [Développement Local](#2-développement-local)
   - [Dois-je utiliser Docker ?](#dois-je-utiliser-docker-en-développement-)
   - [Workflow recommandé (Hybride)](#workflow-recommandé--hybride)
   - [Option 1 : DB Docker + Code Local](#option-1--db-docker--code-local-recommandé)
   - [Option 2 : Tout en Docker](#option-2--tout-en-docker-simulation-production)
   - [Configuration IDE](#configuration-ide)

3. [Architecture Docker](#3-architecture-docker)
   - [Structure des fichiers](#structure-des-fichiers)
   - [Relation entre les fichiers](#relation-entre-les-fichiers)
   - [Flux de construction](#flux-de-construction)
   - [Orchestration (docker-compose)](#orchestration-docker-compose)
   - [Communication entre services](#communication-entre-services)

4. [Choix Techniques](#4-choix-techniques)
   - [Pourquoi Vite ?](#pourquoi-vite-)
   - [Pourquoi Nginx ?](#pourquoi-nginx-)

5. [Référence des Commandes](#5-référence-des-commandes)
   - [Commandes Docker](#commandes-docker)
   - [Commandes Backend (Maven)](#commandes-backend-maven)
   - [Commandes Frontend (Vite)](#commandes-frontend-vite)

---

## 1. Démarrage Rapide

### Prérequis

| Outil | Version | Requis pour |
|-------|---------|-------------|
| Docker | 20+ | Production / DB locale |
| Docker Compose | 2.0+ | Orchestration services |
| Java | 17+ | Développement backend |
| Maven | 3.9+ | Build backend |
| Node.js | 20+ | Développement frontend |

### Lancer l'application (Production)

```bash
# 1. Cloner le projet
git clone <repo-url>
cd booksnap

# 2. Copier la configuration
cp .env.example .env

# 3. Lancer tous les services
docker compose up --build

# L'application est prête !
```

### URLs des services

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interface utilisateur |
| **Backend API** | http://localhost:8080 | API REST Spring Boot |
| **pgAdmin** | http://localhost:5050 | Interface base de données |

---

## 2. Développement Local

### Workflow Recommandé : Hybride

```
┌─────────────────────────────────────────────────────────────────┐
│                   DÉVELOPPEMENT QUOTIDIEN                        │
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│   │  PostgreSQL │     │   Backend   │     │  Frontend   │      │
│   │   (Docker)  │◄────│   (Local)   │◄────│   (Local)   │      │
│   │   :5432     │     │   :8080     │     │   :3000     │      │
│   └─────────────┘     └─────────────┘     └─────────────┘      │
│         ▲                   ▲                   ▲               │
│         │                   │                   │               │
│   docker compose       mvn spring-boot:run   npm run dev       │
│   up db                    ou IDE              (Vite)          │
└─────────────────────────────────────────────────────────────────┘
```

**Avantage** : Base de données isolée + Hot Reload complet pour le code

---

### Option 1 : DB Docker + Code Local (Recommandé)

#### Terminal 1 - Base de données
```bash
# Lancer PostgreSQL + pgAdmin
docker compose up db pgadmin
```

#### Terminal 2 - Backend

Lancer depuis **IntelliJ IDEA** (voir [Configuration IDE](#configuration-ide)) ou en ligne de commande :

```bash
cd server
mvn spring-boot:run
```

> **Note** : Les variables d'environnement (`DB_HOST`, `POSTGRES_USER`, etc.) doivent être configurées dans votre IDE ou exportées dans le terminal. Voir la section [Configuration IDE](#configuration-ide).

#### Terminal 3 - Frontend
```bash
cd web

# Installer les dépendances (première fois)
npm install

# Lancer avec Hot Reload
npm run dev

# Ouvrir http://localhost:3000
```

#### Avantages de cette approche
- DB isolée et réinitialisable (`docker compose down -v`)
- Scripts SQL auto-exécutés (schema, dewey, seed)
- pgAdmin disponible pour debug
- Hot Reload complet (frontend ET backend)

---

### Option 2 : Tout en Docker (Simulation Production)

```bash
# Construire et lancer tous les services
docker compose up --build
```

#### Quand utiliser cette option ?
- Tester l'intégration complète avant un commit
- Vérifier que les Dockerfiles fonctionnent
- Démonstration à un collègue/recruteur
- Debug d'un problème spécifique à Docker

---

### Comparaison des Approches

| Critère | DB Docker + Code Local | Tout Docker |
|---------|------------------------|-------------|
| **Vitesse itération** | Rapide | Lente |
| **Hot Reload** | Complet | Limité |
| **Proche production** | Moyen | Excellent |
| **Setup initial** | Simple | Très simple |
| **Reset DB** | `down -v && up` | `down -v && up` |

---

### Résumé : Quel Workflow Choisir ?

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   Développement quotidien ?                                     │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────┐                                              │
│   │ docker       │ + IDE pour backend + npm run dev             │
│   │ compose up db│                                              │
│   └──────────────┘                                              │
│                                                                 │
│   Tester avant commit ?                                         │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                      │
│   │ docker compose up    │  Vérifie que tout fonctionne         │
│   │ --build              │  ensemble comme en production        │
│   └──────────────────────┘                                      │
│                                                                 │
│   Démo / Production ?                                           │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────────────┐                                      │
│   │ docker compose up    │  One-liner pour lancer l'application           │
│   └──────────────────────┘                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Configuration IDE

#### IntelliJ IDEA (Backend)

1. Ouvrir le dossier `server/` comme projet Maven
2. Configurer les variables d'environnement :
   ```
   DB_HOST=localhost
   DB_PORT=5432
   POSTGRES_USER=booksnap
   POSTGRES_PASSWORD=changeme
   POSTGRES_DB=booksnap_db
   ```
3. Lancer `BooksnapApplication.java` avec le bouton Run

#### VS Code (Frontend)

1. Ouvrir le dossier `web/`
2. Installer l'extension "Lit Plugin"
3. Terminal intégré : `npm run dev`

---

## 3. Architecture Docker

### Structure des fichiers

```
booksnap/
├── docker-compose.yml      # Orchestrateur des services
├── .env.example            # Template des variables d'environnement
├── server/
│   ├── Dockerfile          # Build backend (Maven → JAR → JRE)
│   └── sql/                # Scripts d'initialisation DB
│       ├── schema.sql      # Structure des tables
│       ├── dewey.sql       # Classification Dewey
│       └── seed.sql        # Données initiales
└── web/
    ├── Dockerfile          # Build frontend (npm → Vite → Nginx)
    └── nginx.conf          # Configuration serveur web
```

### Relation entre les fichiers

| Fichier | Responsabilité |
|---------|----------------|
| `server/Dockerfile` | **Comment** construire l'image backend |
| `web/Dockerfile` | **Comment** construire l'image frontend |
| `docker-compose.yml` | **Comment** exécuter tout ensemble |

#### docker-compose.yml référence les Dockerfiles

```yaml
backend:
  build:
    context: ./server          # Pointe vers server/
    dockerfile: Dockerfile     # Utilise server/Dockerfile

frontend:
  build:
    context: ./web             # Pointe vers web/
    dockerfile: Dockerfile     # Utilise web/Dockerfile
    args:
      VITE_API_BASE_URL: ...   # Argument de build
```

---

### Flux de construction

```
                    docker compose up --build
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │  server/Dockerfile  │         │   web/Dockerfile    │
    ├─────────────────────┤         ├─────────────────────┤
    │ Stage 1: Maven      │         │ Stage 1: Node       │
    │  - pom.xml          │         │  - npm install      │
    │  - mvn package      │         │  - vite build       │
    ├─────────────────────┤         ├─────────────────────┤
    │ Stage 2: JRE        │         │ Stage 2: Nginx      │
    │  - Copie JAR        │         │  - Copie dist/      │
    │  - Lance l'app      │         │  - Sert les assets  │
    └─────────────────────┘         └─────────────────────┘
              │                               │
              ▼                               ▼
    ┌─────────────────────┐         ┌─────────────────────┐
    │  booksnap-backend   │         │  booksnap-frontend  │
    │     container       │         │     container       │
    └─────────────────────┘         └─────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                   ┌─────────────────────┐
                   │  booksnap-network   │
                   │   (réseau partagé)  │
                   └─────────────────────┘
```

---

### Orchestration (docker-compose)

Ce que docker-compose.yml ajoute aux Dockerfiles :

| Fonctionnalité | Description |
|----------------|-------------|
| **Réseau** | Crée `booksnap-network` pour la communication |
| **Variables** | Injecte `DB_HOST`, `POSTGRES_PASSWORD` depuis `.env` |
| **Arguments build** | Passe `VITE_API_BASE_URL` au frontend |
| **Dépendances** | `depends_on` : attend que la DB soit prête |
| **Health checks** | Vérifie que chaque service répond |
| **Volumes** | Monte les scripts SQL pour init DB |

#### Comparaison Dockerfile vs docker-compose

| Aspect | Dockerfile | docker-compose.yml |
|--------|------------|-------------------|
| **Portée** | Une seule image | Plusieurs services |
| **Build** | Définit les étapes | Déclenche les builds |
| **Runtime** | CMD par défaut | Env, ports, volumes |
| **Réseau** | Aucun | Réseau partagé |
| **Secrets** | Non | Lit depuis `.env` |

---

### Communication entre services

```
┌──────────────────────────────────────────────────────────┐
│                    booksnap-network                       │
│                                                          │
│   ┌────────┐       ┌─────────┐       ┌──────────────┐   │
│   │   db   │◄──────│ backend │◄──────│   frontend   │   │
│   │ :5432  │       │  :8080  │       │ (via browser)│   │
│   └────────┘       └─────────┘       └──────────────┘   │
│                                                          │
│   Les conteneurs utilisent les noms de service          │
│   (db, backend) comme noms d'hôte                       │
└──────────────────────────────────────────────────────────┘
```

#### Injection des variables

**Backend (connexion DB)** :
```
docker-compose.yml              →     application.properties
───────────────────                   ──────────────────────
environment:                          spring.datasource.url=
  DB_HOST: db                    →      jdbc:postgresql://${DB_HOST}:${DB_PORT}
  DB_PORT: 5432
```

**Frontend (URL API)** :
```
docker-compose.yml              →     web/Dockerfile
───────────────────                   ──────────────
args:                                 ARG VITE_API_BASE_URL
  VITE_API_BASE_URL: http://...  →   RUN npm run build  # URL intégrée
```

---

## 4. Choix Techniques

### Pourquoi Vite ?

#### Le problème sans bundler

| Problème | Impact |
|----------|--------|
| Centaines de requêtes HTTP | Chaque `import` = une requête |
| Pas de minification | Fichiers volumineux |
| Pas de tree-shaking | Code mort inclus |
| Variables d'environnement | Impossible à injecter |

#### Avantages de Vite

| Avantage | Description |
|----------|-------------|
| **Rapidité** | esbuild (Go) - 10-100x plus rapide que Webpack |
| **Hot Module Replacement** | Modifications instantanées |
| **ESM natif** | Pas de bundling en dev |
| **Configuration minimale** | Fonctionne out-of-the-box |
| **Tree-shaking** | Élimine le code non utilisé |
| **Variables d'environnement** | `import.meta.env.VITE_*` |

#### Commandes Vite

| Commande | Quand l'utiliser |
|----------|------------------|
| `npm run dev` | Développement quotidien (HMR) |
| `npm run build` | Génère `dist/` pour production |
| `npm run preview` | Teste le build localement |

#### Quand exécuter `npm run build` ?

- Avant de déployer en production
- Dans le Dockerfile (automatique)
- Pour tester la version production
- Dans la CI/CD

#### Flux développement → production

```
┌─────────────────────────────────────────────────────────────┐
│                     DÉVELOPPEMENT                            │
│   npm run dev  →  Vite Dev Server (HMR, localhost:3000)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCTION                               │
│   npm run build  →  dist/  →  Nginx (localhost:80)          │
└─────────────────────────────────────────────────────────────┘
```

---

### Pourquoi Nginx ?

#### Besoins d'une SPA en production

| Besoin | Raison |
|--------|--------|
| Fichiers statiques | HTML, JS, CSS, images |
| SPA Fallback | Routes → `index.html` |
| Compression | Réduire les transferts |
| Cache headers | Performance |
| Sécurité | Headers XSS, clickjacking |

#### Avantages de Nginx

| Avantage | Description |
|----------|-------------|
| **Ultra-léger** | Image Alpine ~25 MB |
| **Haute performance** | Milliers de connexions |
| **Compression native** | gzip intégré |
| **Cache intégré** | Headers configurables |
| **Battle-tested** | Utilisé partout |

#### Configuration SPA (nginx.conf)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;

    # SPA Fallback - toutes routes → index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache 1 an pour assets hashés
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Pas de cache pour index.html
    location = /index.html {
        add_header Cache-Control "no-cache";
    }

    gzip on;
}
```

---

## 5. Référence des Commandes

### Commandes Docker

```bash
# === DÉMARRAGE ===

# Lancer tous les services
docker compose up --build

# Lancer seulement la DB (dev)
docker compose up db

# Lancer DB + pgAdmin
docker compose up db pgadmin

# === GESTION ===

# Voir les logs
docker compose logs -f backend

# Reconstruire un service
docker compose up --build frontend

# Arrêter tous les services
docker compose down

# Reset complet (supprime les données)
docker compose down -v

# État des services
docker compose ps
```

### Commandes Backend (Maven)

```bash
cd server

# Lancer l'application
mvn spring-boot:run

# Avec un profil spécifique
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Lancer les tests
mvn test

# Build sans tests
mvn clean package -DskipTests

# Vérifier les dépendances
mvn dependency:tree
```

### Commandes Frontend (Vite)

```bash
cd web

# Installer les dépendances
npm install

# Développement (Hot Reload)
npm run dev
# → http://localhost:3000

# Build production
npm run build
# → Génère dist/

# Prévisualiser le build
npm run preview
# → http://localhost:4173

# Linter
npm run lint
```

### Cheatsheet Rapide

```bash
# DEV QUOTIDIEN
docker compose up db          # Terminal 1
mvn spring-boot:run           # Terminal 2 (server/)
npm run dev                   # Terminal 3 (web/)

# TEST INTÉGRATION
docker compose up --build

# RESET DB
docker compose down -v && docker compose up db

# LOGS
docker compose logs -f backend
docker compose logs -f frontend
```

---

**Dernière mise à jour** : 2026-07-14
