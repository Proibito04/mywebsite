# Edoardo Balzano Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a minimal, dark green Astro.js website with a collapsible sidebar, smooth animations, and a reading-optimized layout for cybersecurity notes and HTB writeups.

**Architecture:** A static site using Astro 5.x with Content Collections for Markdown-based notes and writeups. A fixed/collapsible sidebar handles navigation, while long-form content includes a sticky, scroll-tracking Table of Contents.

**Tech Stack:** Astro, TailwindCSS, Motion, Lucide-Astro, Lexend (Text), Fira Code (Code), View Transitions.

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Create package.json with dependencies**

```json
{
  "name": "edoardo-website",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/tailwind": "^6.0.0",
    "astro": "^5.0.0",
    "lucide-astro": "^0.479.0",
    "motion": "^11.11.17",
    "tailwindcss": "^3.4.1",
    "@fontsource/lexend": "^5.1.0",
    "@fontsource/fira-code": "^5.1.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5"
  }
}
```

- [ ] **Step 2: Create astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static'
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

- [ ] **Step 4: Create src/env.d.ts**

```typescript
/// <reference types="astro/client" />
```

- [ ] **Step 5: Run npm install**

Run: `npm install`
Expected: SUCCESS

- [ ] **Step 6: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts package-lock.json
git commit -m "chore: initialize astro project with tailwind"
```

---

### Task 2: Configure Tailwind and Design Tokens

**Files:**
- Create: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Create tailwind.config.mjs with custom colors and fonts**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'forest-deep': '#0a1a12',
        'forest-dark': '#0f241a',
        'forest-muted': '#1a3d2e',
        'sage-green': '#86a693',
        'off-white': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2: Create src/styles/global.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}

body {
  @apply bg-forest-deep text-off-white font-sans selection:bg-sage-green/30;
}

pre, code {
  @apply font-mono;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.mjs src/styles/global.css
git commit -m "style: configure tailwind colors and fonts"
```

---

### Task 3: Setup Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/notes/example-note.md`
- Create: `src/content/writeups/example-writeup.md`

- [ ] **Step 1: Create src/content/config.ts**

```typescript
import { defineCollection, z } from 'astro:content';

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    machine: z.string().optional(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, writeups };
```

- [ ] **Step 2: Create example note and writeup**

`src/content/notes/example-note.md`:
```markdown
---
title: "Cybersecurity Basics"
description: "Introductory notes on cybersecurity fundamentals."
pubDate: 2026-04-04
tags: ["basics", "intro"]
---
Welcome to my cybersecurity notes!
```

`src/content/writeups/example-writeup.md`:
```markdown
---
title: "HTB: Lame"
description: "Walkthrough for the HTB Lame machine."
pubDate: 2026-04-04
machine: "Lame"
difficulty: "Easy"
tags: ["HTB", "linux", "metasploit"]
---
# HTB: Lame Walkthrough
This is how I pawned Lame.
```

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts src/content/notes/example-note.md src/content/writeups/example-writeup.md
git commit -m "feat: setup content collections and example content"
```

---

### Task 4: Base Layout and Collapsible Sidebar

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Sidebar.astro`

- [ ] **Step 1: Create Sidebar.astro with collapsible logic**

```astro
---
import { Home, Notebook, Terminal, User, ChevronLeft, ChevronRight } from 'lucide-astro';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/notes', icon: Notebook, label: 'Notes' },
  { href: '/writeups', icon: Terminal, label: 'Writeups' },
  { href: '/cv', icon: User, label: 'About/CV' },
];
---

<aside id="sidebar" class="fixed top-0 left-0 h-full bg-forest-dark border-r border-forest-muted transition-all duration-300 z-50 w-64 group data-[collapsed=true]:w-16">
  <div class="flex flex-col h-full p-4 overflow-hidden">
    <div class="mb-8 flex items-center justify-between min-h-[40px]">
      <span class="text-xl font-bold text-sage-green group-data-[collapsed=true]:hidden whitespace-nowrap">Edoardo B.</span>
      <button id="sidebar-toggle" class="p-1 hover:bg-forest-muted rounded-md text-sage-green">
        <div id="toggle-icon-expanded" class="group-data-[collapsed=true]:hidden"><ChevronLeft /></div>
        <div id="toggle-icon-collapsed" class="hidden group-data-[collapsed=true]:block"><ChevronRight /></div>
      </button>
    </div>

    <nav class="space-y-4 flex-grow">
      {navItems.map(({ href, icon: Icon, label }) => (
        <a href={href} class="flex items-center gap-4 p-2 hover:bg-forest-muted rounded-lg text-off-white group/link transition-colors">
          <Icon class="w-6 h-6 shrink-0 text-sage-green" />
          <span class="group-data-[collapsed=true]:hidden whitespace-nowrap font-medium">{label}</span>
        </a>
      ))}
    </nav>
  </div>
</aside>

<script>
  function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    if (!sidebar || !toggle) return;

    // Load initial state
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    sidebar.dataset.collapsed = String(isCollapsed);

    toggle.addEventListener('click', () => {
      const currentlyCollapsed = sidebar.dataset.collapsed === 'true';
      const newState = !currentlyCollapsed;
      sidebar.dataset.collapsed = String(newState);
      localStorage.setItem('sidebar-collapsed', String(newState));
    });
  }

  setupSidebar();
  document.addEventListener('astro:after-swap', setupSidebar);
</script>
```

- [ ] **Step 2: Create BaseLayout.astro with View Transitions**

```astro
---
import { ClientRouter } from 'astro:transitions';
import Sidebar from '../components/Sidebar.astro';
import '../styles/global.css';
import '@fontsource/lexend';
import '@fontsource/fira-code';

const { title } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title} | Edoardo Balzano</title>
    <ClientRouter />
  </head>
  <body>
    <Sidebar />
    <main class="ml-16 group-data-[collapsed=false]:ml-64 transition-all duration-300 p-8 max-w-5xl mx-auto">
      <slot />
    </main>
  </body>
</html>

<script>
  // Simple listener to update main margin based on sidebar state
  function updateMargin() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('main');
    if (sidebar && main) {
      if (sidebar.dataset.collapsed === 'true') {
        main.classList.remove('ml-64');
        main.classList.add('ml-16');
      } else {
        main.classList.remove('ml-16');
        main.classList.add('ml-64');
      }
    }
  }

  const observer = new MutationObserver(updateMargin);
  const sidebar = document.getElementById('sidebar');
  if (sidebar) observer.observe(sidebar, { attributes: true, attributeFilter: ['data-collapsed'] });
  updateMargin();
</script>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/components/Sidebar.astro
git commit -m "feat: implement collapsible sidebar and base layout"
```

---

### Task 5: Animations with Motion

**Files:**
- Create: `src/components/AnimatedSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create AnimatedSection.astro**

```astro
---
---
<div class="animate-on-scroll opacity-0 translate-y-8">
  <slot />
</div>

<script>
  import { inView, animate } from "motion";

  function setupAnimations() {
    inView(".animate-on-scroll", ({ target }) => {
      animate(target, { opacity: 1, y: 0 }, { duration: 0.6, easing: "ease-out" });
    });
  }

  setupAnimations();
  document.addEventListener('astro:after-swap', setupAnimations);
</script>
```

- [ ] **Step 2: Create Home Page with animations**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AnimatedSection from '../components/AnimatedSection.astro';
import { getCollection } from 'astro:content';

const latestNotes = (await getCollection('notes')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 3);
const latestWriteups = (await getCollection('writeups')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()).slice(0, 3);
---

<BaseLayout title="Home">
  <AnimatedSection>
    <section class="mb-16">
      <h1 class="text-5xl font-bold text-sage-green mb-4">Edoardo Balzano</h1>
      <p class="text-xl text-off-white/80 max-w-2xl">
        Cybersecurity Student | HTB Enthusiast | Learning to build and break things securely.
      </p>
    </section>
  </AnimatedSection>

  <div class="grid md:grid-cols-2 gap-12">
    <AnimatedSection>
      <section>
        <h2 class="text-2xl font-bold mb-6 border-b border-forest-muted pb-2">Latest Notes</h2>
        <div class="space-y-4">
          {latestNotes.map(note => (
            <a href={`/notes/${note.slug}`} class="block p-4 bg-forest-dark border border-forest-muted rounded-lg hover:border-sage-green transition-colors">
              <h3 class="font-bold text-sage-green">{note.data.title}</h3>
              <p class="text-sm text-off-white/60">{note.data.description}</p>
            </a>
          ))}
        </div>
      </section>
    </AnimatedSection>

    <AnimatedSection>
      <section>
        <h2 class="text-2xl font-bold mb-6 border-b border-forest-muted pb-2">Latest Writeups</h2>
        <div class="space-y-4">
          {latestWriteups.map(writeup => (
            <a href={`/writeups/${writeup.slug}`} class="block p-4 bg-forest-dark border border-forest-muted rounded-lg hover:border-sage-green transition-colors">
              <h3 class="font-bold text-sage-green">{writeup.data.title}</h3>
              <p class="text-sm text-off-white/60">{writeup.data.description}</p>
            </a>
          ))}
        </div>
      </section>
    </AnimatedSection>
  </div>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedSection.astro src/pages/index.astro
git commit -m "feat: add scroll animations and home page content"
```

---

### Task 6: Table of Contents and Markdown Layout

**Files:**
- Create: `src/components/TableOfContents.astro`
- Create: `src/layouts/MarkdownLayout.astro`
- Create: `src/pages/notes/[slug].astro`
- Create: `src/pages/writeups/[slug].astro`

- [ ] **Step 1: Create TableOfContents.astro**

```astro
---
const { headings } = Astro.props;
---

<nav class="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block w-64 ml-8 border-l border-forest-muted pl-4">
  <h4 class="text-xs font-bold uppercase tracking-wider text-sage-green/60 mb-4">On this page</h4>
  <ul class="space-y-2 text-sm">
    {headings.map((h) => (
      <li class={`toc-item pl-${(h.depth - 1) * 2}`}>
        <a href={`#${h.slug}`} class="text-off-white/60 hover:text-sage-green transition-colors" data-slug={h.slug}>
          {h.text}
        </a>
      </li>
    ))}
  </ul>
</nav>

<script>
  function setupToC() {
    const items = document.querySelectorAll('.toc-item a');
    const sections = Array.from(items).map(a => document.getElementById(a.getAttribute('data-slug')));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          items.forEach(a => a.classList.remove('text-sage-green', 'font-bold'));
          const active = document.querySelector(`.toc-item a[data-slug="${entry.target.id}"]`);
          if (active) active.classList.add('text-sage-green', 'font-bold');
        }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });

    sections.forEach(s => s && observer.observe(s));
  }

  setupToC();
  document.addEventListener('astro:after-swap', setupToC);
</script>
```

- [ ] **Step 2: Create MarkdownLayout.astro**

```astro
---
import BaseLayout from './BaseLayout.astro';
import TableOfContents from '../components/TableOfContents.astro';

const { frontmatter, headings } = Astro.props;
---

<BaseLayout title={frontmatter.title}>
  <div class="flex flex-col lg:flex-row gap-8">
    <article class="prose prose-invert prose-headings:text-sage-green prose-a:text-sage-green prose-code:text-off-white max-w-none flex-grow">
      <header class="mb-12 border-b border-forest-muted pb-8">
        <h1 class="text-4xl font-bold mb-2">{frontmatter.title}</h1>
        <div class="text-off-white/60 flex gap-4 text-sm">
          <span>{new Date(frontmatter.pubDate).toLocaleDateString()}</span>
          {frontmatter.machine && <span>Machine: {frontmatter.machine}</span>}
        </div>
      </header>
      <slot />
    </article>
    <TableOfContents headings={headings} />
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create Dynamic Routes for Notes and Writeups**

`src/pages/notes/[slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import MarkdownLayout from '../../layouts/MarkdownLayout.astro';

export async function getStaticPaths() {
  const notes = await getCollection('notes');
  return notes.map(entry => ({
    params: { slug: entry.slug }, props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---
<MarkdownLayout frontmatter={entry.data} headings={headings}>
  <Content />
</MarkdownLayout>
```

`src/pages/writeups/[slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import MarkdownLayout from '../../layouts/MarkdownLayout.astro';

export async function getStaticPaths() {
  const writeups = await getCollection('writeups');
  return writeups.map(entry => ({
    params: { slug: entry.slug }, props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings } = await render(entry);
---
<MarkdownLayout frontmatter={entry.data} headings={headings}>
  <Content />
</MarkdownLayout>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/TableOfContents.astro src/layouts/MarkdownLayout.astro src/pages/notes/[slug].astro src/pages/writeups/[slug].astro
git commit -m "feat: implement Markdown layout and Table of Contents"
```

---

### Task 7: Final Pages (CV, Lists)

**Files:**
- Create: `src/pages/cv.astro`
- Create: `src/pages/notes/index.astro`
- Create: `src/pages/writeups/index.astro`

- [ ] **Step 1: Create CV page**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AnimatedSection from '../components/AnimatedSection.astro';
---

<BaseLayout title="CV / About">
  <AnimatedSection>
    <h1 class="text-4xl font-bold text-sage-green mb-8">Curriculum Vitae</h1>
    <div class="prose prose-invert prose-headings:text-sage-green max-w-none">
      <h2>Professional Summary</h2>
      <p>Passionate cybersecurity student focusing on penetration testing and secure software development.</p>
      
      <h2>Education</h2>
      <ul>
        <li><strong>Cybersecurity Degree</strong> | 2024 - Present</li>
      </ul>

      <h2>Skills</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose">
        {['Network Security', 'Penetration Testing', 'Linux', 'Astro.js', 'Python', 'Docker'].map(skill => (
          <div class="p-2 border border-forest-muted rounded text-center text-sm">{skill}</div>
        ))}
      </div>
    </div>
  </AnimatedSection>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/cv.astro src/pages/notes/index.astro src/pages/writeups/index.astro
git commit -m "feat: add CV and list pages"
```
