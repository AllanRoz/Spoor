# 🐾 SPOOR — A Mystery Animal Tracking Game

> **Follow the clues. Find the animal. 100% playable offline on Apple and Android.**

**SPOOR** is a complete, production-ready mystery animal tracking web game built with React, Vite, Tailwind CSS, Lucide React, and React Router.

Players investigate realistic animal spoor (footprints), natural habitats, physical dimensions, and feeding habits to deduce unknown creatures from across the globe.

![SPOOR](screenshots/spoor.png)

---

## 📱 Offline Progressive Web App (PWA) Support

SPOOR includes full offline PWA capabilities engineered specifically for **Apple devices (iPhone & iPad)** and **Android devices**:

- **⚡ 100% Offline Gameplay**:
  - The custom Service Worker (`sw.js`) pre-caches the complete game shell, datasets, and procedurally generated vector footprints.
  - The game is fully playable deep in the wild, in flight / airplane mode, or with zero cellular connection.
- **🍎 Apple iOS / iPadOS Optimizations**:
  - Native standalone display mode without Safari browser chrome.
  - High-resolution Apple Touch Icons (180x180, 152x152, 167x167) for crisp homescreen appearance.
  - Viewport-fit cover with notch and Dynamic Island safe-area padding.
  - Built-in step-by-step **"Install on iPhone & iPad"** guide modal (Tap Share 📤 ➔ "Add to Home Screen" ➕ ➔ "Add").
  - iOS AudioContext auto-unlock on first user tap.
- **🤖 Android Optimizations**:
  - Full W3C Web App Manifest (`manifest.webmanifest`) with standalone display mode.
  - Maskable adaptive icons (192x192 and 512x512) conforming to Android launcher safe zones.
  - One-tap native install prompt trigger.
- **📲 Mobile Bottom Navigation Bar**:
  - Fixed translucent bottom navigation bar with thumb-reach access to Home, Play, Daily, Field Guide, and Stats.
- **📳 Tactile Haptic Feedback**:
  - Subtle physical vibration taps on phones for clue reveals, wrong guesses, victory fanfares, and button interactions (can be toggled in Settings).

---

## 🎮 Game Features

- **🐾 Authentic Spoor Visualizer with Scale Perspective Tool**:
  - Procedurally rendered vector footprints with real scale dimensions in centimeters and inches.
  - **Interactive Scale Perspective Toggle**: Compare tracks directly against a **Human Hand (19 cm)**, a **Hiking Boot (26 cm)**, or a **Coin (2.5 cm)** to visualize track scale in real life!
- **🔍 Progressive Clue Reveal System**:
  - Clue 1: 🐾 Footprint (spoor visualizer + scale ruler + perspective overlay)
  - Clue 2: 🌎 Habitat & Geographic Range (ecosystem and distribution)
  - Clue 3: 📏 Physical Dimensions (weight, body length, height/wingspan)
  - Clue 4: 🍖 Diet & Feeding Behavior (carnivore, herbivore, omnivore)
  - Clue 5: 🖼️ Animal Sighting (wildlife photograph with offline fallback)
- **💡 Tracker's Field Intuition (Hint System)**:
  - Stuck on a track? Use Tracker's Intuition to reveal first letter and biological fun facts for a small 5-point deduction.
- **🧠 Intelligent Answer Matching & Spelling Assistance**:
  - Normalizes accents, casing, punctuation, and leading articles.
  - Recognizes common aliases (e.g. *wolf*, *grey wolf*, *gray wolf*).
  - Fuzzy misspelling detector catches typos (e.g. *"elefant"* -> *"Did you mean Elephant?"*) with a 25% score adjustment upon confirmation.
- **🔥 Dynamic Scoring & Streak System**:
  - 100 points for guessing after Clue 1 down to 20 points after Clue 5.
  - Tracks active Spoor Streaks and personal best records.
- **🌎 Deterministic Daily Spoor + Past Archive Player**:
  - A new mystery animal every single calendar day synchronized worldwide.
  - **Daily Spoor Archive**: Solved today's puzzle? Browse and play through past daily puzzles from the last 14 days!
  - Generates spoiler-free emoji share text (e.g. `🐾 🟩 🌎 🟩`).
- **📖 My Field Guide (Collection)**:
  - Personal compendium tracking discovered species out of 107 animals.
  - Filter by **Discovery Status** (All, Discovered, Undiscovered), Category, or Habitat.
  - **Study Random Animal**: One-tap quick review of any discovered species.
- **📊 Comprehensive Statistics**:
  - Tracks total animals identified, win rate, accuracy %, average clues used, average attempts, perfect games, and category breakdowns.
- **☀️ Daylight / 🌙 Night Guide Themes**:
  - Natural wildlife field journal aesthetic with full dark mode support.
- **🔊 Web Audio Synthesizer**:
  - Zero-latency sound effects generated in-browser using the Web Audio API (no broken audio links, works offline).

---

## 🐘 Animal Dataset (107 Species)

The dataset in `src/data/` includes 107 verified species across 6 categories:
- **Mammals (51)**: African Bush Elephant, Gray Wolf, African Lion, Grizzly Bear, Bengal Tiger, Red Fox, Moose, Cheetah, Polar Bear, Red Kangaroo, Plains Zebra, Hippopotamus, Giraffe, American Bison, Giant Panda, Black Rhinoceros, Western Lowland Gorilla, Chimpanzee, Snow Leopard, Capybara, Wolverine, Honey Badger, Platypus, Jaguar, Koala, Ring-tailed Lemur, Beaver, Spotted Hyena, Meerkat, Walrus, Armadillo, Sea Otter, Skunk, Sloth, Leopard, Red Panda, Dingo, Giant Anteater, Cougar, Bighorn Sheep, Wild Boar, Coyote, African Wild Dog, Eurasian Lynx, Raccoon, Caribou, Tasmanian Devil, Fennec Fox, Okapi, Warthog, Orca.
- **Birds (21)**: Bald Eagle, Emperor Penguin, Common Ostrich, Peregrine Falcon, Greater Flamingo, Great Horned Owl, Toco Toucan, Common Raven, Wild Turkey, Atlantic Puffin, Snowy Owl, Emu, Andean Condor, Scarlet Macaw, Wandering Albatross, Shoebill Stork, Greater Roadrunner, Secretarybird, Golden Eagle, Barn Owl, Laughing Kookaburra.
- **Reptiles (15)**: Komodo Dragon, Saltwater Crocodile, American Alligator, King Cobra, Green Sea Turtle, Galápagos Giant Tortoise, Gila Monster, Green Anaconda, Veiled Chameleon, Black Mamba, Central Bearded Dragon, Tuatara, Nile Crocodile, Green Iguana, Thorny Devil.
- **Amphibians (7)**: Golden Poison Frog, Axolotl, American Bullfrog, Fire Salamander, Red-eyed Tree Frog, Cane Toad, Hellbender.
- **Fish (7)**: Great White Shark, Whale Shark, Scalloped Hammerhead, Bluefin Tuna, Red-bellied Piranha, Atlantic Salmon, Giant Oceanic Manta Ray.
- **Invertebrates (6)**: Giant Pacific Octopus, Monarch Butterfly, European Mantis, Emperor Scorpion, Goliath Birdeater, Western Honeybee.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
git clone https://github.com/AllanRoz/Spoor.git
cd Spoor
npm install
```

### Run Dev Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🛠️ Production Build

```bash
npm run build
```

This generates an optimized static build in the `dist/` directory with vendor code-splitting and PWA service worker precaching.

You can preview the production build locally with:
```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment

This application is built as a pure client-side static application using `HashRouter` (`/#/play`, `/#/daily`, `/#/field-guide`) and relative Vite paths (`base: './'`). It works on GitHub Pages subpaths like `https://allanroz.github.io/Spoor/` with zero server configuration.

### Automatic Deployment (GitHub Actions)
A workflow is configured in `.github/workflows/deploy.yml`.

To deploy:
1. Push your code to GitHub on `main` or `master`.
2. In your GitHub repository settings, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The workflow will automatically build and deploy your site!