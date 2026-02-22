export const prerender = false;

import { loginToBluesky } from "./logon";

const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;

export async function POST({ params, request }) {

    const body = await request.json();

    let response = {
        ok: false
    }

    let authCheck = await loginToBluesky();
    if(authCheck && authCheck.error) {
        response.error = authCheck.error;

    } else {
        
        let postBody = {
            repo:BLUESKY_USERNAME, 
            collection:"app.bsky.feed.post", 
            record: {
                text:body.post.content,
                createdAt: new Date().toISOString()

            }
        };

        // check for image
        if(body.post.image) {

            body.post.image = body.post.image.replace(/^data:image\/\w+;base64,/, "");
            let imageBuffer = Buffer.from(body.post.image, 'base64');

            let mediaResponse = await fetch('https://bsky.social/xrpc/com.atproto.repo.uploadBlob', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${authCheck.auth.accessJwt}`,
                    'Content-Type': 'image/jpeg'
                },
                body: imageBuffer
            });

            let mediaResult = await mediaResponse.json();
            //console.log('Media upload result:', mediaResult);

            // modify postBody to include image 
            postBody.record.embed = {
                "$type": "app.bsky.embed.images",
                images: [
                {
                    alt:body.post.altText || '',
                    image: mediaResult.blob
                }
                ]
            }

        }

        await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${authCheck.auth.accessJwt}`
             },
            body: JSON.stringify(postBody)
        })
        .then(res => {
            if(res.ok) {
                response.ok = true;
            } else {
                response.error = `Bluesky API error: ${res.status} ${res.statusText}`;
            }
        })
        .catch(error => {
            response.error = `Error connecting to Bluesky API: ${error.message}`;
        })

    }

    return new Response(
        JSON.stringify(response),
    );

}