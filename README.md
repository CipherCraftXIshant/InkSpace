# InkSpace

> An editorial publishing platform designed for thoughtful writers and curious minds.

[![CI Pipeline](https://github.com/CipherCraftXIshant/InkSpace/actions/workflows/ci.yml/badge.svg)](https://github.com/CipherCraftXIshant/InkSpace/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## Overview

**InkSpace** is a modern editorial blog platform built with an emphasis on typography, minimalist design, and high-contrast aesthetics. Inspired by premium publication layouts, InkSpace provides:
- A public reader experience with editorial article presentations, category archives, and interactive exploration.
- An author workspace with metrics tracking, article drafting, and story management.
- An administrative moderation console for content and community oversight.

---

## Tech Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Router DOM 7
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Code Quality**: Oxlint
- **CI/CD**: GitHub Actions (Continuous Integration & GitHub Pages Deployment)

---

## Project Structure

```
InkSpace/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated linting, audit, and build checks
│       └── deploy.yml             # Continuous deployment to GitHub Pages
├── client/
│   ├── public/
│   │   └── favicon.svg            # Platform favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Buttons, Inputs, Skeletons, Dev Navigator
│   │   │   ├── layout/            # Navbar, Footer, Sidebars
│   │   │   └── blog/              # Editorial BlogCard, CategoryCard
│   │   ├── layouts/               # Public, Author Dashboard, Admin Shells
│   │   ├── pages/                 # Public, Author, and Admin routes
│   │   ├── routes/                # React Router mapping
│   │   ├── data/                  # Mock editorial data
│   │   ├── index.css              # Tailwind v4 theme & typography
│   │   └── main.jsx               # Entrypoint
│   ├── package.json
│   └── vite.config.js
├── Server/                        # Prepared for subsequent backend phases
└── LICENSE                        # MIT License
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- npm >= 10.x

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/CipherCraftXIshant/InkSpace.git
cd InkSpace

# Navigate to frontend
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build & Linting

```bash
# Run code linter
npm run lint

# Build for production
npm run build
```

---

## License

This project is licensed under the [MIT License](LICENSE).