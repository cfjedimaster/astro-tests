import { defineCollection } from 'astro:content';
import fs from 'node:fs/promises';
//import { glob } from 'astro/loaders';

function parseRecipe(txt:string) {
	let result:any = {};
	let lastKey = '';

	let lines = txt.split('\n');

	for(let i=0;i<lines.length;i++) {
		//if the line starts with a tab, its a continutation
		if(lines[i].indexOf('\t') === 0) {		
			result[lastKey] += lines[i].replace('\t', '') + '\n';
		} else {
			let key = lines[i].split(':')[0];
			let rest = lines[i].replace(`${key}: `,'');
			result[key] = rest;
			lastKey = key;
		}
	}

	// lowercase keys and remove spaces, should i also remove the upper case keys?
	for(let key of Object.keys(result)) result[key.toLowerCase().replace(/ /g,'')] = result[key];

	// special handle for ingredients and instructions to turn into arrays
	if(result.ingredients) result.ingredients = result.ingredients.split('\n').map(i => i.trim()).filter(i => i.length > 0);
	if(result.instructions) result.instructions = result.instructions.split('\n').map(i => i.trim()).filter(i => i.length > 0);
	return result;

}

const recipes = defineCollection({ 
	loader: async () => {
		/*
		can't use Astro's glob here because it's doesn't support .txt files
		*/
		const files = (await fs.readdir('./recipes')).filter((file) => file.endsWith('.txt'));
		let r = [];

		for(const file of files) {
			let contents = await fs.readFile(`./recipes/${file}`, 'utf-8');
			let recipe = parseRecipe(contents);

			r.push({
				id: file.replace('.txt',''),
				slug: file.replace('.txt',''),
				recipe
			});

		}

		return r;
   }
});

export const collections = { recipes };