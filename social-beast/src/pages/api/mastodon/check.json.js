export const prerender = false;

const MASTODON_TOKEN = process.env.MASTODON_TOKEN;
const MASTODON_SERVER = process.env.MASTODON_SERVER;

export async function GET({ params, request }) {

  let response = {
    ready: false
  }

  // check for env values 
  if(!MASTODON_TOKEN || !MASTODON_SERVER) {
    response.error = 'Missing env values for MASTODON_TOKEN or MASTODON_SERVER';
  } else {
    // try to fetch account info using the token and server
    await fetch(`${MASTODON_SERVER}/api/v1/accounts/verify_credentials`, {
      headers: {
        'Authorization': `Bearer ${MASTODON_TOKEN}`
      }
    })
    .then(res => {
      if(res.ok) {
        response.ready = true;
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