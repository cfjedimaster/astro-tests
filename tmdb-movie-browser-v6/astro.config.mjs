// @ts-check
import { defineConfig } from 'astro/config';
import { memoryCache } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
    adapter: netlify(),
    experimental: {
        cache: { provider: memoryCache() },
    },
});