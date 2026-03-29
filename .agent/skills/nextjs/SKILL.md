---
name: Next.js App Router
description: High-performance Next.js 15 guidelines and patterns for AI Agents.
---

# Next.js App Router Patterns

This skill enforces modern development patterns for Next.js 15 projects.

## Main Patterns Enforced

1. **Next.js 15 with App Router only (no Pages Router):**
   - Strictly use the `app/` directory for all layout, routing, and endpoints.
   - Do NOT use or create any components in the deprecated `pages/` directory.

2. **React Server Components (RSC) by default:**
   - Default to Server Components for performance, rendering, and data fetching.
   - Only add the `"use client"` directive when component interactivity (React hooks like `useState`, `useEffect`) or browser APIs are strictly required.

3. **Server Actions for Form Handling:**
   - Handle data mutations and form submissions natively via Next.js Server Actions rather than traditional REST API routes.
   - Place Server Actions either directly in Server Components or separate files marked with `"use server"`.

4. **next-intl for Locale Routing via middleware:**
   - Implement all internationalization (i18n) routing exclusively via Next.js middleware using `next-intl`.
   - Ensure locale dictionaries are effectively managed and statically typed for multiple languages.
