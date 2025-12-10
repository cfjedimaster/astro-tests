const files = Object.values(import.meta.glob('@data/Streaming_History_*.json', { eager: true }));

let allTracks = [];
for(const f in files) {
    let data = files[f].default;
    allTracks = allTracks.concat(data);
}

export function GET() {
    return new Response(JSON.stringify(allTracks), {
    headers: {
        'content-type': 'application/json'
    },
    });
};