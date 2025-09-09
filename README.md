# FinTrack - Personal Finance Management App

A modern, beautiful personal finance tracking application built with Next.js, featuring transaction management, loan tracking, and GitHub authentication.

## Features

- 🔐 **GitHub Authentication** - Secure sign-in with GitHub OAuth
- 💰 **Transaction Management** - Track income and expenses with beautiful animations
- 🏦 **Loan Tracking** - Manage money you've lent or borrowed
- 🎨 **Modern UI** - Beautiful bubblegum-themed design with smooth animations
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🌙 **Dark Mode** - Toggle between light and dark themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- GitHub OAuth App (for authentication)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth App Configuration
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Backend API URL (if different from frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
   - **Homepage URL**: `http://localhost:3000`
3. Copy the Client ID and Client Secret to your `.env.local` file

### Installation

First, install dependencies and run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
