import { defineCollection } from 'astro:content';

import { glob, file } from 'astro/loaders';


const blog = defineCollection({ 
    loader: glob({pattern:"**/*.md",base:"./posts"})
 });

export const collections = { blog  };