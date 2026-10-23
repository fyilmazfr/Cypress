# EcoBlissBath - Test Automation

## Contexte du projet
Ce projet a pour objectif d'automatiser les tests d'une application e-commerce (Eco Bliss Bath) en utilisant Cypress.

Dans le cadre de ce projet, j'interviens en tant que QA Engineer afin de :

- analyser les tests manuels existants
- automatiser des scénarios critiques
- vérifier le bon fonctionnement des API

Les scénarios automatisés ont été définis à partir du bilan de tests manuels.

## Prérequis
- Node.js
- Docker

## Installation
Cloner le projet :

```
git clone https://github.com/fyilmazfr/Cypress.git
cd Cypress
```

## Lancer le projet

### Backend (Docker)
```
docker compose up -d
```

### Frontend
```
cd frontend
npm install
npm start
```

Application accessible sur :
http://localhost:4200

## Lancer les tests Cypress
Depuis le dossier frontend :

### Mode interface
```
npx cypress open
```

### Mode headless
```
npx cypress run
```

## Tests automatisés
Les tests couvrent :

### Tests API
- Login avec un utilisateur
- Récupération de la liste des produits
- Récupération du détail d’un produit
- Récupération du panier utilisateur
- Ajout d’un produit au panier
- Ajout d’un avis

### Tests fonctionnels
- Connexion utilisateur
- Ajout d’un produit au panier

### Tests smoke
- Vérification des éléments essentiels (login, affichage, navigation)

### Test de sécurité
- Vérification d’une faille XSS sur les commentaires

## Structure du projet
```
cypress/
  e2e/
    api.cy.js
    connexion.cy.js
    panier.cy.js
    smoke.cy.js
    xss.cy.js
```

## Outils utilisés
- Cypress
- Docker
- JavaScript
