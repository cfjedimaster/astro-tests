import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';


// 4. Define your collection(s)
const snippets = defineCollection({ 
    loader: glob({pattern: '*.md', base:'./snippets/'}),
});

// 5. Export a single `collections` object to register your collection(s)
export const collections = { snippets };