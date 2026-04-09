# 📖 Thirukkural AI Platform - Technical Documentation

## 🚀 Overview
The **Thirukkural AI Platform** is a premium, scholarly-grade web application designed for deep exploration of the *Tirukkural*. It combines modern **Neural Semantic Search** with a high-fidelity **Hierarchical Library** and comprehensive scholar commentaries.

---

## 🛠️ Technology Stack
- **Frontend Framework**: React 18+ (Vite-powered).
- **AI Engine**: `Transformers.js` (Neural Semantic Search) + Local Lexical Matching.
- **Animations**: `Framer Motion` (Smooth transitions, Modals).
- **Icons**: `Lucide React`.
- **Styling**: Vanilla CSS with Modern UI principles (Glassmorphism, Radial Gradients).
- **Data Source**: `thirukkural.json` (1,330 Verses).

---

## 🏛️ Core Features

### 1. 🧠 AI Specialist (Neural Chat)
- **Neural Engine**: Uses `KuralAI` class to perform hybrid semantic search.
- **Natural Processing**: Users can ask themed questions (e.g., "Tell me about friendship") and get contextually relevant verses.
- **Scholarly Citations**: Every AI response includes direct "Source" links to the kurals used for the answer.

### 2. 📚 Hierarchical Library
- **Three-Tier Browsing**:
  1. **Paal**: Arathuppaal (Virtue), Porulpaal (Wealth), Kamathuppaal (Love).
  2. **Athigaram**: Categorized view of the 133 Chapters.
  3. **Kural**: Direct access to the 1,330 verses.
- **Premium Cards**: 3-column grid layout with decorative card flourishes.

### 3. 🔍 Deep Insight Modal
- **One-Click Detail**: Clicking any Kural opens a full-screen cinematic modal.
- **Comparative Commentary**: Includes three distinct Tamil commentaries + English:
  - **Mu. Varatharajan (Mu.Va)**: Simplistic and deep.
  - **M. Karunanidhi (Kalaignar)**: Literary and sharp.
  - **Solomon Papayya**: Modern and relatable.
  - **English Translation**: For global accessibility.

### 📜 Scholarly History
- High-impact storytelling page with the life history of **Thiruvalluvar**.
- Statistical breakdown (1,330 Kurals, 133 Chapters, 3 Paals).

---

## 🎨 Design System

### 💎 Aesthetics
- **Typography**: `Outfit` (Headings) & `Noto Sans Tamil` (Verses). Large 2.8rem font for primary verses.
- **Theme**: Premium Dark-Radial (`radial-gradient(#d1d5db 0.8px, transparent 0.8px)`).
- **Glassmorphism**: `backdrop-filter: blur(20px)` on headers and cards.

### 📐 Breakpoints & Layout
- **Desktop (1024px+)**: 3-column grid for Library, 70% bounded chat bubbles.
- **Mobile (<768px)**: Optimized vertical stack, resized typography for touch readability.

---

## ⚠️ Critical Fixes & "Gotchas" (For Future Context)

### 1. 📂 Scroll-Lock Fix (Modal)
- **Issue**: Internal modal content wouldn't scroll.
- **Solution**: Defined `.modal-body-content` as a Flex container with `min-height: 0` and `overflow: hidden`. The child `.explanations-scroller` was given `overflow-y: auto`. This is critical for nested flex-scrollers.

### 2. 🏎️ Performance (VisibleCount)
- Prevents UI lag by using `visibleCount` (starting at 50) and memoized filtering. The `filteredKurals` hook only recalculates when Search or Category changes.

### 3. 🌐 Neural Progress
- The `window.onNeuralProgress` hook connects the library's initialization progress to the `isInitializing` state in `App.jsx`, ensuring a smooth splash screen experience.

---

## 📁 Repository Structure
- `/public/thirukkural.json`: The core dataset.
- `/src/App.jsx`: Main UI logic, Routing, and Components.
- `/src/ai-engine.js`: Hybrid Search logic and Transformers.js implementation.
- `index.html`: Optimized viewport and PWA boilerplate.

---

> [!NOTE]
> This platform is designed as an **Offline-First App**. All AI processing for the search engine happens locally in the browser using the Neural Engine.
