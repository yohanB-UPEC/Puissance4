
# Projet Puissance 4

Ce projet est une application web de puissance4. Il utilise TypeScript, Express.js, Prisma pour le backend, et TypeScript, React.js, Material-UI pour le frontend.

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone https://github.com/yohanB-UPEC/Puissance4.git
    ```

2. Installez les dépendances du backend :

    ```bash
    cd server
    npm install
    ```

3. Installez les dépendances du frontend :

    ```bash
    cd client
    npm install
    ```

## Configuration

Assurez-vous de configurer correctement la connexion à votre base de données dans le fichier `server/.env`.
Le fichier doit contenir ceci:
```
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<database>?schema=public"
ACCESS_TOKEN_SECRET="5d7c082bf097bdcc719823d27f06da1640dd26fb5c28906d6d4716ee32c489ef659356285aff0c28a5b08b8c8476ff823aa010780f60b109abe93b0fdd4e7703"
REFRESH_TOKEN_SECRET="8931e880ddc70739e5dd23ac06a6546e7006ec4407e925e1562ad80723981261a93d33ffb1bfc24d2fbd251a807420c9b1fb962fc8c1e292d4929dd93a605fe6"
```

Une fois la connexion à la base de données configuré, lancer cette commande pour créer les tables:
```bash
npx prisma migrate dev
```

## Utilisation

1. Démarrez le backend. Vous devez obligatoirement démarrer le backend en premier pour qu'il puisse réserver le port 3000:

    ```bash
    cd server
    npm start
    ```

    Le serveur démarrera à l'adresse [http://localhost:3000](http://localhost:3000).

2. Démarrez le frontend :

    ```bash
    cd client
    npm start
    ```

    Le frontend démarrera et ouvrira automatiquement votre navigateur par défaut sur [http://localhost:3001](http://localhost:3001).

## Structure du projet

- `server`: Contient le backend de l'application, développé avec TypeScript, Express.js et Prisma.
- `client`: Contient le frontend de l'application, développé avec TypeScript, React.js et Material-UI.

## Auteur

Yohan Bordes
