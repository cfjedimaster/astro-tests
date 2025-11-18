import { defineCollection } from 'astro:content';

import { file } from 'astro/loaders';

const films = defineCollection({
    loader:file("./data/films.json", {
        parser: t => {
            let initialData = JSON.parse(t);
            return initialData.map(film => {
                return {
                    id: film.pk, 
                    ...film.fields
                }
            })
        }
    })
});

const people = defineCollection({
    loader:file("./data/people.json", {
        parser: t => {
            let initialData = JSON.parse(t);
            return initialData.map(people => {
                return {
                    id: people.pk, 
                    ...people.fields
                }
            })
        }
    })
});
export const collections = { films, people };