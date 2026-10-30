import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Markdown (and MDX, which inherits the processor) renders $inline$ and $$display$$ math with KaTeX
const math = { remarkPlugins: [remarkMath], rehypePlugins: [rehypeKatex] };

export default defineConfig({
  site: 'https://hiepbk.github.io',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified(math),
  },
});
