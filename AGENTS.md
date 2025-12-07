# Agent Guidelines for E-commerce Next.js Project

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- No test framework configured yet

## Code Style
- **Framework**: Next.js 16 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Imports**: Use `@/*` path aliases, import React components directly
- **Types**: Strict TypeScript enabled, use `Readonly<>` for props
- **Components**: Default exports, functional components with TypeScript
- **Formatting**: Follow ESLint Next.js config (core-web-vitals + typescript)
- **File Structure**: App Router structure in `app/` directory
- **Fonts**: Use Geist Sans/Mono from next/font/google with CSS variables
- **Dark Mode**: Support via prefers-color-scheme and CSS variables