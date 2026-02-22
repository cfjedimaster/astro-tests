export const prerender = false;

const MASTODON_TOKEN = process.env.MASTODON_TOKEN;
const MASTODON_SERVER = process.env.MASTODON_SERVER;

export async function POST({ params, request }) {

    const body = await request.json();

    let response = {
        ok: false
    }

    // check for env values (this shouldn't ever run as check returns false, but just in case
    if(!MASTODON_TOKEN || !MASTODON_SERVER) {
        response.error = 'Missing env values for MASTODON_TOKEN or MASTODON_SERVER';
    } else if(!body.post.content) {
        response.error = 'Missing content in request body';
    } else {

        let postData = new FormData();
        postData.append('status', body.post.content);

        // check for image
        if(body.post.image) {
            let mediaPost = new FormData();
            mediaPost.append('file', body.post.image);
            mediaPost.append('description', body.post.altText || '');

            let mediaResponse = await fetch(`${MASTODON_SERVER}/api/v2/media`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${MASTODON_TOKEN}`
                },
                body: mediaPost
            });

            let mediaResult = await mediaResponse.json();

            postData.append('media_ids[]', mediaResult.id);
        }


        await fetch(`${MASTODON_SERVER}/api/v1/statuses`, {
            method: 'POST',
            body: postData,
            headers: {
                'Authorization': `Bearer ${MASTODON_TOKEN}`
            }
        })
        .then(res => {
            if(res.ok) {
                response.ok = true;
            } else {
                response.error = `Mastodon API error: ${res.status} ${res.statusText}`;
            }
        })
        .catch(error => {
            response.error = `Error connecting to Mastodon API: ${error.message}`;
        })
    }

    return new Response(
        JSON.stringify(response),
    );

}