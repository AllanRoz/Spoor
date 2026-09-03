# 🐾 SPOOR — A Mystery Animal Tracking Game

> **Follow the clues. Find the animal.**

**SPOOR** is a complete, production-ready mystery animal tracking web game built with React, Vite, Tailwind CSS, Lucide React, and React Router.

Players investigate realistic animal spoor (footprints), natural habitats, physical dimensions, and feeding habits to deduce unknown creatures from across the globe.

![SPOOR](screenshots/spoor.png)

---

## 🎮 Game Features

- **🐾 Authentic Spoor Visualizer**: Procedurally rendered vector animal footprints (canid, felid, cloven hoof, solid hoof, avian talons & webbing, reptile splay, serpentine, pachyderm, macropod, primate, invertebrate) with real scale dimensions in centimeters and inches.
- **🔍 Progressive Clue Reveal System**:
  - Clue 1: 🐾 Footprint (spoor visualizer + scale ruler)
  - Clue 2: 🌎 Habitat & Geographic Range (ecosystem and distribution)
  - Clue 3: 📏 Physical Dimensions (weight, body length, height/wingspan)
  - Clue 4: 🍖 Diet & Feeding Behavior (carnivore, herbivore, omnivore)
  - Clue 5: 🖼️ Animal Sighting (high-resolution wildlife photograph)
- **🧠 Intelligent Answer Matching & Spelling Assistance**:
  - Normalizes accents, casing, punctuation, and leading articles.
  - Recognizes common aliases (e.g. *wolf*, *grey wolf*, *gray wolf*).
  - Fuzzy misspelling detector catches typos (e.g. *"elefant"* -> *"Did you mean Elephant?"*) with a 25% score adjustment upon confirmation.
- **🔥 Dynamic Scoring & Streak System**:
  - 100 points for guessing after Clue 1 down to 20 points after Clue 5.
  - Tracks active Spoor Streaks and personal best records.
- **🌎 Deterministic Daily Spoor**:
  - A new mystery animal every single calendar day synchronized worldwide.
  - Enforces one playthrough per day using browser storage.
  - Generates spoiler-free emoji share text (e.g. `🐾 🟩 🌎 🟩`).
- **📖 My Field Guide (Collection)**:
  - Personal compendium tracking discovered species out of 107 animals.
  - Filter by animal category or habitat biome, search by name, and inspect discovered creatures in an interactive field modal.
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

This generates an optimized static build in the `dist/` directory.

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