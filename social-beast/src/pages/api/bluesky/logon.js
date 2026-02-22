export async function loginToBluesky() {

    const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
    const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

    if(!BLUESKY_USERNAME || !BLUESKY_PASSWORD) {   
        console.error('Missing env values for BLUESKY_USERNAME or BLUESKY_PASSWORD');
        return null;
    }

    let body = {
        identifier: BLUESKY_USERNAME,
        password: BLUESKY_PASSWORD
    };

    try {
        let response = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if(response.ok) {
            let data = await response.json();
            //console.log('Bluesky session data:', data);
            return { auth: data };
        } else {
            console.error(`Bluesky API error: ${response.status} ${response.statusText}`);
            return { error : `Bluesky API error: ${response.status} ${response.statusText}` };
        }
    } catch (error) {
        console.error(`Error connecting to Bluesky API: ${error.message}`);
        return { error: `Error connecting to Bluesky API: ${error.message}` };
    }
}