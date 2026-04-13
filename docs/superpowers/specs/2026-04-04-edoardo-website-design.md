# Design Document: Edoardo Balzano's Digital Garden & Portfolio

**Project Type**: Astro.js Personal Website
**Aesthetic**: Monochrome-Modern, Dark Green, Minimal
**Core Goal**: Sharing cybersecurity notes (HTB, etc.) and acting as a professional CV.

## 1. Architecture & Tech Stack

*   **Framework**: [Astro 5.x](https://astro.build/) (Static Site Generation).
*   **Styling**: TailwindCSS for utility-first styling with custom dark green color themes.
*   **Content Management**: Astro Content Collections for Markdown/MDX files.
*   **Typography**:
    *   **Text**: [Lexend](https://fonts.google.com/specimen/Lexend) (Modern, accessible, and clean).
    *   **Code**: [Fira Code](https://fonts.google.com/specimen/Fira+Code) (Technical, with programming ligatures).
*   **Icons**: [Lucide-Astro](https://lucide.dev/) (Clean, consistent iconography).

*   **Animations**: 
    *   [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/) (Native, smooth page-to-page navigation).
    *   [Motion](https://motion.dev/) (Lightweight animation library for reveal-on-scroll and page-load effects).

## 2. Visual Design (Monochrome-Modern)

*   **Primary Background**: Deep Forest Green (`#0a1a12` or similar).
*   **Accent Colors**:
    *   **Primary**: Sage Green or a slightly brighter Forest Green for borders and highlights.
    *   **Text**: Off-white/Light Gray for high readability on dark backgrounds.
*   **Layout**:
    *   **Desktop**: Collapsible Left Sidebar. When expanded, it shows Name, Bio, and Links. When collapsed, it minimizes to a narrow strip showing only Icons/Emojis for each section.
    *   **Mobile**: Collapsible sidebar or bottom navigation bar.
    *   **Content Navigation**: Sticky Table of Contents (ToC) on the right side for long posts, with active link highlighting based on scroll position.
*   **Motion & Interaction**:
    *   **Page Load**: Subtle fade-in and slide-up for content sections.
    *   **Scroll**: Reveal-on-scroll animations for NoteCards and section headers.
    *   **Hover**: Smooth scaling and border-color transitions for links and cards.

## 3. Structure & Navigation

*   **Sidebar Navigation**:
    *   **Identity**: Edoardo Balzano (Name + Short Bio).
    *   **Links**:
        *   Home (Latest Notes & Writeups)
        *   Cybersecurity Notes (`/notes`)
        *   HTB Writeups (`/writeups`)
        *   About / CV (`/cv`)
    *   **Socials**: GitHub, LinkedIn, TryHackMe/HTB profiles.

*   **Content Pages**:
    *   **Notes/Writeups**: Minimal header, date, estimated reading time, and clean typography.
    *   **CV**: A professional, printable-ready page with the same styling but focused on experience and skills.

## 4. Content Strategy

*   **Source**: Markdown/MDX files stored in `src/content/`.
*   **Integration**: Simple file-based workflow, compatible with moving files from an Obsidian vault.
*   **Features**:
    *   Syntax highlighting for code blocks (using Astro's built-in Shiki).
    *   Table of contents for longer writeups.

## 5. Components

*   `BaseLayout.astro`: Wrapper with Sidebar and Content Container.
*   `Sidebar.astro`: Left-side navigation component.
*   `NoteCard.astro`: Minimal list/grid items for content previews.
*   `Tag.astro`: Subtle badges for categorizing notes.

## 6. Success Criteria

*   **Performance**: Near 100/100 Lighthouse scores (Astro default).
*   **Readability**: High contrast and excellent typography (Lexend/Fira Code).
*   **Consistency**: A cohesive "Dark Green" feel throughout the entire experience.
