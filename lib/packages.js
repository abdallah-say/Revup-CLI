/**
 * Categorized list of optional packages for React + Vite projects.
 */
export const packagesList = [
  // Styling & UI
  {
    value: "tailwindcss",
    label: "Tailwind CSS v4",
    pkg: "tailwindcss @tailwindcss/vite",
    dev: true,
    hint: "Utility-first CSS framework with Vite integration",
  },
  {
    value: "lucide-react",
    label: "Lucide Icons",
    pkg: "lucide-react",
    dev: false,
    hint: "Clean, consistent icon library for React",
  },
  {
    value: "react-icons",
    label: "React Icons",
    pkg: "react-icons",
    dev: false,
    hint: "Popular icon framework aggregator",
  },

  // Routing & Navigation
  {
    value: "react-router-dom",
    label: "React Router DOM",
    pkg: "react-router-dom",
    dev: false,
    hint: "Standard declarative routing library",
  },

  // State Management & Data Fetching
  {
    value: "tanstack-query",
    label: "TanStack Query (React Query)",
    pkg: "@tanstack/react-query",
    dev: false,
    hint: "Async state management and data fetching",
  },
  {
    value: "zustand",
    label: "Zustand",
    pkg: "zustand",
    dev: false,
    hint: "Bear-essential, fast state management",
  },
  {
    value: "redux",
    label: "Redux & Redux Toolkit",
    pkg: "@reduxjs/toolkit react-redux",
    dev: false,
    hint: "Global state management framework",
  },

  // Forms & Validation
  {
    value: "forms",
    label: "React Hook Form + Zod",
    pkg: "react-hook-form zod @hookform/resolvers",
    dev: false,
    hint: "Performant form handling and schema validation",
  },

  // Animation & Motion
  {
    value: "motion",
    label: "Motion (Framer Motion)",
    pkg: "motion",
    dev: false,
    hint: "Production-ready animation library",
  },
  {
    value: "gsap",
    label: "GSAP",
    pkg: "gsap",
    dev: false,
    hint: "High-performance animations",
  },

  // Utilities
  {
    value: "axios",
    label: "Axios",
    pkg: "axios",
    dev: false,
    hint: "Promise-based HTTP client",
  },
  {
    value: "react-helmet-async",
    label: "React Helmet Async",
    pkg: "react-helmet-async",
    dev: false,
    hint: "Manage document head tags",
  },

  // Testing & Build
  {
    value: "vitest",
    label: "Vitest + React Testing Library",
    pkg: "vitest @testing-library/react @testing-library/jest-dom jsdom",
    dev: true,
    hint: "Vite-native testing framework setup",
  },
  {
    value: "vite-pwa",
    label: "Vite PWA",
    pkg: "vite-plugin-pwa",
    dev: true,
    hint: "Zero-config Progressive Web App support",
  },
  {
    value: "electron",
    label: "Electron",
    pkg: "electron",
    dev: true,
    hint: "Cross-platform desktop application shell",
  },
];
