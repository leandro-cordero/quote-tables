# Quote Tables 🏗️
[![Run Tests](https://github.com/leandro-cordero/quote-tables/actions/workflows/test.yml/badge.svg)](https://github.com/leandro-cordero/quote-tables/actions/workflows/test.yml)

Welcome to **Quote Tables**! This repository is a public showcase of an advanced, interactive quotation table built for the construction and services industry. It demonstrates handling complex, deeply nested data structures, optimistic UI updates, and real-time financial calculations.

*Note for Recruiters: This project was built by **Leandro Cordero**. It has been explicitly scoped down from my real SaaS application, **Metrik**, into a standalone portfolio piece to demonstrate core frontend and state management engineering skills without the friction of authentication or onboarding.*

## 🚀 Key Features

- **Infinite Nested Hierarchies (Chapters & Subchapters):** Uses recursive React components (`ChapterSection`) to render an N-depth tree of quote chapters and their respective work items.
- **Dynamic Financial Derivations:** Calculates internal costs, commercial costs, and margins on the fly from the lowest leaf node (Work Item) up to the root quote, dynamically rolling up the numbers.
- **Optimistic UI Updates:** Provides instantaneous feedback. Operations like updating a work item's cost or quantity immediately reflect in the UI and automatically update the React Query cache, ensuring a snappy user experience.
- **Debounced Mutations:** Form inputs automatically save to the database using debounced hooks, reducing unnecessary API calls while maintaining a seamless, "save-less" experience.
- **Dark Mode Native Elements:** A sophisticated SCSS architecture combined with Tailwind CSS v4 for layout, including custom `color-scheme` implementations to ensure native dropdowns and scrollbars perfectly match the dark theme.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **State Management & Caching:** `@tanstack/react-query` v5
- **Styling:** Tailwind CSS v4 + SCSS + CSS Variables
- **Backend/Database:** Supabase (PostgreSQL)
- **Language:** TypeScript

## 🧠 Architectural Highlights

### 1. State Management (React Query as the Single Source of Truth)
Instead of relying on heavy global state managers like Redux or Zustand, this application uses `react-query` to manage the central state (`financialData`). Mutations directly update the cache via `setQueryData`, causing the UI to accurately recalculate totals locally without needing to constantly refetch the entire tree from the server.

### 2. Recursive Rendering
The data is mapped into a structured `ChapterNode` tree on the client (`utils/mappers.ts`). The `ChapterSection.tsx` component recursively renders itself to handle infinitely deep subchapters, dynamically indenting and organizing the DOM structure cleanly.

### 3. Database Interactions via RPCs
To guarantee atomicity and simplify the frontend, complex database actions (like upserting a work item and recalculating order indexes) are handled on the backend via PostgreSQL functions (RPCs). The frontend calls these endpoints through the Supabase client.

## 🧪 Testing & CI/CD

This repository includes testing practices using **Jest** and **React Testing Library**:
- **Unit & Logic Tests:** Pure functions and data transformers (e.g., recursive tree builders) are tested to ensure robust data integrity.
- **Component Tests:** UI components are tested using semantic, accessible DOM queries (`getByRole`, `getByText`), validating proper rendering and state handling without relying on brittle `data-testid` selectors.
- **Hook & Integration Tests:** Custom React Query hooks are tested inside a mocked `QueryClientProvider` to specifically validate complex behaviors like optimistic UI updates and cache manipulation.

**Continuous Integration (CI):** A GitHub Actions workflow (`test.yml`) runs the test suite on every push to `master` and on all Pull Requests, ensuring code reliability prior to deployment.

## 🌐 Live Demo

I invite you to explore the live, fully functional application here:
👉 **[https://quote-table.netlify.app/](https://quote-table.netlify.app/)**

You can test out the dynamic tree structure by adding chapters, subchapters, and work items, and watch the state instantly recalculate in real-time.

---

*Thank you for taking the time to review my code! I'm Leandro Cordero, and I'd be happy to discuss any of the design patterns or architectural choices implemented in this repository.*
