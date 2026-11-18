# ShopLite 🛍️

A modern, frontend-only e-commerce application built with **React Native** and **Expo**, designed specifically to showcase the capabilities of the published npm package [**SkellX**](https://www.npmjs.com/package/skellx) in a real-world mobile app environment.

[![npm package](https://img.shields.io/badge/npm-skellx@1.2.0-CB3837?style=flat&logo=npm)](https://www.npmjs.com/package/skellx)
[![Library GitHub](https://img.shields.io/badge/GitHub-SkellX%20Library-181717?style=flat&logo=github)](https://github.com/Himanshubansal-2008/SkellX)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2058-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88.1-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview & Purpose

**ShopLite** demonstrates how **SkellX** seamlessly enhances mobile user experience by replacing jarring white screens or generic loading spinners with fluid, content-aware skeleton loaders.

Every screen in ShopLite utilizes real components imported directly from the published `skellx` npm package, paired with simulated loading transitions, theme awareness (Light & Dark modes), and customizable animation engines (**Shimmer**, **Pulse**, and **Static**).

---

## 🚀 Key Features

### 🏠 Home Screen
- **ShopLite Branding & Header**: Displays brand logo, cart counter badge, theme toggle, and a 1-tap **SkellX Demo** modal trigger.
- **Search Bar**: Quick-access search input directing users into product discovery.
- **Hero Promotion**: Modern curated seasonal promotional banner.
- **Category Filter Carousel**: Interactive horizontal scroll pills (All, Electronics, Audio, Wearables, Accessories, Home & Office).
- **Featured Gear**: Horizontal product showcase cards.
- **Popular Essentials**: Two-column responsive product card grid with ratings, discount badges, and quick add-to-cart.
- **SkellX Dashboard Loading**: Renders `<DashboardSkeleton />` during screen load or pull-to-refresh.

### 🔍 Product Listing & Search
- **Two-Column Responsive Grid**: Formatted product cards with high-resolution imagery and graceful image error fallback.
- **Live Search & Category Filtering**: Instant filtering across titles, descriptions, and categories.
- **SkellX Grid Loading**: Displays `<GridSkeleton />` during initial load and category switching.
- **SkellX Search Loading**: Displays `<SearchSkeleton />` during search query evaluation.
- **SkellX Empty State Loading**: Visibly displays `<EmptyStateSkeleton />` when no products match search criteria, alongside filter reset controls.

### 📱 Product Details Screen
- **Hero Image Stage**: Large product view with category chip and real-time stock indicator.
- **Pricing & Discounts**: Clear breakdown of original price, sale price, and dollar savings.
- **Ratings & Reviews**: Visual star ratings with verified review counts.
- **Product Highlights**: Bulleted specifications with custom checkmark accents.
- **Quantity Selector**: Local frontend counter with stock limit validation.
- **Interactive Bottom Bar**: Dynamic price calculation (`price * quantity`) with animated "Add to Cart" confirmation and badge count updates.
- **SkellX Card Loading**: Renders `<CardSkeleton />` and `<ProductSkeleton />` placeholders on navigation.

### 🎛️ SkellX Interactive Playground & Demo
- **Animation Selector**: Real-time switching between:
  - ✨ **Shimmer**: Moving highlight gradient wave.
  - 💓 **Pulse**: Gentle breathing opacity cycle.
  - ⏹️ **Static**: Elegant non-animated placeholder tone.
- **Theme Provider**: Seamless Light ☀️ and Dark 🌙 theme switching powered by SkellX's `<SkeletonThemeProvider>`.
- **Manual Loading Simulator**: One-click reload button to test skeleton states on demand.
- **Quick-Access Toolbar**: Instant animation mode buttons pinned directly on each screen.

---

## 📦 SkellX Library Integration

The app installs and imports **SkellX** directly from npm:

```bash
npm install skellx
```

### Imported Components

```javascript
import {
  DashboardSkeleton,
  ProductSkeleton,
  GridSkeleton,
  SearchSkeleton,
  CardSkeleton,
  EmptyStateSkeleton,
  SkeletonThemeProvider,
} from 'skellx';
```

### Component Mapping in ShopLite

| Screen / Area | SkellX Component | Props Passed | Real-World Role |
| :--- | :--- | :--- | :--- |
| **Theme System** | `<SkeletonThemeProvider>` | `theme="light" \| "dark"` | Automatically passes theme palette to all nested skeletons |
| **Home Screen** | `<DashboardSkeleton>` | `stats={4}`, `activities={3}`, `showChart={true}`, `animation={animationMode}` | Replaces home dashboard while promotional data loads |
| **Product Grid** | `<GridSkeleton>` | `count={6}`, `columns={2}`, `itemHeight={140}`, `showText={true}`, `animation={animationMode}` | Displays 2-column grid placeholders during catalog browsing |
| **Search Results** | `<SearchSkeleton>` | `results={4}`, `showThumbnail={true}`, `animation={animationMode}` | Displays item row placeholders during search queries |
| **Product Details** | `<CardSkeleton>` | `imageHeight={280}`, `lines={4}`, `spacing={14}`, `animation={animationMode}` | Skeleton layout for product details and spec sheet |
| **Empty State** | `<EmptyStateSkeleton>` | `illustrationSize={100}`, `descriptionLines={2}`, `animation={animationMode}` | Placeholder state when search query returns 0 matches |

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (Expo SDK 58)
- **Language**: JavaScript (Clean ES6+, no TypeScript)
- **Navigation**: [React Navigation 7](https://reactnavigation.org/) (`@react-navigation/native-stack`)
- **Skeleton Library**: [SkellX](https://www.npmjs.com/package/skellx) (`v1.2.0`)
- **Icons**: `@expo/vector-icons` (Ionicons)
- **Styling**: React Native `StyleSheet` with shared Design Token theme

---

## 📂 Project Structure

```text
ShopLite/
├── assets/
│   ├── images/
│   ├── adaptive-icon.png
│   ├── icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── src/
│   ├── components/
│   │   ├── CategoryList.js       # Horizontal category selector
│   │   ├── Header.js             # Themed header with brand & SkellX trigger
│   │   ├── ProductCard.js        # Reusable product card with image fallback
│   │   ├── SearchBar.js          # Interactive search input
│   │   └── SkellXDemoModal.js    # Interactive playground modal for SkellX
│   ├── context/
│   │   └── ThemeContext.js       # Global theme & SkellX animation state
│   ├── data/
│   │   └── products.js           # Mock e-commerce product catalog
│   ├── navigation/
│   │   └── AppNavigator.js       # Native stack navigation configuration
│   ├── screens/
│   │   ├── HomeScreen.js         # Main home & featured products screen
│   │   ├── ProductListingScreen.js # Two-column catalog & search screen
│   │   └── ProductDetailsScreen.js # Product details, specs & cart screen
│   └── styles/
│       └── theme.js              # Color palettes, spacing & typography
├── App.js                        # App entry point with safe-area & providers
├── app.json                      # Expo application manifest
├── package.json                  # Dependencies & scripts
└── README.md                     # Project documentation
```

---

## 💻 Installation & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app installed on your physical device (iOS / Android) or a simulator/emulator

### 1. Clone the repository
```bash
git clone https://github.com/Himanshubansal-2008/ShopLite.git
cd ShopLite
```

### 2. Install dependencies
```bash
npm install
```

### 3. Verify SkellX installation
Confirm that `skellx` is installed from npm:
```bash
npm list skellx
```

### 4. Start the application
```bash
npm start
```
or run directly for your preferred platform:
```bash
# For iOS Simulator
npm run ios

# For Android Emulator
npm run android

# For Web preview
npm run web
```

Scan the QR code with your phone camera (iOS) or Expo Go app (Android).

---

## 🔗 External Links

- **SkellX on npm**: [https://www.npmjs.com/package/skellx](https://www.npmjs.com/package/skellx)
- **SkellX GitHub Repository**: [https://github.com/Himanshubansal-2008/SkellX](https://github.com/Himanshubansal-2008/SkellX)
- **ShopLite GitHub Repository**: [https://github.com/Himanshubansal-2008/ShopLite](https://github.com/Himanshubansal-2008/ShopLite)

---

## 📄 License

This project is licensed under the MIT License.
