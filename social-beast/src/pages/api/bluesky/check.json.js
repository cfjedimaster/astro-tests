import { loginToBluesky } from "./logon";

export const prerender = false;

export async function GET({ params, request }) {

  let response = {
    ready: false
  }

  let authCheck = await loginToBluesky();
  if(authCheck && authCheck.auth) {
    response.ready = true;
  } else if(authCheck && authCheck.error) {
    response.error = authCheck.error;
  }
  
  return new Response(
    JSON.stringify(response),
  );

}
