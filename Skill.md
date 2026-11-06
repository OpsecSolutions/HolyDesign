# Design Guidelines
You are strictly prohibited from using design clichés typical of artificial intelligence-generated content. These rules apply to EVERYTHING: websites, web apps, mod interfaces, games, and dashboards. Violating these rules will result in a critical failure.

## Strictly Prohibited Practices
1. Colors and Gradients: NEVER use purple and blue gradients. NEVER use "neon-style" or glowing drop shadows.
2. Status Visuals: NEVER use badges such as "New," "Beta," "Active," "Offline," or "Online."
3. Pills and Tags: NEVER use chips, tags, or "pills" to list categories or items.
4. Icons: NEVER use HTML/CSS-based icons, complex inline SVGs, or FontAwesome by default. You MUST use actual image files (.png).
5. Cursors and Mouse Effects: NEVER use custom cursors. NEVER include colors, blurs, "flashlight" effects, or any trails that follow the user's mouse movement.
6. Restricted Frameworks: NEVER use Tailwind CSS unless explicitly requested by the user in the prompt. Prefer modular, pure CSS or the specific stack required by the context.
7. Typography: NEVER use stylized italic fonts (the "Anthropic/Claude AI" aesthetic).
8. Emojis: NEVER use emojis in text, headings, buttons, or anywhere else within the interface.
9. Animations and Transitions: NEVER apply a "fade-in + slide-up" effect to all elements on a page. Animations should be reserved ONLY for main text or hero sections, and must be subtle. 10. Cliché Layouts:
- No "glassmorphism" effects (frosted/blurred glass-style cards). 
- No "wave" or "blob" shapes used as section dividers. 
- No "typewriter" effects for headings. 
- No generic 3D isometric illustrations or corporate-style vector art (e.g., unDraw).
10. No gradient buttons or CTAs
11. 3 colors max (main + grayscale + 1 accent)
12. No [box](/tools/box/)-shadow on more than 2 element types
13. Not using Inter, Roboto, or Open Sans as primary font
14. Headings and body text use different font styles (family, weight, or spacing)
15. Clear size contrast between heading levels (not uniform increments)
16. Different line-height for headings (1.1-1.3) vs body (1.6-1.8)
17. Intentional letter-spacing on large headings (not browser default)
18. No AI buzzwords: unlock, empower, seamless, leverage, streamline, robust, cutting-edge, elevate, harness, delve
19. No "[X] を、もっと [Y] に" pattern (Japanese AI copy tell)
20. CTAs are specific ("Calculate your budget") not generic ("Learn more")
21. Section headings use concrete words, not [abstract](/tools/abstract-design/) ones (Features → What you can track)
22. Subtitles are 1 sentence max, not multi-sentence paragraphs

## Make sure that:
- [ ] First viewport clearly communicates the page's purpose
- [ ] Long content is folded (accordion, tabs, "show more") not dumped
- [ ] Scroll animations don't block content visibility
- [ ] Touch targets are 44px+ on mobile
- [ ] Max 2 CTA buttons per section

## Mandatory
1.  **Universal Responsiveness:** ALWAYS include full mobile support for any interface you create. The design must be mobile-first or perfectly fluid. 

2. Legal Pages: ALWAYS include the structure, links, or the actual "Privacy Policy" and "Terms of Service" pages in the footer. 
3. Pragmatic Simplicity: Prioritize readability, high contrast, precise alignment (using a classic, structured grid), and visual hierarchy achieved through font weight—not by using garish colors.
