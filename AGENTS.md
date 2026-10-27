<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Styling architecture

Use Tailwind CSS 4 utilities by default for new components and redesigns. Keep
component layouts and standard interaction states in utility classes; reuse
shared utility recipes for repeated controls. Preserve existing semantic brand
tokens. Keep globals.css for Tailwind configuration, design tokens, fonts,
resets, and genuinely global styles. Use CSS Modules only for requirements that
cannot be expressed cleanly with utilities, and document the reason. Styling
cleanups must preserve existing visual design and accessible behavior.
