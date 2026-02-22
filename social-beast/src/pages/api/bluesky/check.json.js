const BLUESKY_USERNAME = process.env.BLUESKY_USERNAME;
const BLUESKY_PASSWORD = process.env.BLUESKY_PASSWORD;

export async function GET({ params, request }) {

  let response = {
    ready: false
  }

  // check for env values 
  if(!BLUESKY_USERNAME || !BLUESKY_PASSWORD) {
    response.error = 'Missing env values for BLUESKY_USERNAME or BLUESKY_PASSWORD';
  } else {

    let body = {
        identifier: BLUESKY_USERNAME,
        password: BLUESKY_PASSWORD
    };

    await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(res => {
      if(res.ok) {
        response.ready = true;
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
