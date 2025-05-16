This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```



# How to Set Up a Modern Next.js 15 Project with Tailwind CSS v4, React 18 & ShadCN UI

In this guide, we'll walk through how to create a modern web project using:

- Next.js 15 (App Router)
- Tailwind CSS v4
- **React 18**
- **ShadCN UI (latest)**

This is perfect for anyone looking to build a fast, modern, and beautifully styled application.

**Prerequisites**

Make sure you have the following installed:

- Node.js `v18` or higher
- npm or yarn or pnpm
- Git

# **1. C**reate a New Next.js 15 Project

```jsx
npx create-next-app@latest my-modern-app
```

Choose the following options during setup:

- TypeScript – **Yes**
- App Router – **Yes**
- Tailwind CSS – **No** (we'll manually install Tailwind v4)
- ESLint – **Yes**
- src/ directory – **Yes**
- import alias – `@/*`

# 2. Update React & Next.js in `package.json`

```jsx
"next": "15.3.2",
"react": "18.3.1",
"react-dom": "18.3.1
```

Then run:

```jsx
npm install
```

# 3. Install Tailwind CSS v4

**01, Install Tailwind CSS**

```jsx
npm install tailwindcss @tailwindcss/postcss postcss
```

**02.Add Tailwind to your PostCSS configuration**

Add **`@tailwindcss/postcss`** to your **`postcss.config.mjs`** file, or wherever PostCSS is configured in your project.

```jsx
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  }
}
```

**03.Import Tailwind CSS**

Add an **`@import`** to your CSS file that imports Tailwind CSS.

```jsx
@import "tailwindcss";
```

**04.Start your build process**

Run your build process with **`npm run dev`** or whatever command is configured in your **`package.json`** file.

```jsx
npm run dev
```

# 4 .  Install ShadCN UI (Latest)

Run the ShadCN setup command:

```jsx
pnpm dlx shadcn@latest init
```

After setup, you can install any component:

```
 npx shadcn@latest add button
```

# 5.Test Everything is Working

In `src/app/page.tsx`, try adding:

```jsx
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Button variant="destructive" size="lg">Click Me</Button>
    </main>
  );
}
```
