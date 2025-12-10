import artists from '@data/artists.json';

export function GET() {
    return new Response(JSON.stringify(artists), {
    headers: {
        'content-type': 'application/json'
    },
    });
};