/*
If they have an access token and are NOT on /events, go there
If they don't have one and are ON /events, go to /
*/

export async function onRequest (context, next) {

    console.log('mw!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    let token = await context.session.get('access_token');
    console.log('token from mw');
    console.log('path', context.url.pathname);

    if(token) {

        // are they trying to load / or /callback?
        if(context.url.pathname === '/' || context.url.pathname === '/callback') {
            console.log('redirecting cuz logged in and not events');
            return context.redirect('/events');
        }

    } else if(context.url.pathname === '/events') {
        console.log('redirecting cuz not logged in and events req');
        return context.redirect('/');
    }

    return next();
};