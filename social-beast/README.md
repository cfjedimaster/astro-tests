# Social Beast

Social Beast is a web app meant to make it easier to post to multiple social networks at once. It is *not* meant to be run
on a public web server, but rather run locally, opened in your browser, and used on your own machine. It supports posting
to network with just text or text with an image. Currently, it supports:

* Mastodon
* Bluesky

I had considered support for Threads, but I want to avoid oAuth, and Threads requires that. I could add oAuth support but honestly, it doesn't feel
like it's worth the effort. I only mention it because maybe someone will see this and decide to add it anyway. If so, file a PR!

## Setup

After cloning the repo, run `npm i` to install dependencies. The application requires four different environment variables. 

For Mastodon:

* MASTODON_TOKEN - a token created in the developer settings of your profile
* MASTODON_SERVER - the server your account runs on, for example, https://mastodon.social

For Bluesky:

* BLUESKY_USERNAME - your username
* BLUESKY_PASSWORD - your password

Technically, you don't need to supply all 4. The code will check to see which network has auth info and if one doesn't, it will simply not try to post to it. 

## Running

`npm run dev` and open your browser to the specified port. That's it.

## Changelog

| Date | Change |
|------|----------|
| March 8, 2026 | Wrote the readme. Code was done before. Removed Thread mentions. |

