# AgroMarket Tchad - Application de Suivi des Prix Agricoles

Une application web moderne pour le suivi des prix des produits agricoles au Tchad, avec des fonctionnalités avancées d'analyse, de comparaison et de prédiction.

## 🚀 Fonctionnalités Principales

### 📊 Tableau de Bord
- Vue d'ensemble des statistiques du marché
- Carrousel de publicités interactif
- Prix des produits clés
- Recommandations de marchés optimaux

### 💰 Prix du Marché
- Consultation des prix en temps réel
- Filtrage avancé par région et produit
- Recherche intelligente
- Pagination optimisée
- Export Excel intégré

### 📈 Comparaison de Prix
- Comparaison entre différents marchés
- Graphiques interactifs
- Analyse des tendances

### 🔮 Prédictions de Tendances
- Algorithmes de prédiction de prix
- Visualisations de données avancées
- Recommandations basées sur l'IA

### 📋 Analyses de Marché
- Rapports détaillés
- Insights du marché
- Données historiques

## 🛠️ Technologies Utilisées

### Frontend
- **React 18.3.1** - Bibliothèque UI moderne
- **TypeScript** - Typage statique pour une meilleure fiabilité
- **Material-UI (MUI) 6.x** - Composants UI modernes et accessibles
- **React Router DOM 6.x** - Navigation côté client
- **Vite** - Build tool rapide et moderne

### Styling & UI
- **Material-UI Theme** - Système de design cohérent
- **Inter Font** - Typographie moderne
- **Responsive Design** - Compatible mobile, tablette et desktop

### Fonctionnalités Avancées
- **React Chart.js 2** - Graphiques interactifs
- **XLSX** - Export Excel
- **React Toastify** - Notifications utilisateur
- **Lazy Loading** - Optimisation des performances
- **Error Boundaries** - Gestion d'erreurs robuste

### API & Données
- **Axios** - Client HTTP pour les appels API
- **API REST** - https://agroapi-qwvb.onrender.com/api/

## 🎨 Design System

### Palette de Couleurs
- **Primaire**: Deep Green (#2E7D32) - Évoque l'agriculture et la nature
- **Secondaire**: Warm Orange (#FF6F00) - Accents chaleureux
- **Arrière-plan**: Light Gray (#FAFAFA) - Fond épuré
- **Texte**: Dark Gray (#212121) - Lisibilité optimale

### Typographie
- **Police**: Inter - Police moderne et lisible
- **Hiérarchie**: 6 niveaux de titres bien définis
- **Espacement**: Système d'espacement cohérent

### Composants
- **Cards**: Bordures arrondies (16px), ombres subtiles
- **Boutons**: Coins arrondis (8px), animations de hover
- **Formulaires**: Focus states bien définis
- **Navigation**: Responsive avec animations fluides

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 600px
- **Tablette**: 600px - 900px
- **Desktop**: > 900px

### Adaptations
- Navigation mobile avec drawer
- Tables avec scroll horizontal
- Cartes empilées sur mobile
- Boutons adaptés au tactile

## ♿ Accessibilité

### Fonctionnalités Implémentées
- **ARIA Labels** - Tous les éléments interactifs
- **Navigation Clavier** - Support complet
- **Contrastes** - Conformes WCAG 2.1 AA
- **Screen Readers** - Optimisé pour les lecteurs d'écran
- **Focus Management** - Gestion appropriée du focus

### Standards Respectés
- WCAG 2.1 Level AA
- Section 508
- Keyboard Navigation
- Color Contrast Ratio > 4.5:1

## 🚀 Performance

### Optimisations Implémentées
- **Code Splitting** - Chargement lazy des routes
- **Tree Shaking** - Élimination du code mort
- **Bundle Optimization** - Chunks optimisés
- **Image Optimization** - Formats modernes
- **Caching** - Stratégies de cache intelligentes

### Métriques Cibles
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## 🔧 Installation et Lancement

### Prérequis
- Node.js 16+ 
- npm 7+ ou yarn 1.22+

### Installation
```bash
# Cloner le repository
git clone https://github.com/supervaiki/agromarket.git
cd agromarket

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

### Variables d'Environnement
```env
VITE_API_BASE_URL=https://agroapi-qwvb.onrender.com/api/
```

### Scripts Disponibles
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Linting du code

## 📁 Structure du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── AdSlider.tsx     # Carrousel de publicités
│   ├── ErrorBoundary.tsx # Gestion d'erreurs
│   ├── Footer.tsx       # Pied de page
│   └── Navbar.tsx       # Navigation
├── pages/               # Pages de l'application
│   ├── Dashboard.tsx    # Tableau de bord
│   ├── MarketPrices.tsx # Prix du marché
│   ├── PriceComparison.tsx
│   ├── TrendPrediction.tsx
│   └── MarketAnalysis.tsx
├── hooks/               # Hooks personnalisés
│   └── index.ts        # Hooks utilitaires
├── types/               # Définitions TypeScript
│   └── types.ts        # Types de données
├── theme/               # Configuration du thème
│   └── theme.ts        # Thème Material-UI
├── api/                 # Logique API
│   └── api.ts          # Fonctions d'appel API
├── App.tsx             # Composant principal
└── main.tsx            # Point d'entrée
```

## 🔗 API Endpoints

### Base URL
`https://agroapi-qwvb.onrender.com/api/`

### Endpoints Principaux
- `GET /market-prices/` - Prix du marché
- `GET /products/` - Liste des produits
- `GET /regions/` - Liste des régions
- `GET /dashboard-stats/` - Statistiques du tableau de bord
- `GET /market-insights/` - Insights du marché
- `GET /ads/` - Publicités

### Filtrage
- `GET /market-prices/?region=<id>` - Par région
- `GET /market-prices/?products=<ids>` - Par produits
- `GET /market-prices/?start_date=<date>&end_date=<date>` - Par période

## 🧪 Tests et Qualité

### Linting
- ESLint avec configuration moderne
- TypeScript strict mode
- Prettier pour le formatage

### Bonnes Pratiques
- Composants fonctionnels avec hooks
- Séparation logique/présentation
- Gestion d'état locale appropriée
- Error boundaries pour la robustesse

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Optimisations de Build
- Minification automatique
- Compression gzip
- Code splitting
- Asset optimization

### Hébergement Recommandé
- Vercel (configuration automatique)
- Netlify (drag & drop)
- AWS S3 + CloudFront
- GitHub Pages

## 🤝 Contribution

### Standards de Code
- TypeScript strict
- ESLint + Prettier
- Commit messages conventionnels
- Documentation des composants

### Workflow
1. Fork du repository
2. Création d'une branche feature
3. Développement avec tests
4. Pull request avec description

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Développeur

**Djongnabe Gueyake Beni**
- Email: contact@agromarket-tchad.com
- GitHub: [@supervaiki](https://github.com/supervaiki)

---

## 🔄 Évolutions Futures

### Fonctionnalités Prévues
- [ ] Mode sombre/clair
- [ ] Notifications push
- [ ] Cartes géographiques interactives
- [ ] Export PDF amélioré
- [ ] API GraphQL
- [ ] Application mobile
- [ ] Mode hors ligne (PWA)

### Améliorations Techniques
- [ ] Tests unitaires (Jest + React Testing Library)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Analytics (Google Analytics)

---

**Version**: 2.0.0  
**Dernière mise à jour**: Janvier 2025