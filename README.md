
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
